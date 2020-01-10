import React from 'react';
import { useHistory } from 'react-router-dom';

export default function Welcome() {
	const history = useHistory();
	return (
		<div>
			<h1>Welcome</h1>
			<button onClick={() => history.push('/register')}>Register</button>
			<button onClick={() => history.push('/login')}>Log in</button>
		</div>
	);
}
