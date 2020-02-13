import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { client } from '../index';
import gql from 'graphql-tag';
import Channel from './Channel';
import Popup from 'reactjs-popup';

export const GET_USERS = gql`
	{
		getUsers {
			_id
			name
			avatar
			channels {
				_id
			}
		}
	}
`;

export const GET_CHANNELS = gql`
	{
		getChannels {
			_id
			name
			messages {
				from
				body
			}
		}
	}
`;

export const SEARCH = gql`
	query search($searchPattern: String!) {
		search(searchPattern: $searchPattern) {
			name
			_id
			messages {
				from
				body
			}
		}
	}
`;

export const SEARCH_USERS = gql`
	query searchUsers($searchPattern: String!) {
		searchUsers(searchPattern: $searchPattern) {
			name
			_id
			avatar
			channels {
				_id
			}
		}
	}
`;

export const CREATE_CHANNEL = gql`
	mutation($name: String!) {
		createChannel(name: $name) {
			_id
			name
			messages {
				from
				body
			}
		}
	}
`;

export const ADD_USER_TO_CHANNEL = gql`
	mutation addUserToChannel($id: ID!, $channel: ID!) {
		addUserToChannel(id: $id, channel: $channel) {
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

export default function Home(props) {
	const history = useHistory();
	const [loggedUser, setLoggedUser] = useState(
		props.history.location.state.loggedUser
	);
	const [width, setWidth] = useState('30%');
	const [newChannelName, setNewChannelName] = useState('');
	//const [users, setUsers] = useState([]);
	const [channel, setChannel] = useState('');
	//const [channels, setChannels] = useState([]);
	//let loading = true;
	// let channels = ['general', 'random', 'assigments', 'food & beverage'];
	const [searchPattern, setSearchPattern] = useState('');
	const [loading, setLoading] = useState(true);
	const [next, setNext] = useState(true);

	useEffect(() => {
		console.log(props.history.location.state.loggedUser);
		//getUsers();
		//getChannels();
		getDataFromDB();
	}, []);

	let getUsers = async () => {
		await client
			.query({
				query: GET_USERS
			})
			.then(result => {
				global.users = result.data.getUsers;
			});
		// const temp = await result.data.getUsers.map(
		// 	user => user
		// 	//	setUsers([...users, user]);
		// );
		// console.log(temp);
		// setUsers(temp);
		// console.log(users);
	};

	let getChannels = async () => {
		client
			.query({
				query: GET_CHANNELS
			})
			.then(result => {
				global.channels = result.data.getChannels;
			});
	};

	let getDataFromDB = async () => {
		await getChannels();
		await getUsers();
		setTimeout(() => {
			setChannel(global.channels[1]);
			setLoading(false);
		}, 1000);
	};

	let search = async text => {
		setSearchPattern(text);
		console.log(text);
		client
			.query({
				query: SEARCH,
				variables: { searchPattern: text }
			})
			.then(res => (global.channels = res.data.search));

		client
			.query({
				query: SEARCH_USERS,
				variables: { searchPattern: text }
			})
			.then(res => (global.users = res.data.searchUsers));
	};

	let createChannel = async _name => {
		if (_name === '' || undefined) {
			alert(`Channel name can't be empty`);
			return;
		}
		await client
			.mutate({
				mutation: CREATE_CHANNEL,
				variables: {
					name: _name
				}
			})
			.then(res => {
				console.log(res);
				global.channels.push(res.data.createChannel);
				setNext(!next);
			});
		//setNext(!next);
	};

	let addUserToChannel = userID => {
		console.log(global.channels[global.channels.length - 1]);
		console.log(userID);
		client
			.mutate({
				mutation: ADD_USER_TO_CHANNEL,
				variables: {
					id: userID,
					channel: global.channels[global.channels.length - 1]._id
				}
			})
			.then(res => {
				console.log(res);
				alert('User added');
			});
	};

	return (
		<div>
			{loading ? (
				<h1>Loading...</h1>
			) : (
				<div>
					<div style={{ width: '25%', float: 'left', paddingLeft: '2%' }}>
						<h1 style={{ color: '#fafafa' }}>Home</h1>
						<input
							type='text'
							onChange={e => search(e.target.value)}
							value={searchPattern}
							placeholder='Search...'
							style={{
								transition: 'width 0.4s ease-in-out',
								width: width,
								padding: '12px 10px',
								margin: '8px 0',
								boxSizing: 'border-box',
								borderRadius: 4,
								fontSize: 20
							}}
							onFocus={() => setWidth('90%')}
							onBlur={() => setWidth('30%')}
						/>

						<h2 style={{ color: '#fafafa' }}>
							<img
								src={loggedUser.avatar}
								style={{
									borderRadius: 50,
									width: 30,
									height: 30,
									verticalAlign: 'middle'
								}}></img>{' '}
							Hello, {loggedUser.name}
						</h2>
						<Popup
							trigger={
								<button
									style={{
										backgroundColor: '#55be96',
										fontSize: 14,
										color: '#fafafa',
										border: 'none',
										borderRadius: 4,
										textAlign: 'left'
									}}>
									Create Channel
								</button>
							}
							modal
							closeOnDocumentClick>
							{close => (
								<div>
									<div>
										<h1>Create New Channel</h1>
									</div>
									<div className='content'>
										{next ? (
											<div>
												{' '}
												<h3>Start by typing channel name</h3>{' '}
												<input
													type='text'
													onChange={e => setNewChannelName(e.target.value)}
													value={newChannelName}
													placeholder='Channel Name'
													style={{
														width: '90%',
														padding: '12px 20px',
														margin: '8px 0',
														boxSizing: 'border-box',
														borderRadius: 4,
														fontSize: 20
													}}
													onKeyDown={e => {
														if (e.key === 'Enter')
															createChannel(newChannelName);
													}}
												/>
												<br />
												<button
													onClick={() => createChannel(newChannelName)}
													style={{
														backgroundColor: '#55be96',
														fontSize: 30,
														color: '#fafafa',
														border: 'none',
														borderRadius: 4
													}}>
													Next
												</button>
												<button
													onClick={() => {
														setNext(true);
														close();
													}}
													style={{
														float: 'right',
														backgroundColor: 'red',
														fontSize: 30,
														color: '#fafafa',
														border: 'none',
														borderRadius: 4
													}}>
													Cancel
												</button>
											</div>
										) : (
											<div>
												<h3>Now add people to channel</h3>{' '}
												<div style={{ overflow: 'auto' }}>
													{global.users.map(user => (
														<p key={user.name}
															style={{ cursor: 'pointer' }}
															onClick={() => addUserToChannel(user._id)}>
															<img
																src={user.avatar}
																style={{
																	borderRadius: 50,
																	width: 30,
																	height: 30,
																	verticalAlign: 'middle'
																}}
															/>{' '}
															{user.name}
														</p>
													))}
												</div>
												<button
													onClick={() => {
														setNext(!next);
														close();
													}}
													style={{
														backgroundColor: '#55be96',
														fontSize: 30,
														color: '#fafafa',
														border: 'none',
														borderRadius: 4
													}}>
													Finish
												</button>
											</div>
										)}
									</div>
								</div>
							)}
						</Popup>
						<button
							onClick={() => history.push('/')}
							style={{
								float: 'right',
								backgroundColor: '#55be96',
								fontSize: 14,
								color: '#fafafa',
								border: 'none',
								borderRadius: 4
							}}>
							Log out
						</button>
						<div
							style={{
								overflowY: 'scroll',
								backgroundColor: '#282828',
								height: 500,
								borderRadius: 10,
								paddingLeft: 1
							}}>
							{global.channels.map(ch => (
								<p key={ch.name}
									style={{ color: 'white', cursor: 'pointer' }}
									onClick={() => setChannel(ch)}>
									#{ch.name}
								</p>
							))}
							<br />
							{global.users.map(user => (
								<p key={user.name}
									style={{ color: 'white', cursor: 'pointer' }}
									onClick={() => setChannel(user)}>
									<img
										src={user.avatar}
										style={{
											borderRadius: 50,
											width: 30,
											height: 30,
											verticalAlign: 'middle'
										}}
									/>{' '}
									{user.name}
								</p>
							))}
						</div>
					</div>
					<div style={{ width: '68%', float: 'right', paddingRight: '2%' }}>
						<Channel channel={channel} loggedUser={loggedUser} />
					</div>
				</div>
			)}
		</div>
	);
}
