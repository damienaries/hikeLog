const Review = require('../models/review');
const Hike = require('../models/hike');

module.exports.createReview = async (req, res) => {
    const hike = await Hike.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    hike.reviews.push(review);
    await review.save();
    await hike.save();
    req.flash('success', 'Your review was successfully added!');
    res.redirect(`/hikes/${hike._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const {id, reviewId} = req.params;
    await Hike.findByIdAndUpdate(id, { $pull: {reviews: reviewId} })
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Your review was successfully deleted');
    res.redirect(`/hikes/${id}`); 
}