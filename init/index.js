const mongoose = require("mongoose");
const initData = require("./data.js");
const list = require("../Models/listing.js");
require('dotenv').config({path:'../.env'});
const dbURL = process.env.ATLASDB_URL;
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbURL);

}

const inDB = async ()=>{
    await list.deleteMany({});
    initData.data = initData.data.map((el) => ({...el,owner:"6734de04676dc8e897c1433c"}));
    await list.insertMany(initData.data);
    console.log("data was initialized");
};

inDB();