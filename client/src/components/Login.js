import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { client } from '../index';
import gql from 'graphql-tag';

export const LOGIN = gql`
	query login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
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

export default function Login() {
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');
	const history = useHistory();

	let login = () => {
		if (email === '' || undefined) {
			alert('Email field can not be empty');
			return;
		}
		if (password === '' || undefined) {
			alert('Password field can not be empty');
			return;
		}
		client
			.query({
				query: LOGIN,
				variables: { email: email, password: password }
			})
			.then(result =>
				history.push({
					pathname: '/home',
					state: { loggedUser: result.data.login }
				})
			)
			.catch(err => console.log(err));
	};

	return (
		<div
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
			<h1>Log in</h1>
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
				onKeyDown={e => {
					if (e.key === 'Enter') login();
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
				onClick={() => login()}>
				Log in
			</button>
		</div>
	);
}
