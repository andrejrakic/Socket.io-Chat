import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { client } from '../index';
import gql from 'graphql-tag';
import Channel from './Channel';

export const LOGIN = gql`
	query login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			_id
			email
			password
			username
			avatar
		}
	}
`;

export default function Home() {
	const history = useHistory();
	useEffect(() => {
		// client
		// 	.query({
		// 		query: LOGIN,
		// 		variables: { email: 'a@a.com', password: '-' }
		// 	})
		// 	.then(result => console.log(result));
	}, []);

	const [channel, setChannel] = useState('general');
	let channels = ['general', 'random', 'assigments', 'food & beverage'];
	const [searchPattern, setSearchPattern] = useState('');

	return (
		<div>
			<div style={{ width: '30%', float: 'left' }}>
				<h1 style={{ color: '#fafafa' }}>Home</h1>
				<input
					type='text'
					onChange={e => setSearchPattern(e.target.value)}
					value={searchPattern}
					placeholder='Search...'
				/>
				<button onClick={() => alert(searchPattern)}>Search</button>
				{channels.map(ch => (
					<p style={{ color: 'white' }} onClick={() => setChannel(ch)}>
						#{ch}
					</p>
				))}
			</div>
			<div style={{ width: '70%', float: 'right' }}>
				<Channel channel={channel} />
			</div>
			{/* <p onClick={() => history.push('/channel')}>#general</p> */}
		</div>
	);
}
