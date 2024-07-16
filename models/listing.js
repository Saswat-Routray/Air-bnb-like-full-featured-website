const mongoose =require("mongoose"); 
const { Schema } = mongoose;

const Review =require("./review.js");
const User = require("./user.js");
const { string } = require("joi");

const listingSchema = mongoose.Schema({
    title :{
        type: String,
        required: true

    },
    
    description:{
        type: String
    },

    image: {
        url: String,
        filename: String
    },
    price: {
        type: Number
    },
    location: {
        type: String
    },
    country: {
        type: String
    },
    reviews: [
        {
        type: Schema.Types.ObjectId,
        ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    category: {
        type: String,
        enum:["Iconic Cities","Trending","Room","Mountains","Castles","Amazing Pools","Camping","Farms","Artict","Dome","Boats"]
    }
}); 

listingSchema.post("findOneAndDelete", async (listing)=>{
    await Review.deleteMany({_id:{$in : listing.reviews }})
    
})

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;

