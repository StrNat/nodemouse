const dt = 0.01;

let PWM = require("raspi-pwm").PWM;

const tread = 80;
const tire = 48;
const velocityPerPulse = (360.0 / 400) * (tire / 2) * (Math.PI / 180);

//センサーの理想値
const rightSensorIdeal = 420;
const leftSensorIdeal = 520;

//制御するための壁があることを判別する閾値
const rightSensorThreshold = rightSensorIdeal - 50;
const leftSensorThreashold = leftSensorIdeal - 100;

let velocity = 0;
let acc = 0;
let distance = 0;
let angVelocity = 0;
let angAcc = 0;
let angle = 0;
let sensor = {};

let stop = true;
let ctrlEnable = false;

const gainP = 0.12;


class Model {

    static clear() {
        velocity = 0;
        acc = 0;
        distance = 0;
        angVelocity = 0;
        angAcc = 0;
        angle = 0;
        sensor = {};
    }


    static stopRunning() {
        stop = true;
    }

    static startRunning() {
        stop = false;
    }

    static startCtrl() {
        ctrlEnable = true;
    }

    static stopCtrl() {
        ctrlEnable = false;
    }

    static setSensorData(sen) {
        sensor = {
            rightfront: parseInt(sen[0]),
            right: parseInt(sen[1]),
            left: parseInt(sen[2]),
            leftfront: parseInt(sen[3])
        };
    }

    static setParam(param) {

        if (typeof param.velocity === "number") {
            velocity = param.velocity;
        }
        if (typeof param.angVelocity === "number") {
            angVelocity = param.angVelocity;
        }

        if (typeof param.acc === "number") {
            acc = param.acc;
        }
        if (typeof param.angAcc === "number") {
            angAcc = param.angAcc;
        }

        if (typeof param.distance === "number") {
            distance = param.distance;
        }
        if (typeof param.angle === "number") {
            angle = param.angle;
        }

    }
    static calcuration() {
        velocity += acc * dt; //速度の計算
        angVelocity += angAcc * dt; //角速度の計算
        distance += Math.abs(velocity) * dt; //距離の計算
        angle += Math.abs(angVelocity) * dt; //角度の計算

        let ctrl = 0;
        if (ctrlEnable) { //壁制御を許可したときだけ
            ctrl = getCtrlValue() * gainP;
        }

        // let rightVelocity = velocity + (angVelocity * tread / 2) + ctrl; //並進運動の説明をしないためコメントアウト。旋回などするときに必須。
        // let leftVelocity = velocity - (angVelocity * tread / 2) - ctrl;  //並進運動の説明をしないためコメントアウト。旋回などするときに必須。

        let rightVelocity = velocity + ctrl;
        let leftVelocity = velocity - ctrl;

        let hzRight = Math.abs(parseInt(rightVelocity / velocityPerPulse));
        let hzLeft = Math.abs(parseInt(leftVelocity / velocityPerPulse));

        let rightPWM = new PWM({
            pin: "GPIO12",
            frequency: hzRight
        });
        let leftPwm = new PWM({
            pin: "GPIO13",
            frequency: hzLeft
        });

        if (stop) {
            rightPWM.write(1);
            leftPwm.write(1);
        } else {
            rightPWM.write(0.5);
            leftPwm.write(0.5);
        }
    }

    static getPositionData() {
        return {
            velocity: velocity,
            acc: acc,
            distance: distance,
            angVelocity: angVelocity,
            angAcc: angAcc,
            angle: angle,
            sensor: sensor
        };
    }
}

let getCtrlValue = function () {
    let check = 0;
    let error = 0;

    if (sensor.right > rightSensorThreshold) {  //センサー値が閾値を超えてるとき
        error += sensor.right - rightSensorIdeal;
        check++;
    }
    if (sensor.left > leftSensorThreashold) { //センサー値が閾値を超えてるとき
        error += sensor.left - leftSensorIdeal;
        check++;
    }
    if (check === 1) {  //片方の壁しかないとき、値を２倍しないと、制御量が足りない。
        error *= 2;
    }
    return error;
}
module.exports = Model;