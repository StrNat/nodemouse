let io = require('socket.io').listen(8080);
let cat = require('cat');

io.sockets.on('connection', function (socket) {
    setInterval(() => {
        cat("/dev/rtlightsensor0", function (er, data) {
            let sen = data.replace("\n", "").split(" ");
            for (let i = 0; i < sen.length; i++) {
                sen[i] = parseInt(sen[i]);
            }
            socket.emit('position', {
                sensor :{
                    rightfront: parseInt(sen[0]),
                    right: parseInt(sen[1]),
                    left: parseInt(sen[2]),
                    leftfront: parseInt(sen[3])
                }
            });
        });
    }, 100);
});