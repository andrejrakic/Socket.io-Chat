import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

export default function Login() {
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');
	const history = useHistory();
	return (
		<div>
			<h1>Log in</h1>
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
			<button onClick={() => history.push('/home')}>Log in</button>
		</div>
	);
}
