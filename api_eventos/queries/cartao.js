var AWS = require("aws-sdk");
var dynamodb = new AWS.DynamoDB();
var utils = require('../utils.js');

var info = {
    table: "tcc_cartao",
    idIndex: "id-index",
    ownerIndex: "owner-index"
};

module.exports = {

    add: function(cartao, callback) {
        var docClient = new AWS.DynamoDB.DocumentClient();

        var params = {
            TableName: info.table,
               Item:{
                id: cartao.id,
                owner: cartao.owner,
                numero: cartao.numero,
                validade: cartao.validade,
                cvv: cartao.cvv,
                nome: cartao.nome,
                cpf: cartao.cpf,
                bandeira: cartao.bandeira,
                dtCriacao: utils.now()
            }
        };
                         
        docClient.put(params, callback);
    },

    listByOwnerId : function(ownerId, callback) {
        var docClient = new AWS.DynamoDB.DocumentClient();
    
        var params = {
            TableName: info.table,
            ExpressionAttributeNames: {
                "#owner": "owner"
            },
            IndexName: info.ownerIndex,
            KeyConditionExpression: "#owner = :ownerId",
            ExpressionAttributeValues: {
                ":ownerId": ownerId
            }
        };
        
        docClient.query(params, callback);
    },

    removeById: function(id, callback) {
        var docClient = new AWS.DynamoDB.DocumentClient();

        var params = {
            TableName: info.table,
            Key: {
                "id": id
            }
        };

        docClient.delete(params, callback);
    }
};
