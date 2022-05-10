var returns = require('../returns.js');
var qCartao = require('../queries/cartao.js');
var utils = require('../utils.js');

exports.handler = function(event, context, callback) {
    var clienteId = event.headers.clienteId || event.headers.clienteid;

    qCartao.listByOwnerId(clienteId, function(err, data) {
        if (err) {
            var jsonErr = JSON.stringify(err, null, 2);
            console.error("Unable to get items in table. Error JSON: ", jsonErr);
            callback(jsonErr);
        } else {

            for (var x = 0, len = data.Count; x < len; x++) {
                data.Items[x].numero = "XXXXXXXXXXXX" + data.Items[x].numero.substr(data.Items[x].numero.length - 4);
                data.Items[x].cvv = null;
                data.Items[x].validade = null;
            }
            
            returns.success(callback, data);
        }
    });
};