const express = require('express');
const app = express();
const port = 4000;
const io = require('socket.io').listen(4001).sockets;
const mongoose = require('mongoose');

app.get('/', (req, res) => res.send('Hello from Chat app'));

app.listen(port, () =>
	console.log(`🚀  Chat app is listening on port ${port}!`)
);

mongoose
	.connect(
		`mongodb+srv://andrej:naprednebazepodataka@cluster0-bqac9.mongodb.net/test`,
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	.then(() => console.log(`🖐️  Mongoose connected to DB`))
	.catch(err => console.log(err));

io.on('connection', function(socket) {
	//socket.emit('news', { hello: 'world' });
	socket.on('channel', message => {
		console.log(message);
		socket.emit('channel', message);
	});
});
