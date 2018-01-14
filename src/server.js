//server.js
'use strict'

//first we import our dependencies...
var express = require('express');
var mongoose = require('mongoose') , Admin = mongoose.mongo.Admin;
// var Memo

var bodyParser = require('body-parser');


//and create our instances
var app = express();
var router = express.Router();

//set our port to either a predetermined port number if you have set it up, or 3001
var port = process.env.API_PORT || 3002;

//db config -- REPLACE USERNAME/PASSWORD/DATABASE WITH YOUR OWN FROM MLAB!
// var mongoDB = 'mongodb://localhost:27017/sirMemo';

var ip = require("ip").address();
console.dir ( ip );

// ip = 'localhost'

var mongoDB = 'mongodb://' + ip + ':27017/sirMemo';
// var mongoDB = 'mongodb://sirisak:password@192.168.1.149/sirMemo';

// mongoose.Promise = global.Promise;

var connection = mongoose.connect(mongoDB, { useMongoClient: true, options: { promiseLibrary: mongoose.Promise } })
// var connection = mongoose.connect(mongoDB)
var db = mongoose.connection;
var Memo = require('./components/models/Memo.js');



db.on('open', function (ref) {
    console.log('Connected to mongo server.');

    new Admin(db.db).listDatabases(function(err, result) {
      console.log(result)
        console.log('listDatabases succeeded');
        // database list stored in result.databases
        var allDatabases = result.databases;
    });
    //trying to get collection names
    db.db.listCollections().toArray(function(err, items) {
      // test.ok(items.length >= 1);
      console.log(items)

      // db.close();
    });

    // let memo1 = new Memo({
    //   detail : "ddd",
    //   links : [ "dddd","dddd2" ],
    //   owner : "ddddd",
    //   tags : [ "dddd" , "dddd2"],
    //   title : "dddd"
    // })
    //
    // memo1.save();

    // db.db.listConnections(function (err, names) {
    //     console.log(names); // [{ name: 'dbname.myCollection' }]
    //     module.exports.Collection = names;
    // });
})


db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//now we should configure the APi to use bodyParser and look for JSON data in the body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//To prevent errors from Cross Origin Resource Sharing, we will set our headers to allow CORS with middleware like so:
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

  //and remove cacheing so we get the most recent comments
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

//now  we can set the route path & initialize the API
router.get('/', function(req, res) {
  res.json({ message: 'API Initialized!'});
});

//adding the /comments route to our /api router
router.route('/memos')
.get(function(req, res) {

  Memo.find( {},function (err, docs) {
    console.log("Memo.find()")
    if (err){
      res.send(err);
    }

    // console.log(docs[0])
    // docs[0].addTimeStamp()
    docs.forEach( doc =>  doc.addTimeStamp() )
    // docs[0].aaa='aaaaaaa'
    // console.log(docs[0])
    // docs.addTimeStamp()
    // console.log(docs[0])
    res.send(docs);
  });

})
//post new comment to the database
.post(function(req, res) {

  console.log(JSON.stringify(req.body,null,'\t'))
  let memo = new Memo(req.body);
  // let memo = new Memo();
  //
  // (req.body.title) ? memo.title = req.body.title : null;
  //
  // // console.log(memo)
  // // (req.body.author) ? memo.author = req.body.author : null;
  // // (req.body.text) ? memo.text = req.body.text : null;


  // let memo = new Memo({
  //   detail : "ddd",
  //   links : [ "dddd","dddd2" ],
  //   owner : "ddddd",
  //   tags : [ "dddd" , "dddd2"],
  //   title : "dddd2"
  // })

  memo.save()
  .then(function(resp){
    res.send(resp);
  })
  .catch(function(err) {
    res.send(err);
  })

//   .catch(function(err) {
//     if (err){
//       res.send(err);
//     }
//
//     // res.json({ message: 'Comment successfully added!' });
//     res.send('Comment successfully added!')
//   });
})

