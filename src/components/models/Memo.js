// import mongoose from 'mongoose';
// var express    = require('express'),
//     app        = express()
var mongoose = require('mongoose');
// var Schema = mongoose.Schema;

// var mongojs = require('mongojs')
// var db = mongojs('mongodb://localhost/sirMemo', 'memo')
// var mongoDB = 'mongodb://localhost:27017/sirMemo';
// mongoose.connect(mongoDB, { useMongoClient: true })
// mongoose.connect(mongoDB)
// mongoose.connect('mongodb://localhost/sirMemo');

// var mongoDB = 'mongodb://localhost:27017/sirMemo';
// // var mongoDB = 'mongodb://sirisak:password@192.168.1.149/sirMemo';
//
// mongoose.Promise = global.Promise;
//
// var connection = mongoose.connect(mongoDB, { useMongoClient: true, options: { promiseLibrary: mongoose.Promise } })
// // var connection = mongoose.connect(mongoDB)

var schema   = new mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    detail : String,
    links : [ String ],
    owner : String,
    tags : [ String ],
    title : String,
    update_at : Date,
    timestamp: Date
});

schema.methods.addTimeStamp = function() {
  // console.log("aaa")
  // console.log(this)
  // let newItem = this
  // newItem = Object.assign({},newItem)
  // console.log(newItem)
  // newItem.timestamp = new Date();
  this.timestamp = mongoose.Types.ObjectId(this._id).getTimestamp()


  // var title = this.title + '-dude';
  //
  // return title;

};
// schema.methods.dudify = function() {
//   // add some stuff to the users name
//   // this.title = this.title + '-dude';
//   // Memo.
//
//   var title = this.title + '-dude';
//
//   return title;
// };

    // id : -L05qbttUIVE_dAebyk5,
// created_at: Date,
//   updated_at: Date

var Memo = mongoose.model('Memo', schema);
// var Memo = ''
//
module.exports = Memo;
