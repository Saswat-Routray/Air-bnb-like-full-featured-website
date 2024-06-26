const mongoose = require('mongoose');

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/Wanderlust');
}

main()
.then((res)=>{
    console.log("connected");
})
.catch((err)=>{
    console.log("err");
})

const initData=require('./data.js');
const Listing = require('../models/listing.js');

async function initDatabase(){
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj, owner: '667af215a152ccfe5b521503'}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized")
}


initDatabase();