router.route('/memos/:memo_id')
.delete(function(req, res) {
  let id = req.params.memo_id
  // console.log(JSON.stringify(req.body,null,"\t"))
  // console.log(req.params)

  // console.log(req.params)

  Memo.remove({ _id: id }, function (err, resp) {
    if (err){
      res.send(err);
    }
    res.send(resp);
  });
})


router.route('/memos/edit/:memo_id')
  .post(function(req, res) {
    let id = req.params.memo_id
    let doc = req.body
    // console.log(JSON.stringify(req.body,null,"\t"))
    // console.log(req.params)

    Memo.findByIdAndUpdate(id, doc, function (err, resp) {
      if (err){
        res.send(err);
      }
      res.send(resp);
    });

  })

  router.route('/memos/tagslist')
    .get(function(req, res) {

      Memo.find({},{tags: 1})
         .exec(function(err, docs) {
           console.log("Memo.find() by /memos/tagslist")
           if (err){
             res.send(err);
           }

           // docs[0].aaa='aaaaaaa'
           // console.log(docs[0])
           // docs.addTimeStamp()
           // console.log(docs[0])
           var tagsList = [{tag: 'untagged', count: 0}]
           // var tagsObj = {notags: 0}

           docs.forEach(function(item){
               item.tags.forEach(function(tag){
                 let tagObj = tagsList.find((element) => {
                   return element.tag === tag;
                 })

                 if (tagObj){
                   tagObj.count++;
                 } else {
                   tagsList.push({
                     tag: tag,
                     count: 1
                   })
                 }
               })
           })

           // console.log(tagsObj)

           res.send(tagsList);
         });


    })

router.route('/memos/search/:keyword')
  .get(function(req, res) {
    let keyword = req.params.keyword
    Memo.find({$text: {$search: keyword}})
       // .skip(20)
       // .limit(10)
       .exec(function(err, docs) {
         console.log("Memo.find()")
         if (err){
           res.send(err);
         }

         docs.forEach( doc =>  doc.addTimeStamp() )
         // docs[0].aaa='aaaaaaa'
         // console.log(docs[0])
         // docs.addTimeStamp()
         // console.log(docs[0])
         res.send(docs);
       });

    // Memo.find( {},function (err, docs) {
    //   console.log("Memo.find()")
    //   if (err){
    //     res.send(err);
    //   }
    //
    //   docs.forEach( doc =>  doc.addTimeStamp() )
    //   // docs[0].aaa='aaaaaaa'
    //   // console.log(docs[0])
    //   // docs.addTimeStamp()
    //   // console.log(docs[0])
    //   res.send(docs);
    // })


  })



//Adding a route to a specific comment based on the database ID
// router.route('/comments/:comment_id')
// //The put method gives us the chance to update our comment based on the ID passed to the route
//   .put(function(req, res) {
//     Comment.findById(req.params.comment_id, function(err, comment) {
//       if (err)
//         res.send(err);
//       //setting the new author and text to whatever was changed. If nothing was changed
//       // we will not alter the field.
//       (req.body.author) ? comment.author = req.body.author : null;
//       (req.body.text) ? comment.text = req.body.text : null;
//       //save comment
//       comment.save(function(err) {
//         if (err)
//           res.send(err);
//         res.json({ message: 'Comment has been updated' });
//       });
//     });
//   })
//   //delete method for removing a comment from our database
//   .delete(function(req, res) {
//     //selects the comment by its ID, then removes it.
//     Comment.remove({ _id: req.params.comment_id }, function(err, comment) {
//       if (err)
//         res.send(err);
//
//
//       res.json({ message: 'Comment has been deleted' })
//     })
//   });

//Use our router configuration when we call /api
app.use('/api', router);

//starts the server and listens for requests
app.listen(port,'0.0.0.0', function() {
  console.log(`api running on port ${port}`);
});
