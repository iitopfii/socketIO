const express = require('express');
const app = express();
const server = require('http').createServer(app);
const socketIO = require('socket.io')(server, { cors: { origins: '*' } });


app.get('/p2', (req, res) => {
    // res.send('<h1>Hello World</h1>');
   res.sendFile(__dirname + '/index.html');
});


app.get('/', (req, res) => {
    res.send('<h1>Hello World</h1>');
    // res.sendFile(__dirname + '/index.html');
});

server.listen(3000, () => {
    console.log('listening on port ' + server.address().port);
});

// const io = socketIO(server);

socketIO.on('connection', (socket) => {
    socket.username = 'Anonymous';
    socket.on('join', (data) => {
        if(!data.room_id){
            data.room_id = 1;
        }
        socket.room_id = data.room_id;
        socket.username = data.username;
        socket.join(data.room_id);
        socket.emit('message', {message:'User :'+socket.username+' joined !',username:'BOT'});
        socket.to(socket.room_id).emit('message', {message:'User :'+socket.username+' joined !',username:'BOT'});
    });

    socket.on('change_username', (data) => {
        socket.username = data;
    });

    socket.on('chat', (data) => {
        io.sockets.emit('chat', data);
    });
 
    socket.on('typing', (data) => {
        socket.to(socket.room_id).emit('typing', data.username);
    });
    socket.on('typing_end', (data) => {
        socket.to(socket.room_id).emit('typing_end', data.username);
    });

    socket.on('message', data => {
        socket.emit('message', { message: data.message ,username: socket.username } );
        socket.to(socket.room_id).emit('message', { message: data.message ,username: socket.username } );
    });
    
    socket.on('announce', data => {
        socket.emit('message', { message: data.message ,username: 'ประกาศ ' } );
        socket.broadcast.emit('message', { message: data.message ,username: 'ประกาศ ' } );
    });



});

