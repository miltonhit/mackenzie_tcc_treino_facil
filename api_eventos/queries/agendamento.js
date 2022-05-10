var AWS = require("aws-sdk");
var dynamodb = new AWS.DynamoDB();
var utils = require('../utils.js');

var info = {
    table: "tcc_agendamento",
    eventoIdIndex: "eventoId-index",
    clienteIdIndex: "clienteId-index"
};

module.exports = {
    agendar: function(agendamento, callback) {
        var docClient = new AWS.DynamoDB.DocumentClient();

        var params = {
            TableName: info.table,
            Item:{
                id: agendamento.id,
                clienteId: agendamento.clienteId,
                descricao: agendamento.descricao,
                eventoId: agendamento.eventoId,
                dataHorario: agendamento.dataHorario,
                valor: agendamento.valor,
                cartaoId: agendamento.cartaoId,
                utilizado: false,
                dtCriacao: utils.now()
            }
        };
                         
        docClient.put(params, callback);
    },

    validarById: function(id, callback) {
        var docClient = new AWS.DynamoDB.DocumentClient();

        var params = {
            TableName: info.table,
            Key: {
                "id": id
            },
            UpdateExpression: "set utilizado = :utilizado",
            ExpressionAttributeValues: {
                ":utilizado": "true"
            }
        };

        docClient.update(params, callback);
    },

    getById: function(id, callback) {
        var docClient = new AWS.DynamoDB.DocumentClient();
    
        var params = {
            TableName: info.table,
            KeyConditionExpression: "id = :id",
            ExpressionAttributeValues: {
                ":id": id
            }
        };

        docClient.query(params, callback);
    },

    listByClienteId: function(clienteId, callback) {
        var docClient = new AWS.DynamoDB.DocumentClient();
    
        var params = {
            TableName: info.table,
            IndexName: info.clienteIdIndex,
            KeyConditionExpression: "clienteId = :clienteId",
            ExpressionAttributeValues: {
                ":clienteId": clienteId
            }
        };
        
        docClient.query(params, callback);
    }
};

