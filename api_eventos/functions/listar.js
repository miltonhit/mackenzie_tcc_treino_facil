var returns = require('../returns.js');
var qEvento = require('../queries/evento.js');
var utils = require('../utils.js');

exports.handler = function(event, context, callback) {
    var clienteId = event.headers.clienteId || event.headers.clienteid;


    if (clienteId) {

        qEvento.getByOwnerId(clienteId, function(err, data) {
            if (err) {
                var jsonErr = JSON.stringify(err, null, 2);
                console.error("Unable to get items in table. Error JSON:", jsonErr);
                callback(jsonErr);
            } else {
                returns.success(callback, data);
            }
        });

    } else {
        var lat = event.queryStringParameters.lat;
        var lng = event.queryStringParameters.lng;

        //
        //
        qEvento.listByDistance(1000, function(err, data) {
            if (err) {
                var jsonErr = JSON.stringify(err, null, 2);
                console.error("Unable to get items in table. Error JSON:", jsonErr);
                callback(jsonErr);
            } else {

                for (var i = 0, len = data.Count; i < len; i++) {
                    var current = data.Items[i];
                    var proximasDatas = [];

                    for (diaSemanaIdx = 0, len1 = current.configuracao.diasSemana.length; diaSemanaIdx < len1; diaSemanaIdx++) {
                        var diaSemana = current.configuracao.diasSemana[diaSemanaIdx];
                        var diaSemanaDate = utils.nextDayWeek(diaSemana);
                        
                        for (horarioIdx = 0, len2 = current.configuracao.horarios.length; horarioIdx < len2; horarioIdx++) {
                            var horario = current.configuracao.horarios[horarioIdx];
                            proximasDatas.push(diaSemanaDate + " " + horario + ":00");
                        }

                        current.proximasDatas = proximasDatas;
                    }

                    current.local.distancia = utils.getDistanceFromLatLng(lat, lng, current.local.lat, current.local.lng);
                }

                var listaOrdenada = data.Items.sort(function(a, b) {
                    if (a.local.distancia < b.local.distancia) return -1;
                    else if (a.local.distancia > b.local.distancia) return 1;
                    else return 0;
                });

                data.Items = listaOrdenada;
                returns.success(callback, data);
            }
        });
    }
};