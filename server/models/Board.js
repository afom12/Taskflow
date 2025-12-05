import mongoose from 'mongoose';

const checklistItemSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false }
}, { _id: true });

const cardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  checklist: [checklistItemSchema],
  position: { type: Number, default: 0 }
}, { timestamps: true });

const columnSchema = new mongoose.Schema({
  title: { type: String, required: true },
  position: { type: Number, default: 0 },
  cards: [cardSchema]
}, { timestamps: true });

const boardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  columns: [columnSchema]
}, { timestamps: true });

export default mongoose.model('Board', boardSchema);

