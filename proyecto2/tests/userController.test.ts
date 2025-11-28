import request from 'supertest';
import app from '../src/index';
import mongoose from 'mongoose';
import User from '../src/models/User';
import { describe, test, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';

let userToken: string;
let userId: string;
let otherUserId: string;

beforeAll(async () => {
  const url = process.env.MONGODB_URI_TEST_USER || 'mongodb://localhost:27017/biblioteca_test_users';
  await mongoose.connect(url);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Pruebas del Controlador de Usuarios', () => {

  beforeEach(async () => {
    await User.deleteMany({});
    
    const user = await new User({ name: 'U1', email: 'u1@test.com', password: 'p1', permissions: { modify_user: false } }).save();
    userId = user._id.toString();

    const other = await new User({ name: 'U2', email: 'u2@test.com', password: 'p2' }).save();
    otherUserId = other._id.toString();

    const res = await request(app).post('/api/users/login').send({ email: 'u1@test.com', password: 'p1' });
    userToken = res.body.token;
  });

  test('Registro: Éxito', async () => {
    const res = await request(app).post('/api/users/register').send({
      name: 'New', email: 'new@test.com', password: 'pass'
    });
    expect(res.statusCode).toBe(201);
  });

  test('Registro: Fallo (Email Duplicado)', async () => {
    await request(app).post('/api/users/register').send({ name: 'D', email: 'dup@test.com', password: 'p' });
    const res = await request(app).post('/api/users/register').send({ name: 'D2', email: 'dup@test.com', password: 'p' });
    expect(res.statusCode).toBe(400);
  });

  test('Login: Éxito', async () => {
    const res = await request(app).post('/api/users/login').send({ email: 'u1@test.com', password: 'p1' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('Login: Fallo (Contraseña Incorrecta)', async () => {
    const res = await request(app).post('/api/users/login').send({ email: 'u1@test.com', password: 'wrong' });
    expect(res.statusCode).toBe(401);
  });

  test('Leer Usuario: Éxito (Propio)', async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe('u1@test.com');
  });

  test('Leer Usuario: Fallo (Otro Usuario - Seguridad)', async () => {
    const res = await request(app)
      .get(`/api/users/${otherUserId}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(403);
  });

  test('Actualizar Usuario: Éxito (Propio)', async () => {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Nombre Actualizado' });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Nombre Actualizado');
  });

  test('Actualizar Usuario: Fallo (Otro Usuario sin permiso)', async () => {
    const res = await request(app)
      .put(`/api/users/${otherUserId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Hacked' });
    expect(res.statusCode).toBe(403);
  });

  test('Eliminar Usuario: Éxito (Propio Soft Delete)', async () => {
    const res = await request(app)
      .delete(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    
    const check = await request(app).post('/api/users/login').send({ email: 'u1@test.com', password: 'p1' });
    expect(check.statusCode).toBe(401);
  });
});