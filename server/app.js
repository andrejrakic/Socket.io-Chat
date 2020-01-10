const express = require('express');
const app = express();
const port = 4000;
const io = require('socket.io').listen(4001).sockets;
const mongoose = require('mongoose');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');
app.use(cors());

app.get('/', (req, res) => res.send('Hello from Chat app'));

app.listen(port, () =>
	console.log(`🚀  Chat app is listening on port ${port}!`)
);

const User = mongoose.model('User', {
	authToken: String,
	email: String,
	username: String,
	password: String,
	avatar: String,
	active: Boolean
});

const typeDefs = gql`
	scalar Date

	type User {
		_id: ID!
		authToken: String
		email: String!
		username: String!
		password: String!
		avatar: String
		active: Boolean!
		channels: [Channel!]
	}

	type Channel {
		_id: ID!
		name: String!
		messages: [Message!]
	}

	type Message {
		_id: ID!
		from: String!
		to: Channel!
		body: String!
	}

	type Query {
		login(email: String!, password: String!): User
	}

	type Mutation {
		createUser(
			email: String!
			username: String!
			password: String!
			avatar: String!
			active: Boolean!
		): User
	}
`;

const resolvers = {
	Query: {
		login: async (parent, args) => {
			const user = await User.findOne({ email: args.email });
			if (!user) {
				throw new Error('Incorrect email or password');
			}
			// const isValidPass = await bcrypt.compare(args.password, user.password);
			// if (!isValidPass) {
			// 	throw new Error('Incorrect email or password');
			// }
			if (args.password === user.password) {
				return user;
			} else {
				throw new Error('Incorrect email or password');
			}
		}
	},
	Mutation: {
		createUser: async (_, { email, password, username, avatar }) => {
			const user = new User({ email, password, username, avatar });
			await user.save();
			return user;
		}
	}
};

const server = new ApolloServer({
	typeDefs,
	resolvers
});

mongoose
	.connect(
		`mongodb+srv://andrej:naprednebazepodataka@cluster0-bqac9.mongodb.net/chatapp`,
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	.then(() => {
		console.log(`🖐️  Mongoose connected to DB`);
		server.applyMiddleware({ app, path: '/graphql' });
	})
	.catch(err => console.log(err));

io.on('connection', function(socket) {
	//socket.emit('news', { hello: 'world' });
	socket.on('channel', message => {
		console.log(message);
		socket.emit('channel', message);
	});
});
