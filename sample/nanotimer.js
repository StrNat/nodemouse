let nanotimer = require('nanotimer');
let timer = new nanotimer();

let count = 0;
timer.setInterval(() => {
    console.log(count++);
    if (count > 20) {
        console.log("end");
        timer.clearInterval();
    }
}, '', '100m');