var $ = require('jquery');
var promise = require('es6-promise');
// var ip = require('ip').address();
// ~~~ MANUAL bcoz above comment not work
var ip = process.env.API_IP || 'localhost'

// var ip = require('ip').address();
// console.dir ( ip );

// console.log(require('ip'))

// const internalIp = require('internal-ip');
//
// ip = internalIp.v4.sync()

// console.dir ( process.env );
// var resourceUrl = 'http://localhost:3002/api/memos';

var resourceUrl = 'http://'+ip+':3008/api/memos';

module.exports = {
    add: function (item) {
        var Promise = promise.Promise;
          return new Promise(function (resolve, reject) {
              $.ajax({
                  url: resourceUrl,
                  data: JSON.stringify(item),
                  method: 'POST',
                  dataType: 'json',
                  contentType: 'application/json',
                  success: resolve,
                  error: reject
              });
          });


    },
    edit: function (item, id) {
        var Promise = promise.Promise;

        return new Promise(function (resolve, reject) {
            $.ajax({
                url: resourceUrl+'/edit/'+id,
                data: JSON.stringify(item),
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                success: resolve,
                error: reject
            });
        });

    },
    find: function (keyword) {
      // console.log(process.env)

        var Promise = promise.Promise;

        if (typeof keyword === 'undefined' || keyword === ''){
          return new Promise(function (resolve, reject) {
              $.ajax({
                  url: resourceUrl,
                  method: 'GET',
                  dataType: 'json',
                  success: resolve,
                  error: reject
              });
          });
        } else {
          return new Promise(function (resolve, reject) {
              $.ajax({
                  url: resourceUrl+'/search/'+keyword,
                  // data: JSON.stringify({keyword: keyword}),
                  method: 'GET',
                  dataType: 'json',
                  contentType: 'application/json',
                  success: resolve,
                  error: reject
              });
          });

        }




    },
    getTags: function () {
        var Promise = promise.Promise;


          return new Promise(function (resolve, reject) {
              $.ajax({
                  url: resourceUrl+'/tagslist',
                  method: 'GET',
                  dataType: 'json',
                  success: resolve,
                  error: reject
              });
          });


    },
    remove: function (id) {
        var Promise = promise.Promise;
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: resourceUrl+'/'+id,
                method: 'DELETE',
                dataType: 'json',
                success: resolve,
                error: reject
            });
        });
    }
}
