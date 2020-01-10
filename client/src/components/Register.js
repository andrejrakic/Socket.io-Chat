import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

export default function Register() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');
	const history = useHistory();
	return (
		<div style={{ textAlign: 'center', color: '#fafafa' }}>
			<h1>Register</h1>
			<input
				type='text'
				onChange={e => setEmail(e.target.value)}
				value={email}
				placeholder='Email'
			/>
			<input
				type='password'
				onChange={e => setPassword(e.target.value)}
				value={password}
				placeholder='Password'
			/>
			<input
				type='text'
				onChange={e => setUsername(e.target.value)}
				value={username}
				placeholder='Username'
			/>
			<button onClick={() => history.push('/home')}>Register</button>
		</div>
	);
}
