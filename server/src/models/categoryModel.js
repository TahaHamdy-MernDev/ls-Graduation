const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
    },
    categoryDescription: {
      type: String,
    },
    keys: [{ type: String }],
    categoryImage:{
      type: Object,
      default: {
        url: "",
        publicId: null,
      },
    }
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
