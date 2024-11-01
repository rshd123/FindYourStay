const express = require("express");
const router = express.Router({mergeParams:true}); //used to access parameters of parent route
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../Models/listing.js");
const {isLoggedIn,listingAuth,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");

//index route
router.get("/", wrapAsync(listingController.index));
//new Form
router.get("/new",isLoggedIn,wrapAsync(listingController.renderNewForm));
//save new listing
router.post("/new", validateListing, wrapAsync(listingController.saveNewListing));
// render listing
router.get("/:id", wrapAsync(listingController.renderListing));
// delete listing
router.delete("/:id", isLoggedIn,listingAuth,wrapAsync(listingController.deleteListing));
//render edit form
router.get("/:id/edit", isLoggedIn,listingAuth,wrapAsync(listingController.renderEditForm));
//update listing
router.put("/:id", isLoggedIn,listingAuth,validateListing, wrapAsync(listingController.updateListing));

//export Router
module.exports = router;
 