const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    validate: validator.isEmail,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  confirmPassword: {
    type: String,
    validate: {
      validator: function (el) {
        return this.password === el;
      },
      message: "Passwords do not match",
    },
  },
  passwordChangedAt: {
    type: Date,
    // default: Date.now(),
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.pre(/^find/, function (next) {
  if (!this.isModified || this.isNew) return next();
  this.passwordChangedAt = Date.now();
  next();
});

userSchema.methods.checkPassword = async function (candidatePassword, currentPassword) {
  return await bcrypt.compare(currentPassword, candidatePassword);
};

userSchema.methods.checkIfPasswordChangedAt = function (jwtTimeStamp) {
  if (this.passwordChangedAt) {
    const passwordChangeTime = +this.passwordChangedAt.getTime() / 1000;
    // console.log(jwtTimeStamp, passwordChangeTime);
    if (jwtTimeStamp < passwordChangeTime) return true;
    return false;
  } else return;
};

const User = new mongoose.model("User", userSchema);

module.exports = User;
