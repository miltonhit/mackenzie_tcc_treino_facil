var returns = require('../returns.js');
var qCelular = require('../queries/celular.js');
var utils = require('../utils.js');

//
// AWS
var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

function enviarSMS(celular, token) {
	var params = {
  		Message: 'Olá! Digite o código ' + token + ' no aplicativo para continuar com o seu cadastro.', 
  		PhoneNumber: '+55' + celular,
	};

	return publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();
}


exports.handler = function(event, context, callback) {
	var clienteId = event.headers.clienteId || event.headers.clienteid;
	var token = utils.generateToken(event.body.numero + clienteId);


	if (!event.body.token) {
		enviarSMS(event.body.numero, token).then(function(data) {
    		returns.logic(callback, returns.logicalErrors.tokenEnviadoSMS); 
  		}).catch(function(err) {
	    	console.error(err, err.stack);
  		});
	} else if (event.body.token != token) {
		returns.logic(callback, returns.logicalErrors.tokenPrecisaSerInformado); 
	} else {
		var celular = {
			numero: event.body.numero,
			clienteId: clienteId
		};

		qCelular.add(celular, callback);

		returns.success(callback, {
        	status:"200",
            result: "OK"
        });
	}
};