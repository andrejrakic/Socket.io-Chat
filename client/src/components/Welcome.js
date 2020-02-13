import React from 'react';
import { useHistory } from 'react-router-dom';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export default function Welcome() {
	const history = useHistory();
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
			<h1 style={{ color: '#fafafa' }}>Welcome</h1>
			<br />
			<br />
			<button
				onClick={() => history.push('/register')}
				style={{
					width: 250,
					height: 50,
					backgroundColor: '#55be96',
					fontSize: 20,
					borderRadius: 10,
					border: 'none'
				}}>
				Register
			</button>
			<br />
			<button
				style={{
					width: 250,
					height: 50,
					backgroundColor: '#55be96',
					fontSize: 20,
					borderRadius: 10,
					border: 'none'
				}}
				onClick={() => history.push('/login')}>
				Log in
			</button>
		</div>
	);
}
