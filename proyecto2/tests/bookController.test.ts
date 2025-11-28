import request from 'supertest';
import app from '../src/index';
import mongoose from 'mongoose';
import User from '../src/models/User';
import Book from '../src/models/Book';
import { describe, test, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';

let token: string;
let adminToken: string;
let bookId: string;

beforeAll(async () => {
  const url = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/biblioteca_test_books';
  await mongoose.connect(url);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Pruebas del Controlador de Libros', () => {
  
  beforeEach(async () => {
    await User.deleteMany({});
    await Book.deleteMany({});

    await new User({
      name: 'Admin',
      email: 'admin@test.com',
      password: 'password123',
      permissions: { create_book: true, modify_book: true, disable_book: true }
    }).save();

    await new User({
      name: 'User',
      email: 'user@test.com',
      password: 'password123'
    }).save();

    const adminRes = await request(app).post('/api/users/login').send({ email: 'admin@test.com', password: 'password123' });
    adminToken = adminRes.body.token;

    const userRes = await request(app).post('/api/users/login').send({ email: 'user@test.com', password: 'password123' });
    token = userRes.body.token;
  });

  test('Crear Libro: Éxito (Admin)', async () => {
    const res = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'T1', author: 'A1', genre: 'G1', publisher: 'P1', publicationDate: '2023-01-01' });
    expect(res.statusCode).toBe(201);
    bookId = res.body._id;
  });

  test('Crear Libro: Fallo (Sin Permiso)', async () => {
    const res = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'T1', author: 'A1', genre: 'G1', publisher: 'P1', publicationDate: '2023-01-01' });
    expect(res.statusCode).toBe(403);
  });

  test('Crear Libro: Fallo (Error de Validación)', async () => {
    const res = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'Faltan Campos' });
    expect(res.statusCode).toBe(400);
  });

  test('Leer Un Libro: Éxito', async () => {
    const book = await Book.create({ title: 'T', author: 'A', genre: 'G', publisher: 'P', publicationDate: new Date() });
    const res = await request(app).get(`/api/books/${book._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('T');
  });

  test('Leer Un Libro: Fallo (No Encontrado)', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/books/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });

  test('Leer Varios Libros: Éxito (Paginación y Filtros)', async () => {
    await Book.create({ title: 'Alpha', author: 'A', genre: 'G', publisher: 'P', publicationDate: new Date() });
    await Book.create({ title: 'Beta', author: 'B', genre: 'G', publisher: 'P', publicationDate: new Date() });

    const res = await request(app).get('/api/books?title=Alpha&limit=10');
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].title).toBe('Alpha');
  });

  test('Actualizar Libro: Éxito (Admin)', async () => {
    const book = await Book.create({ title: 'Old', author: 'A', genre: 'G', publisher: 'P', publicationDate: new Date() });
    const res = await request(app)
      .put(`/api/books/${book._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ title: 'New' });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('New');
  });

  test('Actualizar Libro: Fallo (Sin Permiso)', async () => {
    const book = await Book.create({ title: 'Old', author: 'A', genre: 'G', publisher: 'P', publicationDate: new Date() });
    const res = await request(app)
      .put(`/api/books/${book._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'New' });
    expect(res.statusCode).toBe(403);
  });

  test('Eliminar Libro: Éxito (Soft Delete)', async () => {
    const book = await Book.create({ title: 'Del', author: 'A', genre: 'G', publisher: 'P', publicationDate: new Date() });
    const res = await request(app)
      .delete(`/api/books/${book._id}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    
    const check = await request(app).get(`/api/books/${book._id}`);
    expect(check.statusCode).toBe(404);
  });

  test('Eliminar Libro: Fallo (Sin Permiso)', async () => {
    const book = await Book.create({ title: 'Del', author: 'A', genre: 'G', publisher: 'P', publicationDate: new Date() });
    const res = await request(app)
      .delete(`/api/books/${book._id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(403);
  });

  test('Reservar Libro: Éxito', async () => {
    const book = await Book.create({ title: 'Res', author: 'A', genre: 'G', publisher: 'P', publicationDate: new Date(), isAvailable: true });
    const res = await request(app)
      .post(`/api/books/${book._id}/reserve`)
      .set('Authorization', `Bearer ${token}`)
      .send({ deliveryDate: '2023-12-31' });
    
    expect(res.statusCode).toBe(200);
    
    const updatedBook = await Book.findById(book._id);
    expect(updatedBook?.isAvailable).toBe(false);
    expect(updatedBook?.reservationHistory).toHaveLength(1);
  });

  test('Reservar Libro: Fallo (Ya Reservado)', async () => {
    const book = await Book.create({ title: 'Res', author: 'A', genre: 'G', publisher: 'P', publicationDate: new Date(), isAvailable: false });
    const res = await request(app)
      .post(`/api/books/${book._id}/reserve`)
      .set('Authorization', `Bearer ${token}`)
      .send({ deliveryDate: '2023-12-31' });
    expect(res.statusCode).toBe(400);
  });
});