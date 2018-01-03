var $ = require('jquery');
var promise = require('es6-promise');
var resourceUrl = 'http://localhost:3002/api/memos';

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
