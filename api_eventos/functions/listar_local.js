var returns = require('../returns.js');
var qLocal = require('../queries/local.js');
var utils = require('../utils.js');

exports.handler = function(event, context, callback) {
    var clienteId = event.headers.clienteId || event.headers.clienteid;

    if (clienteId) {
        qLocal.getByOwnerId(clienteId, function(err, data) {
            if (err) {
                var jsonErr = JSON.stringify(err, null, 2);
                console.error("Unable to get items in table. Error JSON: ", jsonErr);
                callback(jsonErr);
            } else {
                returns.success(callback, data);
            }
        });

    } else {
        qLocal.list(function(err, data) {
            if (err) {
                var jsonErr = JSON.stringify(err, null, 2);
                console.error("Unable to get items in table. Error JSON: ", jsonErr);
                callback(jsonErr);
            } else {
                returns.success(callback, data);
            }
        });
    }
};