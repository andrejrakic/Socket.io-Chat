import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { client } from '../index';
import gql from 'graphql-tag';

export const LOGIN = gql`
	query login($email: String, $password: String) {
		getConcreteAdmin(email: $email, password: $password) {
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
		client
			.query({
				query: LOGIN,
				variables: { email: 'a@a.com', password: '-' }
			})
			.then(result => console.log(result));
	}, []);
	return (
		<div>
			<h1>Home</h1>
			<p onClick={() => history.push('/channel')}>#general</p>
		</div>
	);
}
