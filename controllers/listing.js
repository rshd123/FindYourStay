const Listing = require("../Models/listing.js");
const mbxGeocoding  = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req,res)=>{
    const listData = await Listing.find({});
    res.render("./listings/index.ejs", { listData });
};

module.exports.renderNewForm = async (req,res)=>{
    res.render("./listings/new.ejs");
};

module.exports.saveNewListing = async(req,res)=>{

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send() 
        

    let url = req.file.path;
    let filename=req.file.filename;
    let { title, description, price,location, country } = req.body.listing;
    let newList = new Listing({
        title: title,
        description: description,
        price: price,
        location: location,
        country: country,
    });
    newList.owner = req.user._id;
    newList.image={url,filename};
    newList.geometry = response.body.features[0].geometry;

    let savedListing = await newList.save();
    console.log(savedListing);  
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
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename=req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
};