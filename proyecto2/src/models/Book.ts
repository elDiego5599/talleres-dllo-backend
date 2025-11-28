import mongoose, { Document, Schema, CallbackError } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  genre: string;
  publisher: string;
  publicationDate: Date;
  isAvailable: boolean;
  isDeleted: boolean;
  reservationHistory: Array<{
    userId: mongoose.Types.ObjectId;
    userName: string;
    reservedAt: Date;
    deliveryAt?: Date;
  }>;
}

const bookSchema = new Schema<IBook>({
  title: {
    type: String,
    required: true,
    index: true
  },
  author: {
    type: String,
    required: true,
    index: true
  },
  genre: {
    type: String,
    required: true,
    index: true
  },
  publisher: {
    type: String,
    required: true,
    index: true
  },
  publicationDate: {
    type: Date,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  reservationHistory: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: String,
    reservedAt: { type: Date, default: Date.now },
    deliveryAt: Date
  }]
}, { timestamps: true });

bookSchema.pre(/^find/, function(this: any, next: (err?: CallbackError) => void) {
  if (!this.getQuery().includeDeleted) {
    this.where({ isDeleted: false });
  }
  next();
});

export default mongoose.model<IBook>('Book', bookSchema);