import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Channel from './components/Channel';

export default function Routes() {
	return (
		<Router>
			<Switch>
				<Route exact path='/' component={Home} />
				<Route exact path='/channel' component={Channel} />
			</Switch>
		</Router>
	);
}
