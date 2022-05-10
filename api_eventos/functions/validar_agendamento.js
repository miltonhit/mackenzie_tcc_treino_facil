var returns = require('../returns.js');
var qAgendamento = require('../queries/agendamento.js');
var qEvento = require('../queries/evento.js');
var utils = require('../utils.js');

exports.handler = function(event, context, callback) {
    var clienteId = event.headers.clienteId || event.headers.clienteid;
    var agendamentoId = event.pathParameters.agendamentoId;

    qAgendamento.getById(agendamentoId, function(err, data) {
        if (err) {
            var jsonErr = JSON.stringify(err, null, 2);
            console.error("Unable to put item in table. Error JSON: ", jsonErr);
            callback(jsonErr);
        } else {
            var agendamentoDoClienteId = false;
            var agendamentoJaUtilizado = false;

            if (data.Count > 0) {
                var agendamento = data.Items[0];
                if (agendamento.utilizado) agendamentoJaUtilizado = true;
                else {
                    qEvento.getById(agendamento.eventoId, function(err1, data1) {
                        if (err1) {
                            var jsonErr = JSON.stringify(err1, null, 2);
                            console.error("Unable to put item in table. Error JSON: ", jsonErr);
                            callback(jsonErr);
                        } else {
                            if (data1.Count > 0) {
                                console.log("EVENTO_OWNER: " + data1.Items[0].owner);
                                console.log("EU: " + clienteId);

                                if (data1.Items[0].owner.valueOf() == clienteId.valueOf()) 
                                    agendamentoDoClienteId = true;
                            }
                        }   
                    });
                }
            }

            if (agendamentoJaUtilizado) {
                returns.logic(callback, returns.logicalErrors.agendamentoJaUtilizado);
            //} else if (!agendamentoDoClienteId) {
            //    returns.logic(callback, returns.logicalErrors.voceNaoPodeValidarEsseAgendamento); 
            } else {
                qAgendamento.validarById(agendamentoId, function(err2, data2) {
                    if (err2) {
                        var jsonErr = JSON.stringify(err2, null, 2);
                        console.error("Unable to put item in table. Error JSON: ", jsonErr);
                        callback(jsonErr);
                    } else {
                        //
                        // Callback
                        returns.success(callback, {
                            id: agendamentoId
                        });
                    }        
                });
            }
        }
    });
};