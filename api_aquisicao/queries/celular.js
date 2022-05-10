var AWS = require("aws-sdk");
var dynamodb = new AWS.DynamoDB();

var info = {
    table: "tcc_celular"
};

module.exports = {
    getByClienteId: function(clienteId, callback) {
        var docClient = new AWS.DynamoDB.DocumentClient();
        
        var params = {
            TableName : info.table,
            KeyConditionExpression: "clienteId = :clienteId",
            ExpressionAttributeValues: {
                ":clienteId": clienteId
            }
        };    
        
        docClient.query(params, callback);
    },

    add: function(obj, callback) {
        var params = {
            TableName: info.table,
            Item:{
                clienteId : { S: obj.clienteId},
                numero : { S: obj.numero},
                dtCriacao: { S: new Date().toISOString().replace('T', ' ') }
            }
        };
                         
        dynamodb.putItem(params, callback);
        console.log(obj);
    }
};