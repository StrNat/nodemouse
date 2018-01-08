let cat = require('cat');

setInterval(() => {
    cat("/dev/rtlightsensor0", function (er, data) {
        let sensor = data.replace("\n", "").split(" ");
        for (let i = 0; i < sensor.length; i++) {
            sensor[i] = parseInt(sensor[i]);
        }
        console.log({
            rightfront: sensor[0],
            right: sensor[1],
            left: sensor[2],
            leftfront: sensor[3]
        });
    });
}, 1000);