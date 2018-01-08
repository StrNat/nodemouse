let PWM = require("raspi-pwm").PWM;

let hzRight = 2000;
let hzLeft = 1000;

let rightPwm = new PWM({
    pin: "GPIO12", //右側モーターのピンを指定します。
    frequency: hzRight
});
let leftPwm = new PWM({
    pin: "GPIO13", //左側モーターのピンを指定します。
    frequency: hzLeft
});
rightPwm.write(0.5);
leftPwm.write(0.5);
setTimeout(() => {
    rightPwm.write(1);
    leftPwm.write(1);
}, 3000);