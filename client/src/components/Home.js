import React from 'react';
import { useHistory } from 'react-router-dom';

export default function Home() {
	const history = useHistory();
	return (
		<div>
			<h1>Home</h1>
			<p onClick={() => history.push('/channel')}>#general</p>
		</div>
	);
}
