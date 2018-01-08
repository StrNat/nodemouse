let rpio = require('rpio');
let cat = require('cat');
let PWM = require("raspi-pwm").PWM;
let io = require('socket.io').listen(8080);
let Model = require('./Model');
let Straight = require('./Straight');
let nanotimer = require('nanotimer');
let timer = new nanotimer();

let motionInterval;
let motionList;
let motion;
let motionIndex = 0;
let socket;

let setup = function () {
    rpio.open(36, rpio.OUTPUT, rpio.LOW); //LEFT_CW
    rpio.open(31, rpio.OUTPUT, rpio.LOW); //RIGHT_CW

    rpio.open(22, rpio.OUTPUT, rpio.LOW); //led0
    rpio.open(18, rpio.OUTPUT, rpio.LOW); //led1
    rpio.open(16, rpio.OUTPUT, rpio.LOW); //led2
    rpio.open(12, rpio.OUTPUT, rpio.LOW); //led3

    rpio.open(38, rpio.INPUT, rpio.PULL_DOWN); //sw0
    rpio.open(37, rpio.INPUT, rpio.PULL_DOWN); //sw1
    rpio.open(40, rpio.INPUT, rpio.PULL_DOWN); //sw2     
}


let main = function () {
    setup();
    io.sockets.on('connection', (sck) => {
        socket = sck;
    });
    timer.setInterval(() => {
        cat("/dev/rtlightsensor0", (error, data) => {
            let sensor = data.replace("\n", "").split(" ");
            for (let i = 0; i < sensor.length; i++) {
                sensor[i] = parseInt(sensor[i]);
            }
            Model.setSensorData(sensor);
            if (socket) {
                socket.emit('position', Model.getPositionData());
            }
        });
        Model.calcuration();
    }, '', '10m');

    setInterval(() => {
        if (motion) {
            let result = motion.exe();
            if (result.status) {
                motion = undefined;
                Model.stopRunning();
                Model.stopCtrl();
                Model.clear();
            }
        }
    });

    rpio.poll(38, (pin) => {
        if (!!!rpio.read(pin)) {
            rpio.write(22, rpio.HIGH);
            setTimeout(() => {
                Model.clear();
                motion = new Straight({
                    maxVelocity: 500,
                    acc: 1000,
                    decc: -1000,
                    distance: 180 * 4,
                    terminal: 100,
                    direction: "front"
                });
                Model.startRunning();
                Model.startCtrl();
                rpio.write(22, rpio.LOW);
            }, 1000);
        }
    });

    rpio.poll(40, () => {
        Model.stopRunning();
        Model.clear();
        motion = undefined;
    });

};

main();