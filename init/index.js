const mongoose = require("mongoose");
const initData = require("./data.js");
const list = require("../Models/listing.js");

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const inDB = async ()=>{
    await list.deleteMany({});
    await list.insertMany(initData.data);
    console.log("data was initialized");
};

inDB();