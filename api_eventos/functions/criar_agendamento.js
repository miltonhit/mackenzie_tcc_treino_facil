var returns = require('../returns.js');
var qEvento = require('../queries/evento.js');
var qCartao = require('../queries/cartao.js');
var qAgendamento = require('../queries/agendamento.js');
var utils = require('../utils.js');

exports.handler = function(event, context, callback) {
    var clienteId = event.headers.clienteId || event.headers.clienteid;
    
    //
    //
    var agendamento = JSON.parse(event.body);

    //
    //
    agendamento.id = utils.generateUniqueKey();
    agendamento.clienteId = clienteId;

    //
    //
    qEvento.getById(agendamento.eventoId, function(err, data) {
        if (err) {
            var jsonErr = JSON.stringify(err, null, 2);
            console.error("Unable to get item in table. Error JSON: ", jsonErr);
            callback(jsonErr);
        } else {
            
            if (data.Count == 0) {
                returns.logic(callback, returns.logicalErrors.eventoIdNaoExiste); 
            } else {
                var evento = data.Items[0];
                
                qAgendamento.listByClienteId(agendamento.clienteId, function(err1, data1) {
                    if (err1) {
                        var jsonErr = JSON.stringify(err1, null, 2);
                        console.error("Unable to get item in table. Error JSON: ", jsonErr);
                        callback(jsonErr);
                    } else {
                        var horarioJaReservado = false;

                        //
                        //
                        for (var x = 0, len = data1.Count; x < len; x++) {
                            if (data1.Items[x].dataHorario == agendamento.dataHorario) {
                                horarioJaReservado = true;
                                break;
                            }
                        }

                        if (!horarioJaReservado) {

                            qCartao.listByOwnerId(clienteId, function(err2, data2) {
                                if (err2) {
                                    var jsonErr = JSON.stringify(err2, null, 2);
                                    console.error("Unable to put item in table. Error JSON:", jsonErr);
                                    callback(jsonErr);
                                } else {
                                    var cartaoEncontrado = false;

                                    for (var x = 0, len = data2.Count; x < len; x++) {
                                        if (data2.Items[x].id == agendamento.cartaoId) {
                                            cartaoEncontrado = true;
                                            break;
                                        }
                                    }
                        
                                    if (!cartaoEncontrado) {
                                        returns.logic(callback, returns.logicalErrors.cartaoIdNaoExiste);
                                    } else {
                                        agendamento.valor = data.Items[0].configuracao.valor;
                                        agendamento.descricao = evento.descricao;
                                        
                                        qAgendamento.agendar(agendamento, function(err3, data3) {
                                            if (err3) {
                                                var jsonErr = JSON.stringify(err3, null, 2);
                                                console.error("Unable to put item in table. Error JSON:", jsonErr);
                                                callback(jsonErr);
                                            } else {
                                                returns.success(callback, {
                                                    id: agendamento.id
                                                });
                                            }
                                        });
                                    }
                                }
                            });
                            
                        } else {
                            returns.logic(callback, returns.logicalErrors.jaPossuiAgendamentoEsseHorario); 
                        }
                    }
                });
            }
        }        
    });
};
