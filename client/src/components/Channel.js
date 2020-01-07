import React, { useState } from 'react';
import io from 'socket.io-client';

export default function Channel() {
	const socket = io('http://localhost:4001');
	// socket.on('news', function(data) {
	// 	console.log(data);
	// 	socket.emit('my other event', { my: 'data' });
	// });
	socket.on('channel', msg => {
		setMessages([...messages, msg]);
	});
	const [messages, setMessages] = useState([]);
	const [message, setMessage] = useState('');
	return (
		<div>
			<h1>Channel</h1>
			{messages.map(message => (
				<p>{message.body}</p>
			))}
			<input
				type='text'
				onChange={e => setMessage(e.target.value)}
				value={message}></input>
			<button
				onClick={() => {
					socket.emit('channel', { body: message });
					setMessage('');
				}}>
				Send
			</button>
		</div>
	);
}
