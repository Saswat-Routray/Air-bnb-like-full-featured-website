const mongoose =require("mongoose"); 
const { Schema } = mongoose;

const Review =require("./review.js");
const User = require("./user.js")

const listingSchema = mongoose.Schema({
    title :{
        type: String,
        required: true

    },
    
    description:{
        type: String
    },

    image: {
        type: String,
        default: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
        set: function(v) {
            return (v === "") ? "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60" : v;
        }
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
    }
}); 

listingSchema.post("findOneAndDelete", async (listing)=>{
    await Review.deleteMany({_id:{$in : listing.reviews }})
    
})

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;

