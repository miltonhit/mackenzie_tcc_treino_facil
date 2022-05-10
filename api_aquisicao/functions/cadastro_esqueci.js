var returns = require('../returns.js');
var qCliente = require('../queries/cliente.js');
var qCelular = require('../queries/celular.js');
var utils = require('../utils.js');

//
// AWS
var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

function enviarSMS(celular, token) {
	var params = {
  		Message: 'Olá! Digite o código ' + token + ' no aplicativo continuar com o processo de redefinir senha.', 
  		PhoneNumber: '+55' + celular,
	};

	return publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();
}

exports.handler = function(event, context, callback) {
    qCliente.getByCpf(event.body.cpf, function(err, data) {
        
        if (err) {
            var jsonErr = JSON.stringify(err, null, 2);
            console.error("Unable to scan the table. Error JSON:", jsonErr);
            callback(jsonErr);
        
        } else {
        	if (data.Count == 0) {
        		returns.logic(callback, returns.logicalErrors.cpfNaoCadastrado);
        	} else {
        		var cliente = data.Items[0];
	        	var email = utils.obfuscateEmail(cliente.email);

	        	qCelular.getByClienteId(cliente.id, function(err1, data1) {
	        		if (err1) {
	            		var jsonErr = JSON.stringify(err, null, 2);
	            		console.error("Unable to scan the table. Error JSON: ", jsonErr);
	            		callback(jsonErr);
	            	} else {
	            		if (data1.Count == 0)
	            				returns.logic(callback, returns.logicalErrors.semCelularCadastradoParaRedefinirSenha);
	            		else {
	            			var celular = data1.Items[0];
							var token = utils.generateToken(cliente.id + cliente.senha);

	            			if (!event.body.token) {
	            				enviarSMS(celular.numero, token).then(function(data) {
    								returns.logic(callback, returns.logicalErrors.tokenEnviadoSMS); 
  								}).catch(function(err) {
	    							console.error(err, err.stack);
  								});
	            			} else if (event.body.token != token) {
								returns.logic(callback, returns.logicalErrors.tokenPrecisaSerInformado); 
							} else {
								cliente.senha = event.body.novaSenha
								qCliente.changePassword(cliente, function(err3, data3) {
									if (err3) {
										var jsonErr = JSON.stringify(err, null, 2);
										console.error("Unable to change password. Error JSON: ", jsonErr);
										callback(jsonErr);
									} else {
										returns.success(callback, {
											status:"200",
											result: "OK"
										});
									}
								});
							}
	            		}
	            	}
	        	});
        	}
        }
    });
};