import mongoose from 'mongoose';

const CharacterSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  characterType: {
    type: String,
    enum: ['fantasy', 'sci-fi', 'historical', 'modern', 'superhero', 'villain', 'custom'],
    default: 'fantasy'
  },
  attributes: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  background: {
    type: String,
    default: ''
  },
  abilities: [{
    name: String,
    description: String,
    power: Number
  }],
  appearance: {
    type: Map,
    of: String,
    default: {}
  },
  personality: [String],
  story: {
    type: String,
    default: ''
  },
  imageUrl: {
    type: String,
    default: ''
  },
  generatedBy: {
    type: String,
    required: true,
    default: 'claude-3.7-sonnet'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  tags: [String],
  meta: {
    likes: {
      type: Number,
      default: 0
    },
    views: {
      type: Number,
      default: 0
    },
    downloads: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
CharacterSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Character = mongoose.model('Character', CharacterSchema);

export default Character;
