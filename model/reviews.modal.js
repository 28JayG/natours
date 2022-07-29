const mongoose = require('mongoose');
const Tour = require('./tours.model');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty'],
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'A rating for review should be at least 0'],
      max: [5, 'A rating for review can be maximum 5'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

//static functions can be called on the Model directly,
//here since we are using aggregate and that can only be called on a Model
//hence this gives us the Model so this.aggregate is possible
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats.length ? stats[0].nRating : 0,
    ratingsAverage: stats.length ? stats[0].avgRating : 4.5,
  });
};

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// collection mai save nai hua hoga so pre ni use kar sakte
reviewSchema.post('save', async function () {
  //this.constructor points to modal
  this.constructor.calcAverageRatings(this.tour);
});
//this users catches findByIdAndUpdate & findById&Delete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  //update the this and use it in the post middleware
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  console.log('post');
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
