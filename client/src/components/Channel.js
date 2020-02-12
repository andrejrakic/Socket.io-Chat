import React, { useState, useEffect } from 'react';
import Picker from 'emoji-picker-react';
import io from 'socket.io-client';
import { client } from '../index';
import gql from 'graphql-tag';

export const GET_CHANNEL = gql`
	query getChannel($channelID: ID!) {
		getChannel(channelID: $channelID) {
			name
			messages {
				from
				body
			}
		}
	}
`;

export default function Channel(props) {
	const socket = io('http://localhost:4001');
	// socket.on('news', function(data) {
	// 	console.log(data);
	// 	socket.emit('my other event', { my: 'data' });
	// });
	socket.on('channel', msg => {
		console.log(msg);
		setMessages([...messages, msg]);
	});

	const [messages, setMessages] = useState([]);
	const [message, setMessage] = useState('');
	const [showEmoji, setShowEmoji] = useState(false);
	const [fontWeight, setFontWeight] = useState(false);
	const [fontStyle, setFontStyle] = useState(false);

	useEffect(() => {
		fetchMessages();
	}, [props.channel.name]);

	let fetchMessages = async () => {
		//await setMessages([]);
		console.log(messages);
		await client
			.query({
				query: GET_CHANNEL,
				variables: { channelID: props.channel._id }
			})
			.then(
				res => {
					if (res.data.getChannel.messages.length > 0) {
						setMessages(messages.concat(res.data.getChannel.messages));
					} else {
						setMessages([]);
					}
				}
				// res.data.getChannel.messages.forEach(msg =>
				// 	setMessages([...messages, msg])
				// );
			)
			.catch(err => console.log(err));
	};

	let send = () => {
		socket.emit('channel', {
			to: props.channel._id,
			body: message,
			from: props.loggedUser.avatar
		});
		setMessage('');
	};

	return !props.channel.avatar ? (
		<div>
			<div
				style={{
					backgroundColor: '#55be96',
					padding: '10px',
					borderRadius: 10
				}}>
				{/* {props.channel.avatar ? (
					<h1 style={{ color: '#fafafa' }}>
						<img
							src={props.channel.avatar}
							style={{
								borderRadius: 50,
								width: 40,
								height: 40,
								verticalAlign: 'middle'
							}}
						/>{' '}
						{props.channel.name}
					</h1>
				) : ( */}
				<h1 style={{ color: '#fafafa' }}># {props.channel.name}</h1>
				{/* )} */}
			</div>

			<div
				style={{
					overflow: 'scroll',
					maxHeight: 550,
					height: 550,
					// display: 'table-cell',
					//verticalAlign: 'bottom',
					//display: 'flex',
					flex: '1 1 auto',
					// order: 1,
					flexDirection: 'column',
					//justifyContent: 'flex-end',
					//overflowY: 'auto',
					backgroundColor: 'red'
				}}>
				{messages.map(msg => (
					<div
						style={{
							border: '2px solid #dedede',
							backgroundColor: '#f1f1f1',
							borderRadius: '5px',
							padding: '10px',
							margin: '10px 0',
							//	display: 'flex',
							//	flexDirection: 'column-reverse',
							// minHeight: 5
							heigth: 10,
							//width: 950
							justifySelf: 'flex-end'
						}}>
						<img
							src={msg.from}
							alt='Avatar'
							style={{
								//borderRadius: 50, width: 30, height: 30,
								width: '100%',
								float: 'left',
								maxWidth: '40px',
								width: '100%',
								marginRight: '20px',
								borderRadius: '50%'
							}}
						/>
						<p>{msg.body}</p>
					</div>
					// <p style={{ color: 'white', bottom: 0, position: '' }}>
					// 	{/* <img
					// 		src={msg.sender}
					// 		style={{ borderRadius: 50, width: 30, height: 30 }}
					// 	/>{' '} */}
					// 	{msg.body}
					// </p>
				))}
			</div>

			<button
				onClick={() => setShowEmoji(!showEmoji)}
				style={{
					backgroundColor: '#55be96',
					fontSize: 14,
					color: '#fafafa',
					border: 'none',
					borderRadius: 4
				}}>
				😂❤️💡
			</button>
			<button
				onClick={() => setFontWeight(!fontWeight)}
				style={{
					backgroundColor: '#55be96',
					fontSize: 14,
					border: 'none',
					borderRadius: 4,
					fontStyle: 'bold'
				}}>
				Bold
			</button>
			<button
				onClick={() => setFontStyle(!fontStyle)}
				style={{
					backgroundColor: '#55be96',
					fontSize: 14,
					border: 'none',
					borderRadius: 4,
					fontStyle: 'italic'
				}}>
				Italic
			</button>
			<div style={{ position: 'absolute', bottom: 0 }}>
				{showEmoji ? (
					<Picker
						onEmojiClick={(event, emojiObject) => {
							//setMessage([...message, emojiObject.emoji]);
							setMessage(message => `${message}${emojiObject.emoji}`);
							setShowEmoji(!showEmoji);
						}}
					/>
				) : null}
				<input
					type='text'
					onChange={e => setMessage(e.target.value)}
					value={message}
					placeholder='Type message...'
					style={{
						width: 920,
						padding: '12px 20px',
						margin: '8px 0',
						boxSizing: 'border-box',
						borderRadius: 4,
						fontSize: 20,
						fontWeight: fontWeight ? 'bold' : 'normal',
						fontStyle: fontStyle ? 'italic' : 'normal'
					}}
					onKeyDown={e => {
						if (e.key === 'Enter') send();
					}}
				/>{' '}
				<button
					className='button'
					onClick={() => send()}
					style={{
						width: 50,
						height: 50,
						backgroundColor: '#55be96',
						fontSize: 20,
						borderRadius: 50,
						color: '#fafafa',
						border: 'none',
						textAlign: 'left'
					}}>
					<img
						src={require('../assets/sendBlack.svg')}
						style={{ width: 30, height: 50, verticalAlign: 'middle' }}
					/>
				</button>
			</div>
		</div>
	) : (
		<div
			style={{
				//textAlign: 'center',
				color: '#fafafa'
			}}>
			<h1 style={{ textAlign: 'center' }}>User profile</h1>
			<h1>
				<img
					src={props.channel.avatar}
					style={{
						borderRadius: 75,
						width: 150,
						height: 150,
						verticalAlign: 'middle'
					}}
				/>{' '}
				{props.channel.name}
			</h1>
			<hr />
			<h1>Member of channels: </h1>
			{global.channels
				.filter(channel =>
					props.channel.channels.find(({ _id }) => channel._id === _id)
				)
				.map(channel => (
					<h3>#{channel.name}</h3>
				))}
		</div>
	);
}
