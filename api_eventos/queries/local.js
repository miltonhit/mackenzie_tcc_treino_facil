var AWS = require("aws-sdk");
var dynamodb = new AWS.DynamoDB();
var utils = require('../utils.js');

var info = {
    table: "tcc_local",
    ownerIndex: "owner-index"
};

module.exports = {
    getById: function(id, callback) {
        var docClient = new AWS.DynamoDB.DocumentClient();
        
        var params = {
            TableName : info.table,
            KeyConditionExpression: "id = :id",
            ExpressionAttributeValues: {
                ":id": id
            }
        };    
        
        docClient.query(params, callback);
    },
    getByOwnerId: function(ownerId, callback) {
        var docClient = new AWS.DynamoDB.DocumentClient();
        
        var params = {
            ExpressionAttributeNames: {
                "#owner": "owner"
            },
            TableName: info.table,
            IndexName: info.ownerIndex,
            KeyConditionExpression: "#owner = :ownerId",
            ExpressionAttributeValues: {
                ":ownerId": ownerId
            }
        };   
        
        docClient.query(params, callback);
    },

    add: function(local, callback) {
        var docClient = new AWS.DynamoDB.DocumentClient();
        console.log(local);
                         
        var params = {
            TableName: info.table,
            Item:{
                id: local.id,
                owner: local.owner,
                lat: local.lat,
                lng: local.lng,
                nome: local.nome,
                descricao: local.descricao,
                enderecoCompleto: local.enderecoCompleto,
                photoUrl: local.photoUrl,
                dtCriacao: utils.now()
            }
        };
                         
        docClient.put(params, callback);
    },

    list: function(callback) {
        var docClient = new AWS.DynamoDB.DocumentClient();
        //
        //
        var latMin = -9999999999;
        var latMax = 9999999999;
        //
        //
        var lngMin = -9999999999;
        var lngMax = 9999999999;

        //
        //
        var params = {
            TableName : info.table
        };

        docClient.scan(params, callback);
    }
};
