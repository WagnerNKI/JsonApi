const five = require("johnny-five");
const board = new five.Board({
    port: "COM3"
});

const request = require("request");
const configuracao = require("./config");
const fs = require("fs");
const path = require("path");
const api = configuracao.api;
var endpointCreateSensor = api + "/api/Sensor/";
var newId;
var id;
var noId;

board.on("ready", function () {
    console.log("Ready");

    const ultrassom = new five.Proximity({
        pin: 7,
        controller: "HCSR04",
        freq: 1000
    });

    //check de id do sensor já gravado
    fs.readFile("./id.txt", 'utf8', (error, data) => {
        if (error) {
            // em caso de erro, o sistema cria um id novo
            console.error(error);
            request.post(endpointCreateSensor, {
                json: true,
                body: { valor: 0 }
            }, function (error, res, body) {
                if (error) {
                    console.error(error);
                    return;
                }
                console.log("Criando");
                console.log(res && res.statusCode);
                console.log(body);
                newId = body.id;
                console.log(newId);

                fs.writeFile("./id.txt", newId,
                    (err) => {

                        if (err) {
                            console.error("txt nao gravado");
                            return;
                        }
                        console.log("txt gravado");
                        id = newId;
                    }
                );
            })

            return;
        }
        id = data;
        console.log("Id encontrado:");
        console.log(id);
     
        ultrassom.on("data", function () {
            var endpointUpdateSensor = endpointCreateSensor + id;
            console.log("Atualizando");
            console.log(endpointUpdateSensor);
            console.log(this.cm);
            const cm = Math.floor(this.cm);
    
            const dados = {
                valor: cm
            };
    
            request.put(endpointUpdateSensor, {
                json: true,
                body: dados
            },
                function (error, res, body) {
                    if (error) {
                        console.error(error);
                        return;
                    }
                    console.log(res && res.statusCode);
                    console.log(body);
                })
        })
    })
});