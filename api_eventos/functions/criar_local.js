var returns = require('../returns.js');
var qLocal = require('../queries/local.js');
var utils = require('../utils.js');

exports.handler = function(event, context, callback) {
    var clienteId = event.headers.clienteId || event.headers.clienteid;
    
    //
    //
    var local = JSON.parse(event.body);
    local.id = utils.generateUniqueKey();
    local.owner = clienteId;

    console.log("LOG1" + local);

    qLocal.add(local, function(err, data) {

        if (err) {
            var jsonErr = JSON.stringify(err, null, 2);
            console.error("Unable to put item in table. Error JSON: ", jsonErr);
            callback(jsonErr);
        } else {
            //
            // Callback
            returns.success(callback, {
                id: local.id
            });
        }
    });
};