let io = require('socket.io').listen(8080);

io.sockets.on('connection', function (socket) {
    let count = 0;
    setInterval(() => {
        count++;
        socket.emit('position', {
            sensor: {
                left: 100 + count++,
                leftfront: 120 + count++,
                right: 150 + count++,
                rightfront: 120 + count++
            }
        });
        if (count > 100) {
            count = 0;
        }
    }, 100);
});