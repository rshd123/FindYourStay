const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview} = require("../middleware.js");
const {isLoggedIn,reviewAuth} = require("../middleware.js");
const reviewController = require("../controllers/review.js");



// POST a new review for a listing
router.post("/", validateReview,isLoggedIn, wrapAsync(reviewController.saveNewPost));

// DELETE a review from a listing
router.delete("/:reviewId",isLoggedIn,reviewAuth,wrapAsync(reviewController.destroyReview));

module.exports = router;