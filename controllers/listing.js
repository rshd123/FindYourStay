const Listing = require("../Models/listing.js");

module.exports.index = async (req,res)=>{
    const listData = await Listing.find({});
    res.render("./listings/index.ejs", { listData });
};

module.exports.renderNewForm = async (req,res)=>{
    res.render("./listings/new.ejs");
};

module.exports.saveNewListing = async(req,res)=>{
        let { title, description, price,location, country } = req.body.listing;
        let newList = new Listing({
            title: title,
            description: description,
            price: price,
            location: location,
            country: country,
        });
        newList.owner = req.user._id;
        await newList.save();
        req.flash("success", "New Destination is Added!"); //flash uses name value pair
        res.redirect("/listings");
};

module.exports.renderListing = async (req, res) => {
    let { id } = req.params;
    let detail = await Listing.findById(id).populate({
        path:"reviews",
        populate:{
            path:"author",
        },
    }).populate("owner");
    if (!detail) {
        req.flash("error","Listing you Requested doesn't exist");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs", { detail });
};

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Destination deleted!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let detail = await Listing.findById(id);
    if (!detail) {
        throw new ExpressError(404, "Listing not found");
    }
    res.render("./listings/edit.ejs", { detail });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let detail = await Listing.findById(id);
    if (!detail) {
        throw new ExpressError(404, "Listing not found");
    }
    res.render("./listings/edit.ejs", { detail });
};