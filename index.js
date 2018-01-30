const five = require("johnny-five");
const board = new five.Board({
    port: "COM3"
});

const request = require("request");
const configuracao = require("./config");
const id = configuracao.idSensor;
const api = configuracao.api;
var endpointCreateSensor = api + "/api/Sensor/";
var newId;


board.on("ready", function () {
    console.log("Ready");

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

        ultrassom.on("data", function () {
            var endpointUpdateSensor = endpointCreateSensor + newId;
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
    });

    const ultrassom = new five.Proximity({
        pin: 7,
        controller: "HCSR04",
        freq: 1000
    });

})
