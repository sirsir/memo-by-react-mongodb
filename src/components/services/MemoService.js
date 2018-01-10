var $ = require('jquery');
var promise = require('es6-promise');
// var ip = require('ip').address();
// ~~~ MANUAL bcoz above comment not work
var ip = '192.168.1.173'

// console.log(require('ip'))

// const internalIp = require('internal-ip');
//
// ip = internalIp.v4.sync()

// console.dir ( ip );
// var resourceUrl = 'http://localhost:3002/api/memos';

var resourceUrl = 'http://'+ip+':3002/api/memos';

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
    find: function () {
        var Promise = promise.Promise;
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: resourceUrl,
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
