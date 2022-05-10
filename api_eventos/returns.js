module.exports = {
    success: function(callback, obj) {
        callback(null, {
            statusCode: 200,
            body: JSON.stringify(obj)
        });
    },
    
    logic: function(callback, obj) {
        callback(null, {
            statusCode: 400,
            body: JSON.stringify(obj)
        });
    },
    
    fatal: function(callback, obj) {
        var jsonErr = JSON.stringify(obj, null, 2);
        console.error("Fatal Error", jsonErr);

        callback(jsonErr, {
            statusCode: 500,
            body: jsonErr
        });
    },
    
    logicalErrors: {
        localIdNaoExiste: {id: 5, message: "Esse local não existe ou não está disponível para cadastrar um evento :(", notify: "error-pop-up"},
        eventoIdNaoExiste: {id: 6, message: "Esse evento não existe ou não está disponível para agendamento :(", notify: "error-pop-up"},
        jaPossuiAgendamentoEsseHorario: {id: 7, message: "Você já possui um agendamento para essa data e horário.", notify: "error-pop-up"},
        cartaoIdNaoExiste: {id: 8, message: "Esse cartão não existe :)", notify: "error-pop-up"},
        voceNaoPodeValidarEsseAgendamento: {id: 9, message: "Você não pode validar esse agendamento pois você não é o dono do evento.", notify: "error-pop-up"},
        agendamentoJaUtilizado: {id: 10, message: "Esse agendamento já foi utilizado.", notify: "error-pop-up"}
    }
};