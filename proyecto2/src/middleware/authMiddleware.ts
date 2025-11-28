import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

export const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_proy_02';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      token?: string;
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const header = (req as any).header('Authorization');
    if (!header) throw new Error();

    const token = header.replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    
    const user = await User.findOne({ _id: decoded.id, isDeleted: false });
    if (!user) throw new Error();

    (req as any).user = user;
    (req as any).token = token;
    next();
  } catch (error) {
    (res as any).status(401).json({ error: 'Por favor autentíquese.' });
  }
};

export const hasPermission = (permissionName: keyof IUser['permissions']) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (permissionName && (req as any).user && !(req as any).user.permissions[permissionName]) {
        return (res as any).status(403).json({ error: 'Acceso denegado. Permisos insuficientes.' });
    }
    next();
  };
};