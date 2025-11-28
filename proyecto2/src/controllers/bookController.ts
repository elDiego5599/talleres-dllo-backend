import { Request, Response } from 'express';
import Book from '../models/Book';
import { IUser } from '../models/User';

export const createBook = async (req: Request, res: Response) => {
  try {
    const book = new Book((req as any).body);
    await book.save();
    (res as any).status(201).json(book);
  } catch (error: any) {
    (res as any).status(400).json({ error: error.message });
  }
};

export const getBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findById((req as any).params.id);
    if (!book) return (res as any).status(404).json({ error: 'Libro no encontrado' });
    (res as any).json(book);
  } catch (error: any) {
    (res as any).status(500).json({ error: error.message });
  }
};

export const getBooks = async (req: Request, res: Response) => {
  try {
    const match: any = {};
    const query = (req as any).query;
    
    if (query.genre) match.genre = query.genre;
    if (query.author) match.author = new RegExp(query.author as string, 'i');
    if (query.publisher) match.publisher = query.publisher;
    if (query.publicationDate) match.publicationDate = query.publicationDate;
    if (query.isAvailable) match.isAvailable = query.isAvailable === 'true';
    if (query.title) match.title = new RegExp(query.title as string, 'i');

    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const books = await Book.find(match)
      .select('title')
      .limit(limit)
      .skip(skip);

    const count = await Book.countDocuments(match);

    (res as any).json({
      data: books,
      meta: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        booksPerPage: limit,
        totalBooks: count
      }
    });
  } catch (error: any) {
    (res as any).status(500).json({ error: error.message });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    const updates = Object.keys((req as any).body);
    const allowedUpdates = ['title', 'author', 'genre', 'publisher', 'publicationDate', 'isAvailable'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) return (res as any).status(400).json({ error: 'Actualizaciones inválidas' });

    const book = await Book.findById((req as any).params.id);
    if (!book) return (res as any).status(404).json({ error: 'Libro no encontrado' });

    updates.forEach((update) => (book as any)[update] = (req as any).body[update]);
    await book.save();

    (res as any).json(book);
  } catch (error: any) {
    (res as any).status(400).json({ error: error.message });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findById((req as any).params.id);
    if (!book) return (res as any).status(404).json({ error: 'Libro no encontrado' });

    book.isDeleted = true;
    await book.save();

    (res as any).json({ message: 'Libro inhabilitado exitosamente' });
  } catch (error: any) {
    (res as any).status(500).json({ error: error.message });
  }
};

export const reserveBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.findById((req as any).params.id);
    if (!book || !book.isAvailable) {
      return (res as any).status(400).json({ error: 'Libro no disponible' });
    }

    const user = (req as any).user! as IUser;
    const { deliveryDate } = (req as any).body;
    const reservationData = {
      reservedAt: new Date(),
      deliveryAt: deliveryDate ? new Date(deliveryDate) : undefined
    };

    book.isAvailable = false;
    book.reservationHistory.push({
      userId: user._id,
      userName: user.name,
      ...reservationData
    });
    await book.save();

    user.reservations.push({
      bookId: book._id,
      bookName: book.title,
      ...reservationData
    });
    await user.save();

    (res as any).json({ message: 'Libro reservado', book });
  } catch (error: any) {
    (res as any).status(400).json({ error: error.message });
  }
};