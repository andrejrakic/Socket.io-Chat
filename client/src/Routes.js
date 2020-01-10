import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/Home';
import Channel from './components/Channel';
import Welcome from './components/Welcome';
import Register from './components/Register';
import Login from './components/Login';

export default function Routes() {
	return (
		<Router>
			<Switch>
				<Route exact path='/' component={Welcome} />
				<Route exact path='/home' component={Home} />
				<Route exact path='/channel' component={Channel} />
				<Route exact path='/register' component={Register} />
				<Route exact path='/login' component={Login} />
			</Switch>
		</Router>
	);
}
