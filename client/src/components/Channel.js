import React, { useState } from 'react';
import io from 'socket.io-client';

export default function Channel(props) {
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
			<h1 style={{ color: '#fafafa' }}>#{props.channel}</h1>

			<div style={{ overflowY: 'scroll', height: '300px' }}>
				{messages.map(msg => (
					<p style={{ color: 'white' }}>{msg.body}</p>
				))}
			</div>

			<input
				type='text'
				onChange={e => setMessage(e.target.value)}
				value={message}
				style={{ bottom: 0 }}
			/>

			<button
				className='button'
				onClick={() => {
					socket.emit('channel', { body: message });
					setMessage('');
				}}>
				Send
			</button>
		</div>
	);
}
