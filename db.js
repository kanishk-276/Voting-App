const mongoose = require("mongoose")
require('dotenv').config()
const mongoURL = process.env.LOCAL_DB_URL // local db
//const mongoURL = process.env.DB_URL;  // server db

mongoose.connect(mongoURL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;

db.on('connected', ()=>{
    console.log("connection eshtablished!")
})

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

db.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

module.exports = db;