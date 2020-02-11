import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { client } from '../index';
import gql from 'graphql-tag';

const REGISTER__MUTATION = gql`
	mutation createUser(
		$email: String!
		$password: String!
		$name: String!
		$avatar: String!
	) {
		createUser(
			email: $email
			password: $password
			name: $name
			avatar: $avatar
		) {
			_id
			email
			password
			name
			avatar
			channels {
				_id
			}
		}
	}
`;

export default function Register() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');
	//const [avatar, setAvatar] = useState('');
	const history = useHistory();

	let register = async () => {
		if (email === '' || undefined) {
			alert('Email field can not be empty');
			return;
		}
		if (password === '' || undefined) {
			alert('Password field can not be empty');
			return;
		}
		if (username === '' || undefined) {
			alert('Username field can not be empty');
			return;
		}
		let avatar = '';
		await fetch(`https://picsum.photos/200`).then(res => {
			console.log(res.url);
			avatar = res.url;
		});
		console.log(username, password, email, avatar);
		await client
			.mutate({
				mutation: REGISTER__MUTATION,
				variables: {
					email: email,
					password: password,
					name: username,
					avatar: avatar
				}
			})
			.then(result =>
				history.push({
					pathname: '/home',
					state: { loggedUser: result.data.createUser }
				})
			);
	};

	return (
		<div
			//style={{ textAlign: 'center', color: '#fafafa' }}
			style={{
				color: '#fafafa',
				width: window.innerWidth,
				height: window.innerHeight,
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'start',
				alignContent: 'center',
				alignItems: 'center'
			}}>
			<h1>Register</h1>
			<label>E-mail</label>
			<input
				type='text'
				onChange={e => setEmail(e.target.value)}
				value={email}
				placeholder='Email'
				style={{
					width: '30%',
					padding: '12px 20px',
					margin: '8px 0',
					boxSizing: 'border-box',
					borderRadius: 4,
					fontSize: 20
				}}
			/>
			<label>Password</label>
			<input
				type='password'
				onChange={e => setPassword(e.target.value)}
				value={password}
				placeholder='Password'
				style={{
					width: '30%',
					padding: '12px 20px',
					margin: '8px 0',
					boxSizing: 'border-box',
					borderRadius: 4,
					fontSize: 20
				}}
			/>
			<label>Username</label>
			<input
				type='text'
				onChange={e => setUsername(e.target.value)}
				value={username}
				placeholder='Username'
				style={{
					width: '30%',
					padding: '12px 20px',
					margin: '8px 0',
					boxSizing: 'border-box',
					borderRadius: 4,
					fontSize: 20
				}}
				onKeyDown={e => {
					if (e.key === 'Enter') register();
				}}
			/>
			<br />
			<button
				style={{
					width: 250,
					height: 50,
					backgroundColor: '#55be96',
					fontSize: 20,
					borderRadius: 10,
					color: '#fafafa',
					border: 'none'
				}}
				onClick={() => register()}>
				Register
			</button>
		</div>
	);
}
