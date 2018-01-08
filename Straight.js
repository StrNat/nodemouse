let Model = require('./Model');
let Motion = require('./Motion');
let rpio = require('rpio');

const SEQUENCE = {
    ASC: Symbol(),
    DEC: Symbol()
};

let maxVelocity = 0;
let targetDistance = 0;
let terminalVelocity = 0;

let tmpAcc = 0;
let tmpDecc = 0;

class Straight extends Motion {
    constructor(param) {
        super();

        maxVelocity = param.maxVelocity;
        targetDistance = param.distance;
        terminalVelocity = param.terminal;
        tmpAcc = param.acc;
        tmpDecc = param.decc;

        Model.setParam({
            angleVelocity: 0,
            acc: param.acc,
            angAcc: 0,
            distance: 0,
            angle: 0
        });
        if (param.direction === "front") {
            rpio.write(36, rpio.LOW); //LEFT_CW
            rpio.write(31, rpio.HIGH); //RIGHT_CW
        } else if (param.direction === "REAR") {
            rpio.write(36, rpio.HIGH); //LEFT_CW
            rpio.write(31, rpio.LOW); //RIGHT_CW
        }
        this.sequence = "ACC";
    }

    exe() {
        let model = Model.getPositionData();
        switch (this.sequence) {
            case "ACC": //加速時or一定速度時
                this.sequence = detectSequence(model);
                if (model.velocity >= maxVelocity) {
                    Model.setParam({
                        velocity: maxVelocity,
                        acc: 0
                    });
                }
                if (this.sequence !== "DECC") {
                    break;
                }
            case "DECC": //減速時
                if (model.velocity <= terminalVelocity) {
                    Model.setParam({
                        velocity: terminalVelocity,
                        acc: 0
                    });
                } else {
                    Model.setParam({
                        acc: tmpDecc
                    });
                }
                break;
        }
        return {
            status: model.distance >= targetDistance
        };
    }
}

let detectSequence = function (model) {
    function getReminingDistance() {
        return Math.abs((model.velocity + terminalVelocity) * (model.velocity - terminalVelocity) / (2 * tmpDecc));
    }
    let slowDonwDistance = getReminingDistance(model);
    return (targetDistance - model.distance >= slowDonwDistance) ? "ACC" : "DECC";
}
module.exports = Straight;