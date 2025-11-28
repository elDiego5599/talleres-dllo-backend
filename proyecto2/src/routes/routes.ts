import express from 'express';
import * as userController from '../controllers/userController';
import * as bookController from '../controllers/bookController';
import { auth, hasPermission } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/users/register', userController.register);

router.post('/users/login', userController.login);

router.get('/users/:id', auth, userController.getUser);

router.put('/users/:id', auth, userController.updateUser);

router.delete('/users/:id', auth, userController.deleteUser);

router.post('/books', auth, hasPermission('create_book'), bookController.createBook);

router.get('/books/:id', bookController.getBook);

router.get('/books', bookController.getBooks);

router.put('/books/:id', auth, hasPermission('modify_book'), bookController.updateBook);

router.delete('/books/:id', auth, hasPermission('disable_book'), bookController.deleteBook);

router.post('/books/:id/reserve', auth, bookController.reserveBook);

export default router;