const express = require('express');
const app = express();
const port = 4000;
const io = require('socket.io').listen(4001).sockets;

app.get('/', (req, res) => res.send('Hello from Chat app'));

app.listen(port, () =>
	console.log(`🚀  Chat app is listening on port ${port}!`)
);

io.on('connection', function(socket) {
	//socket.emit('news', { hello: 'world' });
	socket.on('channel', message => {
		console.log(message);
		socket.emit('channel', message);
	});
});
