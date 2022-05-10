var returns = require('../returns.js');
var qLocal = require('../queries/local.js');
var qEvento = require('../queries/evento.js');
var utils = require('../utils.js');

exports.handler = function(event, context, callback) {
    var clienteId = event.headers.clienteId || event.headers.clienteid;
    
    //
    //
    var evento = JSON.parse(event.body);

    evento.id = utils.generateUniqueKey();
    evento.owner = clienteId;

    //
    //
    qLocal.getById(evento.local.id, function(err, data) {
        if (err) {
            var jsonErr = JSON.stringify(err, null, 2);
            console.error("Unable to get item in table. Error JSON: ", jsonErr);
            callback(jsonErr);
        } else {
            if (data.Count == 0 || data.Items[0].owner != clienteId) {
                returns.logic(callback, returns.logicalErrors.localIdNaoExiste); 
            } else {
                console.log("chegando aqui!!");
                //
                // Coloca o local dentro do evento.
                evento.local = data.Items[0];

                //
                //
                qEvento.add(evento, function(err2, data2) {
                    if (err2) {
                        var jsonErr = JSON.stringify(err2, null, 2);
                        console.error("Unable to put item in table. Error JSON:", jsonErr);
                        callback(jsonErr);
                    } else {
                        returns.success(callback, {
                            id: evento.id
                        });
                    }
                });
            }
        }        
    });
};