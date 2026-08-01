import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    userMessage: {
      type: String,
      required: true,
      trim: true
    },
    aiResponse: {
      type: String,
      required: true
    },
    deletedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Query middleware to exclude soft-deleted chats by default
chatSchema.pre(/^find/, function(next) {
  if (!this.options.includeDeleted) {
    this.find({ deletedAt: null });
  }
  next();
});

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;
