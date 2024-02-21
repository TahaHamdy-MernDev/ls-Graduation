const { Schema, model } = require("mongoose")
const reviewSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    rating: {
      type: Number,
    },
    text: {
      type: String,
    },
  },
  { timestamps: true }
);
const BookSchema = new Schema({
  title: {
    type: String,
  },
  publishedBy: {
    type: Schema.Types.ObjectId, ref: 'User'
  },
  rate: {
    type: Number,
    required: true,
    default: 0
  },
  reviews: [reviewSchema],
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  downloads: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
  },
  Suggestion: {
    type: Boolean,
    default: false
  },
  author: {
    type: String,
  },
  file: {
    type: Object,
    default: {
      url: "",
      publicId: null,
    },
  },
  ratings: {
    type: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      rating: {
        type: Number,
      },
    }],
    default: [],
  },
  keys: [{ type: String }],
  coverImage: {
    type: Object,
    default: {
      url: "",
      publicId: null,
    },
  }
}, { timestamps: true });
BookSchema.pre('find', function (next) {
  this.populate('publishedBy').populate('category').populate('reviews.user');
  next();
});


const Book = model("Book", BookSchema);
module.exports = Book;
