var returns = require('../returns.js');
var qCliente = require('../queries/cliente.js');
var utils = require('../utils.js');

exports.handler = function(event, context, callback) {
    qCliente.getByCpf(event.body.cpf, function(err, data) {
        
        if (err) {
            var jsonErr = JSON.stringify(err, null, 2);
            console.error("Unable to scan the table. Error JSON:", jsonErr);
            callback(jsonErr);
        } else {
            if (data.Count > 0) {
                returns.logic(callback, returns.logicalErrors.cpfCadastrado); 
            } else {
                qCliente.getByEmail(event.body.email, function(err, data) {
                    
                    if (err) {
                        returns.fatal(callback, err); 
                    } else {

                        if (data.Count > 0) {
                            returns.logic(callback, returns.logicalErrors.emailCadastrado);
                        } else {
                            //
                            // Inclusão cliente
                            var cliente = event.body;
                            cliente.id = utils.generateUniqueKey();
                            qCliente.add(cliente, callback);

                            //
                            // Callback
                            returns.success(callback, {
                                status:"200",
                                result: cliente.id
                            });
                        }
                    }
                });
            }
        }
    });
};