const express = require("express");
const router = express.Router({mergeParams:true}); //used to access parameters of parent route
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../Models/listing.js");
const {isLoggedIn,listingAuth,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const {storage}=require("../cloudConfig.js");
const multer = require("multer");
const upload = multer({storage});

router.route("/")
    //index route
    .get(wrapAsync(listingController.index));

router.route("/new")
    //new Form
    .get(isLoggedIn,wrapAsync(listingController.renderNewForm))
    //save new listing
    .post(isLoggedIn,upload.single("listing[image]"),wrapAsync(listingController.saveNewListing)); 

router.route("/:id")
    //render listing
    .get(wrapAsync(listingController.renderListing))
    // delete listing
    .delete(isLoggedIn,listingAuth,wrapAsync(listingController.deleteListing))
    //update listing
    .put(
        isLoggedIn,
        listingAuth,
        upload.single("listing[image]"),
        // validateListing, 
        wrapAsync(listingController.updateListing)
    )

router.route("/:id/edit")
    //render edit form
    .get(isLoggedIn,listingAuth,wrapAsync(listingController.renderEditForm));


//export Router
module.exports = router;
 