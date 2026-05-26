import mongoose from "mongoose";

const { Schema } = mongoose;

// ── Meta ──────────────────────────────────────────────────────────────────────
const MetaSchema = new Schema({
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: { type: String },
    canonicalUrl: { type: String },
    indexStatus: { type: Boolean, default: true },
    followStatus: { type: Boolean, default: true },
});

// ── Hero ──────────────────────────────────────────────────────────────────────
const ServiceHeroSchema = new Schema({
    badge: { type: String },
    counter: { type: String },
    headlinePrimary: { type: String, required: true },
    headlineItalic: { type: String, required: true },
    description: { type: String, required: true },
    ctaPrimaryLabel: { type: String, default: "Email a brief" },
    ctaPrimaryHref: { type: String, default: "#" },
    ctaSecondaryLabel: { type: String, default: "See sample work" },
    ctaSecondaryHref: { type: String, default: "#" },
    backgroundImage: { type: String },
});

// ── Overview ──────────────────────────────────────────────────────────────────
const OverviewSchema = new Schema({
    eyebrow: { type: String },
    heading: { type: String },
    italicHeading: { type: String },
    body: { type: String },
    quote: { type: String },
});

// ── Process Step ──────────────────────────────────────────────────────────────
const ProcessStepSchema = new Schema({
    number: { type: String },
    title: { type: String, required: true },
    description: { type: String, required: true },
    tradeDetail: { type: String },
    order: { type: Number, default: 0 },
});

// ── Before/After Sample ───────────────────────────────────────────────────────
const SampleSchema = new Schema({
    beforeImage: { type: String, required: true },
    afterImage: { type: String, required: true },
    title: { type: String },
    description: { type: String },
    category: { type: String },
    order: { type: Number, default: 0 },
});

// ── Pricing Tier ──────────────────────────────────────────────────────────────
const PricingTierSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: String, required: true },
    features: [{ type: String }],
    order: { type: Number, default: 0 },
});

// ── Who We Work With ──────────────────────────────────────────────────────────
const WhoWeWorkSchema = new Schema({
    eyebrow: { type: String, default: "Who We Work With" },
    heading: { type: String },
    italicHeading: { type: String },
    description: { type: String },
    cards: [
        {
            label: { type: String },
            title: { type: String },
            description: { type: String },
            order: { type: Number, default: 0 },
        },
    ],
});

// ── FAQ ───────────────────────────────────────────────────────────────────────
const FaqSchema = new Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    order: { type: Number, default: 0 },
});

const FaqSectionSchema = new Schema({
    eyebrow: { type: String, default: "Common Questions" },
    heading: { type: String },
    italicHeading: { type: String },
    items: [FaqSchema],
});

// ── Stats Bar ─────────────────────────────────────────────────────────────────
const StatsSchema = new Schema({
    pricingLabel: { type: String, default: "Pricing" },
    pricingValue: { type: String },
    pricingUnit: { type: String },
    turnaroundLabel: { type: String, default: "Turnaround" },
    turnaroundValue: { type: String },
    turnaroundUnit: { type: String },
    ledByLabel: { type: String, default: "Led By" },
    ledByValue: { type: String },
    specialtyLabel: { type: String, default: "Specialty" },
    specialtyValue: { type: String },
    specialtyUnit: { type: String },
});

// ── Lead Retoucher ────────────────────────────────────────────────────────────
const RetoucherSchema = new Schema({
    eyebrow: { type: String, default: "Led By" },
    name: { type: String },
    designation: { type: String },
    quote: { type: String },
    bodyParagraphs: [{ type: String }],
    image: { type: String },
});

// ── Testimonial ───────────────────────────────────────────────────────────────
const TestimonialSchema = new Schema({
    eyebrow: { type: String, default: "From a recent client" },
    quote: { type: String, required: true },
    clientName: { type: String },
    clientMeta: { type: String },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    order: { type: Number, default: 0 },
});

const TestimonialsSectionSchema = new Schema({
    eyebrow: { type: String, default: "From a recent client" },
    heading: { type: String },
    italicHeading: { type: String },
    items: [TestimonialSchema],
});

// ── Related Services ──────────────────────────────────────────────────────────
const RelatedServicesSectionSchema = new Schema({
    eyebrow: { type: String, default: "Related Specialties" },
    heading: { type: String },
    italicHeading: { type: String },
    items: [{ type: Schema.Types.ObjectId, ref: "Service" }],
});

// ── Process Section ───────────────────────────────────────────────────────────
const ProcessSectionSchema = new Schema({
    eyebrow: { type: String, default: "How it works" },
    heading: { type: String },
    italicHeading: { type: String },
    steps: [ProcessStepSchema],
});

// ── Samples Section ───────────────────────────────────────────────────────────
const SamplesSectionSchema = new Schema({
    eyebrow: { type: String, default: "Before & After" },
    heading: { type: String },
    italicHeading: { type: String },
    items: [SampleSchema],
});

// ── Pricing Section ───────────────────────────────────────────────────────────
const PricingSectionSchema = new Schema({
    eyebrow: { type: String, default: "Pricing" },
    heading: { type: String },
    italicHeading: { type: String },
    description: { type: String },
    ctaLabel: { type: String, default: "Email a brief" },
    ctaHref: { type: String, default: "#" },
    tiers: [PricingTierSchema],
    note: { type: String },
});

// ── Main Service Schema ───────────────────────────────────────────────────────
const ServiceSchema = new Schema(
    {
        slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
        isActive: { type: Boolean, default: true },
        isSecondary: { type: Boolean, default: false },
        num: { type: String },
        title: { type: String, required: true },
        cardDescription: { type: String },
        cardImage: { type: String },
        price: { type: String },
        order: { type: Number, default: 0 },
        // difference: DifferenceSectionSchema,
        meta: MetaSchema,
        hero: ServiceHeroSchema,
        overview: OverviewSchema,
        process: ProcessSectionSchema,
        samples: SamplesSectionSchema,
        pricing: PricingSectionSchema,
        whoWeWork: WhoWeWorkSchema,
        faq: FaqSectionSchema,
        stats: StatsSchema,
        retoucher: RetoucherSchema,
        testimonials: TestimonialsSectionSchema,
        relatedServices: RelatedServicesSectionSchema,
    },
    { timestamps: true },
);

ServiceSchema.index({ slug: 1 });
ServiceSchema.index({ isActive: 1, order: 1 });
ServiceSchema.index({ isSecondary: 1 });
ServiceSchema.index({ isActive: 1, isSecondary: 1 });

ServiceSchema.post("findOneAndDelete", async function (deletedDoc) {
    if (!deletedDoc) return;
    await mongoose
        .model("Service")
        .updateMany(
            { "relatedServices.items": deletedDoc._id },
            { $pull: { "relatedServices.items": deletedDoc._id } },
        );
});

export default mongoose.model("Service", ServiceSchema);
