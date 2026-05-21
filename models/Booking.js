// models/Booking.js
import mongoose from "mongoose";

// Hero Section Schema
const heroSectionSchema = new mongoose.Schema({
  eyebrow: {
    type: String,
    default: "Book a free 30-minute call"
  },
  heading: {
    text: { type: String, default: "A conversation, before " },
    highlightedText: { type: String, default: "a quote." },
    suffix: { type: String, default: "" }
  },
  paragraph: {
    type: String,
    default: "Discuss your photo editing project directly with our co-founder, Fizz. You'll leave the call with a clear quote, a project timeline, and honest answers — whether or not we end up working together."
  },
  primaryBtn: {
    label: { type: String, default: "Schedule a Call" },
    href: { type: String, default: "/trial" }
  },
  secondaryBtn: {
    label: { type: String, default: "Or email directly" },
    href: { type: String, default: "/services" }
  },
  afterButtons: { type: String, default: "paragraph" },
  afterParagraph: {
    type: String,
    default: "Free · No obligation · 30 minutes · Available across all major time zones"
  },
  image: {
    url: { type: String, default: "/hero2.jpg" },
    publicId: { type: String, default: "" },
    alt: { type: String, default: "Before / After" }
  }
}, { _id: false });

// What We'll Cover Section Schema
const stepSchema = new mongoose.Schema({
  stepNumber: { type: Number, required: true },
  stepLabel: { type: String, required: true }, // e.g., "Step one"
  title: { type: String, required: true },
  description: { type: String, required: true }
}, { _id: false });

const whatWeCoverSchema = new mongoose.Schema({
  subtitle: {
    type: String,
    default: "What We'll Cover"
  },
  title: {
    type: String,
    default: "Thirty minutes, three simple goals."
  },
  highlightedText: {
    type: String,
    default: "simple goals."
  },
  steps: [stepSchema]
}, { _id: false });

// Who You'll Speak With Section Schema
const expectationSchema = new mongoose.Schema({
  text: { type: String, required: true }
}, { _id: false });

const whoYouSpeakWithSchema = new mongoose.Schema({
  subtitle: {
    type: String,
    default: "Who you'll speak with"
  },
  name: {
    type: String,
    default: "Md Fozlur Rahman"
  },
  nickname: {
    type: String,
    default: "Fizz"
  },
  role: {
    type: String,
    default: "Co-founder · Sales, Operations & Marketing"
  },
  image: {
    url: { type: String, default: "" },
    publicId: { type: String, default: "" },
    alt: { type: String, default: "Portrait of Fizz" }
  },
  description: {
    type: String,
    default: "Fizz leads sales, operations, and client relationships at Rapid Clipping Path. Educated in Computer Science at the University of Hertfordshire in the UK, with an exchange year at the University of Oklahoma, he brings prior experience from Microsoft in London and PwC in New York City. He takes every consultation personally — so when you book a call, you're talking to the co-founder who'll oversee your project end-to-end, not a sales representative reading from a deck."
  },
  expectations: [expectationSchema]
}, { _id: false });

// Do You Actually Need a Call Section Schema
const decisionPathSchema = new mongoose.Schema({
  type: { type: String, enum: ["email", "call"], required: true },
  label: { type: String, required: true }, // "Faster Path" or "Better for Partnership"
  title: { type: String, required: true },
  highlightedText: { type: String, required: true },
  points: [{ type: String, required: true }],
  actionText: { type: String, required: true },
  actionLink: { type: String, required: true }
}, { _id: false });

const doYouNeedCallSchema = new mongoose.Schema({
  subtitle: {
    type: String,
    default: "Before you book"
  },
  title: {
    type: String,
    default: "Do you actually need a call?"
  },
  highlightedText: {
    type: String,
    default: "need a call?"
  },
  description: {
    type: String,
    default: "For most simple orders, an email is faster — we usually respond within two hours during business days. Here's how to decide:"
  },
  decisionPaths: [decisionPathSchema]
}, { _id: false });

// FAQ Section Schema
const faqItemSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  order: { type: Number, default: 0 }
}, { _id: false });

const faqSectionSchema = new mongoose.Schema({
  subtitle: {
    type: String,
    default: "Common Questions"
  },
  title: {
    type: String,
    default: "A few things people ask."
  },
  highlightedText: {
    type: String,
    default: "people ask."
  },
  faqs: [faqItemSchema]
}, { _id: false });

