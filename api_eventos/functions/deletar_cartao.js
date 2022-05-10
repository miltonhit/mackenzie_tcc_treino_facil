var returns = require('../returns.js');
var qCartao = require('../queries/cartao.js');
var utils = require('../utils.js');

exports.handler = function(event, context, callback) {
    var clienteId = event.headers.clienteId || event.headers.clienteid;
    var cartaoId = event.pathParameters.cartaoId;

    qCartao.listByOwnerId(clienteId, function(err, data) {
        if (err) {
            var jsonErr = JSON.stringify(err, null, 2);
            console.error("Unable to get items in table. Error JSON: ", jsonErr);
            callback(jsonErr);
        } else {
            var cartaoEncontrado = false;

            for (var x = 0, len = data.Count; x < len; x++) {
                if (data.Items[x].id == cartaoId) {
                    cartaoEncontrado = true;
                    break;
                }
            }

            if (!cartaoEncontrado) {
                returns.logic(callback, returns.logicalErrors.cartaoIdNaoExiste);
            } else {

                console.log("CARTAOID" + cartaoId);

                qCartao.removeById(cartaoId, function(err1, data1) {
                    if (err1) {
                        var jsonErr = JSON.stringify(err1, null, 2);
                        console.error("Unable to delete items in table. Error JSON: ", jsonErr);
                        callback(jsonErr);
                    } else {
                        returns.success(callback, {
                            id: cartaoId
                        });
                    }
                });
            }    
        }
    });
};