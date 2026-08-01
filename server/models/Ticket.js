import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Ticket title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Ticket description is required'],
      trim: true
    },
    category: {
      type: String,
      enum: [
        'Technical Issue',
        'Payment Issue',
        'Account Issue',
        'Product Enquiry',
        'General Support',
        'Other'
      ],
      default: 'General Support'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Resolved'],
      default: 'Open'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
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

// Query middleware to exclude soft-deleted tickets by default
ticketSchema.pre(/^find/, function(next) {
  if (!this.options.includeDeleted) {
    this.find({ deletedAt: null });
  }
  next();
});

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;