// Main Booking Schema
const bookingSchema = new mongoose.Schema({
  hero: {
    type: heroSectionSchema,
    default: () => ({})
  },
  whatWeCover: {
    type: whatWeCoverSchema,
    default: () => ({})
  },
  whoYouSpeakWith: {
    type: whoYouSpeakWithSchema,
    default: () => ({})
  },
  doYouNeedCall: {
    type: doYouNeedCallSchema,
    default: () => ({})
  },
  faq: {
    type: faqSectionSchema,
    default: () => ({})
  },
  isActive: {
    type: Boolean,
    default: true
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

// Update timestamp on save
bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Singleton pattern - ensure only one document exists
bookingSchema.statics.getActive = async function() {
  let booking = await this.findOne({ isActive: true });
  if (!booking) {
    // Create default booking with mock data
    booking = await this.createDefaultBooking();
  }
  return booking;
};

bookingSchema.statics.createDefaultBooking = async function() {
  const defaultBooking = new this({
    hero: {
      eyebrow: "Book a free 30-minute call",
      heading: {
        text: "A conversation, before ",
        highlightedText: "a quote.",
        suffix: ""
      },
      paragraph: "Discuss your photo editing project directly with our co-founder, Fizz. You'll leave the call with a clear quote, a project timeline, and honest answers — whether or not we end up working together.",
      primaryBtn: {
        label: "Schedule a Call",
        href: "/trial"
      },
      secondaryBtn: {
        label: "Or email directly",
        href: "/services"
      },
      afterButtons: "paragraph",
      afterParagraph: "Free · No obligation · 30 minutes · Available across all major time zones",
      image: {
        url: "/hero2.jpg",
        publicId: "",
        alt: "Before / After"
      }
    },
    whatWeCover: {
      subtitle: "What We'll Cover",
      title: "Thirty minutes, three simple goals.",
      highlightedText: "simple goals.",
      steps: [
        {
          stepNumber: 1,
          stepLabel: "Step one",
          title: "Your project.",
          description: "You walk us through what you're working on — the type of images, volume, deadline, and quality expectations. We listen first, ask questions second."
        },
        {
          stepNumber: 2,
          stepLabel: "Step two",
          title: "Our recommendation.",
          description: "We tell you which of our services fit your project, what the realistic turnaround looks like, and what the work will cost. Honest, even when we recommend going elsewhere."
        },
        {
          stepNumber: 3,
          stepLabel: "Step three",
          title: "Your next steps.",
          description: "You leave with a written summary, a clear quote within 24 hours, and a free trial offer if you'd like to test the work before committing to anything."
        }
      ]
    },
    whoYouSpeakWith: {
      subtitle: "Who you'll speak with",
      name: "Md Fozlur Rahman",
      nickname: "Fizz",
      role: "Co-founder · Sales, Operations & Marketing",
      image: {
        url: "",
        publicId: "",
        alt: "Portrait of Fizz"
      },
      description: "Fizz leads sales, operations, and client relationships at Rapid Clipping Path. Educated in Computer Science at the University of Hertfordshire in the UK, with an exchange year at the University of Oklahoma, he brings prior experience from Microsoft in London and PwC in New York City. He takes every consultation personally — so when you book a call, you're talking to the co-founder who'll oversee your project end-to-end, not a sales representative reading from a deck.",
      expectations: [
        { text: "Honest answers — including telling you when we're not the right fit" },
        { text: "A direct quote based on your actual scope, not a vague range" },
        { text: "No pressure to commit on the call" },
        { text: "A follow-up summary in writing within 24 hours" }
      ]
    },
    doYouNeedCall: {
      subtitle: "Before you book",
      title: "Do you actually need a call?",
      highlightedText: "need a call?",
      description: "For most simple orders, an email is faster — we usually respond within two hours during business days. Here's how to decide:",
      decisionPaths: [
        {
          type: "email",
          label: "Faster Path",
          title: "Just email us.",
          highlightedText: "email us.",
          points: [
            "You have a specific, clear request — for example, \"I need clipping path on 50 product images by Friday\"",
            "You want a free trial — send us 3 sample images and we'll edit them within 24 hours",
            "You just want a quick price quote",
            "Your project fits cleanly into one of our standard services"
          ],
          actionText: "support@rapidclippingpath.com",
          actionLink: "mailto:support@rapidclippingpath.com"
        },
        {
          type: "call",
          label: "Better for Partnership",
          title: "Book a call.",
          highlightedText: "a call.",
          points: [
            "Your project is complex — multi-service, large volume, or specific brand requirements",
            "You want a long-term partner for ongoing work, not a one-off project",
            "You're an agency, photography studio, or brand looking to discuss a retainer",
            "You need to walk us through your workflow, brand guidelines, or technical requirements"
          ],
          actionText: "Schedule a 30-min call",
          actionLink: "#"
        }
      ]
    },
    faq: {
      subtitle: "Common Questions",
      title: "A few things people ask.",
      highlightedText: "people ask.",
      faqs: [
        {
          question: "What's the best way to get a trial?",
          answer: "Simply email us at support@rapidclippingpath.com with 'Free Trial' in the subject line and attach 3 sample images. We'll edit them within 24 hours at no cost, so you can judge the quality before committing.",
          order: 1
        },
        {
          question: "How fast do you typically respond to emails?",
          answer: "During business hours (9 AM - 6 PM BST/BST), we usually respond within 2 hours. Even on weekends, you'll hear back within 12 hours. For urgent matters, a phone call is faster.",
          order: 2
        },
        {
          question: "What happens on the 30-minute call?",
          answer: "We listen to your project scope, timeline, and quality needs. Then we explain how we'd approach it, what it would cost, and answer any questions. You leave with a written summary and a quote within 24 hours. No pressure to decide on the call.",
          order: 3
        },
        {
          question: "Do I need to prepare anything before the call?",
          answer: "Not really — just bring your project in mind. If you have reference images or specific requirements, having them ready can help, but it's not required. The call is designed to be casual and informative.",
          order: 4
        },
        {
          question: "What if I just want a quick price?",
          answer: "Email is faster! Just send us your requirements and we'll quote you within a few hours. The call is best for complex projects or if you want to discuss a long-term partnership.",
          order: 5
        },
        {
          question: "Do you offer discounts for agencies or high volume?",
          answer: "Yes — we have tiered pricing for volume and special rates for agencies. The call is the perfect place to discuss your specific numbers and get a custom quote that scales with your business.",
          order: 6
        }
      ]
    }
  });

  return await defaultBooking.save();
};

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;