import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../middleware/authMiddleware';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, permissions } = (req as any).body;
    const user = new User({ name, email, password, permissions });
    await user.save();
    
    (res as any).status(201).json({ message: 'Usuario creado exitosamente', userId: user._id });
  } catch (error: any) {
    (res as any).status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = (req as any).body;
    const user = await User.findOne({ email, isDeleted: false });
    
    if (!user || !(await user.checkPassword(password))) {
      return (res as any).status(401).json({ error: 'Credenciales de inicio de sesión inválidas' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '24h' });
    (res as any).json({ user: { id: user._id, name: user.name, email: user.email }, token });
  } catch (error: any) {
    (res as any).status(500).json({ error: error.message });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const targetId = (req as any).params.id;
    const user = (req as any).user!;
    
    const isSelf = user._id.toString() === targetId;
    
    if (!isSelf) {
        return (res as any).status(403).json({ error: 'Acceso denegado' });
    }

    const targetUser = await User.findById(targetId);
    if (!targetUser) return (res as any).status(404).json({ error: 'Usuario no encontrado' });
    
    (res as any).json(targetUser);
  } catch (error: any) {
    (res as any).status(500).json({ error: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const targetId = (req as any).params.id;
    const updates = Object.keys((req as any).body);
    const allowedUpdates = ['name', 'password', 'permissions']; 
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) return (res as any).status(400).json({ error: 'Actualizaciones inválidas' });

    const currentUser = (req as any).user!;
    const isSelf = currentUser._id.toString() === targetId;
    const hasPermission = currentUser.permissions && currentUser.permissions.modify_user;

    if (!isSelf && !hasPermission) {
      return (res as any).status(403).json({ error: 'No autorizado para modificar este usuario.' });
    }

    const userToUpdate = await User.findById(targetId);
    if (!userToUpdate) return (res as any).status(404).json({ error: 'Usuario no encontrado' });

    updates.forEach((update) => (userToUpdate as any)[update] = (req as any).body[update]);
    await userToUpdate.save();

    (res as any).json(userToUpdate);
  } catch (error: any) {
    (res as any).status(400).json({ error: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const targetId = (req as any).params.id;
    const currentUser = (req as any).user!;
    
    const isSelf = currentUser._id.toString() === targetId;
    const hasPermission = currentUser.permissions && currentUser.permissions.disable_user;

    if (!isSelf && !hasPermission) {
      return (res as any).status(403).json({ error: 'No autorizado para inhabilitar este usuario.' });
    }

    const user = await User.findById(targetId);
    if (!user) return (res as any).status(404).json({ error: 'Usuario no encontrado' });

    user.isDeleted = true;
    await user.save();

    (res as any).json({ message: 'Usuario inhabilitado exitosamente' });
  } catch (error: any) {
    (res as any).status(500).json({ error: error.message });
  }
};