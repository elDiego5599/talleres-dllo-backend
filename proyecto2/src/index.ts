import express, { Request, Response, RequestHandler } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import routes from './routes/routes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/biblioteca_db';

app.use(express.json() as any);
app.use(cors());

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error de conexión a MongoDB:', err));
}

app.use('/api', routes);

app.use((req: Request, res: Response) => {
  (res as any).status(404).json({ message: 'Endpoint no encontrado' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
}

export default app;