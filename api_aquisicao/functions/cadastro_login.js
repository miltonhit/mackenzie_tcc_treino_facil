var returns = require('../returns.js');
var qCliente = require('../queries/cliente.js');
var utils = require('../utils.js');

exports.handler = function(event, context, callback) {
    qCliente.getByCpf(event.body.cpf, function(err, data) {
        
        if (err) {
            var jsonErr = JSON.stringify(err, null, 2);
            console.error("Unable to scan the table. Error JSON:", jsonErr);
            callback(jsonErr);
        } else {
	    	if (err) {
	            var jsonErr = JSON.stringify(err, null, 2);
	            console.error("Unable to scan the table. Error JSON:", jsonErr);
	            callback(jsonErr);
	        } else {
	        	if (data.Count > 0 && data.Items[0] && data.Items[0].senha == event.body.senha) {
	        		returns.success(callback, {
	        			status:"200",
	            		result: data.Items[0].id
	        		});
	        	} else {
	        		returns.logic(callback, returns.logicalErrors.usuarioSenhaInvalido); 
	        	}
	        }
        }
    });
};