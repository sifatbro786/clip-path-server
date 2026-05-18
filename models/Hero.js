import mongoose from "mongoose";

const statSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false
  },
  details: {
    type: String,
    required: false
  }
});

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false
  }
});

const buttonSchema = new mongoose.Schema({
  label: {
    type: String,
    required: false
  },
  href: {
    type: String,
    required: false
  }
});

const heroSchema = new mongoose.Schema({
  // Page identifier (home, service, pricing, portfolio, about, etc.)
  page: {
    type: String,
    required: false,
    unique: true,
    trim: true,
    lowercase: true
  },
  
  // Eyebrow text (small text above heading)
  eyebrow: {
    type: String,
    required: false
  },
  
  // Main heading (can include HTML for emphasis)
  heading: {
    type: String,
    required: false
  },
  
  // Paragraph/description
  paragraph: {
    type: String,
    required: false
  },
  
  // Primary button
  primaryBtn: {
    type: buttonSchema,
    required: false
  },
  
  // Secondary button
  secondaryBtn: {
    type: buttonSchema,
    required: false
  },
  
  // Hero image
  imageUrl: {
    type: String,
    required: false
  },
  
  // Image alt text
  imageAlt: {
    type: String,
    required: false
  },
  
  // Image public ID (for Cloudinary management)
  imagePublicId: {
    type: String,
    required: false
  },
  
  // Stats array
  stats: [statSchema],
  
  // Tags array
  tags: [tagSchema],
  
  // Additional fields for flexibility
  backgroundColor: {
    type: String,
    required: false
  },
  
  textColor: {
    type: String,
    required: false
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Hero = mongoose.model("Hero", heroSchema);

export default Hero;