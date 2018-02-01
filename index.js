const five = require("johnny-five");
const board = new five.Board({
    port: "COM3"
});

const net = require("./net")

board.on("ready", function () {
    console.log("Ready");

    const ultrassom = new five.Proximity({
        pin: 7,
        controller: "HCSR04",
        freq: 1000
    });

    //check de id do sensor já gravado
    net.obterId(function (error, id) {
        if (error) {
            console.error(error);
        }
    })
    {
        ultrassom.on("data", function () {
            console.log(this.cm);
            const cm = Math.floor(this.cm);

            const dados = {
                valor: cm
            };
            const id = net.obterId.id;
            net.atualizar(id, dados, function (error, sensor) {
                if (error) {
                    console.error(error);
                    return;
                }
                console.log(sensor);
            })
        })

    }
});