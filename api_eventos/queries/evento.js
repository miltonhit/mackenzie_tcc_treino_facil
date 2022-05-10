var AWS = require("aws-sdk");
var dynamodb = new AWS.DynamoDB();
var utils = require('../utils.js');

var info = {
    table: "tcc_evento",
    localIdIndex: "local.id-index",
    ownerIndex: "owner-index"
};

module.exports = {
    add: function(evento, callback) {
        var docClient = new AWS.DynamoDB.DocumentClient();

        var params = {
            TableName: info.table,
            Item:{
                id: evento.id,
                nome: evento.nome,
                descricao: evento.descricao,
                tags: evento.tags,
                configuracao: evento.configuracao,
                local: evento.local,
                owner: evento.owner,
                dtCriacao: utils.now()
            }
        };
                         
        docClient.put(params, callback);
    },

    getByLocalId : function(localId, callback) {
        var docClient = new AWS.DynamoDB.DocumentClient();
    
        var params = {
            TableName: info.table,
            IndexName: info.localIdIndex,
            KeyConditionExpression: "local.id = :localId",
            ExpressionAttributeValues: {
                ":localId": localId
            }
        };
        
        docClient.query(params, callback);
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

    getByOwnerId : function(ownerId, callback) {
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

    listByDistance: function(distance, callback) {
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
            TableName : info.table,
            Limit: 950,
            //FilterExpression: "#lng BETWEEN :lngMin AND :lngMax AND #lat BETWEEN :latMin AND :latMax",
            //ExpressionAttributeNames: {
            //    "#lat": "local.lat",
            //    "#lng": "local.lng"
            //},
            //ExpressionAttributeValues: {
            //    ":latMin": latMin,
            //    ":latMax": latMax,
            //    ":lngMin": lngMin,
            //    ":lngMax": lngMax,

//            }
        };

        docClient.scan(params, callback);
    }
};
