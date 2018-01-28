let rpio = require('rpio');

rpio.open(22, rpio.OUTPUT, rpio.LOW); //led0
rpio.open(38, rpio.INPUT, rpio.PULL_DOWN); //sw0
rpio.poll(38, (pin) => { // コールバック関数は’function’を省略したアロー関数式で表します。
    const status = rpio.read(pin);
    if (status === rpio.HIGH) {
        rpio.write(22, rpio.LOW);
    } else {
        rpio.write(22, rpio.HIGH);
    }
    console.log(status);
});