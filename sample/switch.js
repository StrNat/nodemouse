let rpio = require('rpio');

rpio.open(22, rpio.OUTPUT, rpio.LOW); //led0
rpio.open(38, rpio.INPUT, rpio.PULL_DOWN); //sw0
rpio.poll(38, (pin) => {
    const status = !!!rpio.read(pin) ? rpio.HIGH : rpio.LOW;
    console.log(status);
    rpio.write(22, status);
});