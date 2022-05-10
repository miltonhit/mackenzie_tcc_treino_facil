var AWS = require("aws-sdk");
var dynamodb = new AWS.DynamoDB();

var info = {
    table: "tcc_cliente",
    emailIndex: "email-index",
    cpfIndex: "cpf-index"
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

    getByCpf: function (cpf, callback) {
        var docClient = new AWS.DynamoDB.DocumentClient();
        
        var params = {
            TableName : info.table,
            IndexName : info.cpfIndex,
            KeyConditionExpression: "cpf = :cpf",
            ExpressionAttributeValues: {
                ":cpf": cpf
            }
        };    
        
        docClient.query(params, callback);
    },
    
    getByEmail: function(email, callback) {
        var docClient = new AWS.DynamoDB.DocumentClient();
    
        var params = {
            TableName: info.table,
            IndexName: info.emailIndex,
            KeyConditionExpression: "email = :email",
            ExpressionAttributeValues: {
                ":email": email
            }
        };
        
        docClient.query(params, callback);
    },

    add: function(cliente, callback) {
        var params = {
            TableName: info.table,
            Item:{
                id : { S: cliente.id},
                cpf : { S: cliente.cpf},
                nome: { S: cliente.nome},
                dtNascimento: { S: cliente.dtNascimento},
                email: { S: cliente.email},
                senha: { S: cliente.senha},
                dtCriacao: { S: new Date().toISOString().replace('T', ' ') }
            }
        };
                         
        dynamodb.putItem(params, callback);
    },

    changePassword: function(cliente, callback) {
        var docClient = new AWS.DynamoDB.DocumentClient();

        var params = {
            TableName: info.table,
            Key:{
                "id": cliente.id
            },
            UpdateExpression: "set senha = :senha",
            ExpressionAttributeValues:{
                ":senha":cliente.senha
            },
            ReturnValues:"UPDATED_NEW"
        };

        docClient.update(params, callback);
    }
};