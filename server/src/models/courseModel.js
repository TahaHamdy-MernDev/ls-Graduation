const { Schema, model, Aggregate } = require("mongoose");

const courseSchema = new Schema(
  {
    name: {
      type: String,
    },
    courseSubTitle: {
      type: String,
    },
    price: {
      type: Number,
    },
    description: {
      type: String,
    },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    instructor: {
      type: String,
    },
    whatUWillLearn: [
      {
        type: String,
      },
    ],
    link: {
      type: String,
    },
    level: {
      type: String,
      enum:["beginner","intermediate","advanced"]
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
    Suggestion: {
      type: Boolean,
      default: false
    },                                                                                                        
    duration: {
      value: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        enum: ["days", "hours"],
        required: true,
      },
    },
    image: {
      type: Object,
      default: {
        url: "",
        publicId: null,
      },
    },
    keys: [{ type: String }],
    requestList: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);
courseSchema.pre("find", function (next) {
  this.populate("category");
    next();
});

const Course = model("Course", courseSchema);
 
module.exports = Course;
