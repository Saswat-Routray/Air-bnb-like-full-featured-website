
const Listing =require("../models/listing.js");
const {listingSchema} =require("../schema.js");

module.exports.index = async (req,res)=>{
    let allLists = await Listing.find({});
    res.render("listings/allLists",{allLists});

}

module.exports.renderNewForm = (req,res)=>{
   
    res.render("listings/new.ejs");
}

module.exports.showListing = async(req,res)=>{
    
    let {id}=req.params;
    const list= await Listing.findById(id)
    .populate({path: "reviews",
        populate:{
        path: "author"
    }}).populate("owner");
    if(!list){
        req.flash("error","requested listing doesnot exist");
        res.redirect("/listings");
    }
    console.log(list);
    res.render("listings/list.ejs",{list});
}

module.exports.createListing= async (req,res,next)=>{

    let url = req.file.path;
    let filename = req.file.filename;
    
    let result= listingSchema.validate(req.body);
    console.log(result);
    if(res.error){
         throw new ExpressError(400,result.error);
    }
    let list =  req.body.listing;
    console.log(list);
    const newList = new Listing(list);
    newList.owner=req.user._id;
    newList.image = {url,filename};
    // newList.category.add();
    await newList.save ();

    req.flash("success","new listing created");
    
    res.redirect("/listings");
   
}

module.exports.renderEditForm= async (req,res)=>{
    let {id} = req.params;
    let list = await Listing.findById(id);
    if(!list){
        req.flash("error","requested listing does not exist");
        res.redirect("/listings");
    }
    let originalImageUrl= list.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250");
    console.log(list);
    res.render("listings/edit.ejs",{list , originalImageUrl});
}

module.exports.updateListing = async(req,res,next)=>{
   
    let {id} =req.params;
    let updated = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    updated.image ={url, filename};
    await updated.save();
    }
    req.flash("success","listing updated");
    res.redirect(`/listings/${id}`);
    
}

module.exports.destroyListing = async (req,res)=>{
    let {id}=req.params;
    
    let deleted = await Listing.findByIdAndDelete(id);
    req.flash("success","listing deleted");
    res.redirect("/listings");
    
}