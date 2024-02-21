const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    firstName: { type: String, },
    lastName: { type: String, },
    email: { type: String, unique: true },
    bio: {
      type: String,
    },
    password: { type: String },
    ssoAuth: {
      googleId: { type: String },
    },
    role: { type: String, enum: ["Admin", "User"], default: "User" },
    profileImage: {
      type: Object,
      default: {
        url: "https://res.cloudinary.com/dfjnpfcqz/image/upload/v1708464934/avatar_zjpvvz.png",
        publicId: null,
      },
    },
    bookWishlist: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
    courseWishlist: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: Schema.Types.ObjectId, ref :'User' }], 
    skills: [{ type: String }],
    interests: [ { type: Schema.Types.ObjectId, ref: "Category" }],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
  }
  next();
});
// userSchema.pre("find", function (next) {
//   this.populate('bookWishlist.oid')
//   console.log(this);
//   next();
// });
userSchema.pre("findOne", function (next) {
  this.populate('bookWishlist')
  .populate('courseWishlist')
  // .exec()
  // console.log(this.bookWishlist);
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function () {
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET_TOKEN, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
userSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};
const User = model("User", userSchema);

module.exports = User;
