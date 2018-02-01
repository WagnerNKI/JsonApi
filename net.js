const request = require("request");
const configuracao = require("./config");
const fs = require("fs");
const api = configuracao.api;
var endpointCreateSensor = api + "/api/Sensor/";

function atualizar(id, dados, callback) {
    var endpointUpdateSensor = endpointCreateSensor + id;
    console.log("Atualizando");

    request.put(endpointUpdateSensor, {
        json: true,
        body: dados
    },
        function (error, res, body) {
            callback(error, dados);
        }
    )
}

function obterId(callback) {

    fs.readFile("./id.txt", (error, data) => {
        if (error) {
            // em caso de erro, o sistema cria um id novo
            console.error(error);
            console.log("Criando Novo ID");
            request.post(endpointCreateSensor, {
                json: true,
                body: { valor: 0 }
            }, function (error, res, body) {
                if (error) {
                    console.error(error);
                    return;
                }
                console.log(body);
                var id = body.id;
                console.log(id);
                
                //escreve id em um txt
                fs.writeFile("./id.txt", id, (err) => {
                    if (err) {
                        console.error("txt nao gravado");
                        return;
                    }
                    console.log("txt gravado");
                    callback(error, id);
                }
            );
        })
        return;
    }
    const id = data.toString();
    console.log("Id encontrado:");
    console.log(id);
    callback(null, id);
});
}

exports.atualizar = atualizar;
exports.obterId = obterId;