const express = require("express");
const router = express.Router({mergeParams:true}); //used to access parameters of parent route
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/expressError.js");
const Listing = require("../Models/listing.js");


let validateListing = (req, res, next) => {
    console.log("New Data: \n"+req.body);
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

router.get("/", wrapAsync(async (req, res) => {
    let listData = await Listing.find({});
    res.render("./listings/index.ejs", { listData });
}));

router.get("/new", (req, res) => {
    res.render("./listings/new.ejs");
});

router.post("/new", validateListing, wrapAsync(async (req, res, next) => {
    let { title, description, price,location, country } = req.body.listing;
    let newList = new Listing({
        title: title,
        description: description,
        price: price,
        location: location,
        country: country,
    });

    await newList.save();
    req.flash("success", "New Destination is Added!"); //flash uses name value pair
    res.redirect("/listings");
}));

router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Destination deleted!");
    res.redirect("/listings");
}));

// GET form to edit a listing
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let detail = await Listing.findById(id);
    if (!detail) {
        throw new ExpressError(404, "Listing not found");
    }
    res.render("./listings/edit.ejs", { detail });
}));

// PUT to update a listing
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true, runValidators: true });
    if (!updatedListing) {
        throw new ExpressError(404, "Listing not found");
    }
    req.flash("success", "Destination updated !");
    res.redirect(`/listings/${id}`);
}));

// GET a specific listing by ID
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let detail = await Listing.findById(id).populate("reviews");
    if (!detail) {
        throw new ExpressError(404, "Listing not found");
    }
    res.render("./listings/show.ejs", { detail });
}));



module.exports = router;
 