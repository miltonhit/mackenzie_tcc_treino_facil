var returns = require('../returns.js');
var qCartao = require('../queries/cartao.js');
var utils = require('../utils.js');

exports.handler = function(event, context, callback) {
    var clienteId = event.headers.clienteId || event.headers.clienteid;
    
    //
    //
    var cartao = JSON.parse(event.body);
    cartao.id = utils.generateUniqueKey();
    cartao.owner = clienteId;

    console.log("LOG1" + cartao);

    qCartao.add(cartao, function(err, data) {

        if (err) {
            var jsonErr = JSON.stringify(err, null, 2);
            console.error("Unable to put item in table. Error JSON: ", jsonErr);
            callback(jsonErr);
        } else {

            //
            // Callback
            returns.success(callback, {
                id: cartao.id
            });
        }
    });
};