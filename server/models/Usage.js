import mongoose from 'mongoose';

const UsageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['character_creation', 'api_call', 'image_generation', 'batch_operation'],
    required: true
  },
  metadata: {
    characterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Character'
    },
    modelUsed: String,
    tokensUsed: Number,
    imageCount: Number,
    promptLength: Number,
    executionTime: Number,
    success: {
      type: Boolean,
      default: true
    },
    errorMessage: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  billingPeriod: {
    year: Number,
    month: Number
  }
}, {
  timestamps: true
});

// Index for efficient queries
UsageSchema.index({ user: 1, timestamp: -1 });
UsageSchema.index({ user: 1, type: 1, timestamp: -1 });
UsageSchema.index({ user: 1, billingPeriod: 1 });

const Usage = mongoose.model('Usage', UsageSchema);

export default Usage;
