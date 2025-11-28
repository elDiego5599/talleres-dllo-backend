import mongoose, { Document, Schema, CallbackError } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  permissions: {
    create_book: boolean;
    modify_user: boolean;
    modify_book: boolean;
    disable_user: boolean;
    disable_book: boolean;
  };
  isDeleted: boolean;
  reservations: Array<{
    bookId: mongoose.Types.ObjectId;
    bookName: string;
    reservedAt: Date;
    deliveryAt?: Date;
  }>;
  checkPassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  permissions: {
    create_book: { type: Boolean, default: false },
    modify_user: { type: Boolean, default: false },
    modify_book: { type: Boolean, default: false },
    disable_user: { type: Boolean, default: false },
    disable_book: { type: Boolean, default: false }
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  reservations: [{
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    bookName: String,
    reservedAt: { type: Date, default: Date.now },
    deliveryAt: Date
  }]
}, { timestamps: true });

userSchema.pre('save', async function(this: IUser, next: (err?: CallbackError) => void) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

userSchema.methods.checkPassword = async function(password: string) {
  return bcrypt.compare(password, this.password);
};

userSchema.pre(/^find/, function(this: any, next: (err?: CallbackError) => void) {
  if (!this.getQuery().includeDeleted) {
    this.where({ isDeleted: false });
  }
  next();
});

export default mongoose.model<IUser>('User', userSchema);