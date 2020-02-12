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
	name: String,
	password: String,
	avatar: String,
	channels: [{ type: mongoose.Schema.Types.ObjectId }]
});

const Channel = mongoose.model('Channel', {
	name: String,
	messages: [{ from: String, body: String }]
});

const typeDefs = gql`
	scalar Date

	type User {
		_id: ID!
		authToken: String
		email: String!
		name: String!
		password: String!
		avatar: String
		channels: [Channel]
	}

	type Channel {
		_id: ID!
		name: String!
		messages: [Messages]
	}

	type Messages {
		from: String!
		body: String!
	}

	type Query {
		login(email: String!, password: String!): User
		getUsers: [User]
		getChannel(channelID: ID!): Channel
		getChannels: [Channel]
		search(searchPattern: String!): [Channel]
		searchUsers(searchPattern: String!): [User]
	}

	type Mutation {
		createUser(
			email: String!
			name: String!
			password: String!
			avatar: String!
		): User
		createChannel(name: String!): Channel
		newMessage(from: String!, body: String!, to: ID!): Channel
		addUserToChannel(id: ID!, channel: ID!): User
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
		},
		getUsers: async (parent, args) => {
			const users = await User.find();
			return users;
		},
		getChannel: async (parent, args) => {
			const channel = await Channel.findById(
				mongoose.Types.ObjectId(args.channelID)
			);
			return channel;
		},
		getChannels: async (parent, args) => {
			const channels = await Channel.find();
			return channels;
		},
		search: async (parent, args) => {
			const channels = await Channel.find({
				name: { $regex: args.searchPattern.toLowerCase() }
			});
			return channels;
		},
		searchUsers: async (parent, args) => {
			const users = await User.find({
				name: { $regex: args.searchPattern.toLowerCase() }
			});
			return users;
		}
	},
	Mutation: {
		createUser: async (_, { email, password, name, avatar }) => {
			const user = await new User({
				email,
				password,
				name,
				avatar,
				channels: [
					mongoose.Types.ObjectId('5e3ffb0f87b506070b3945a6'),
					mongoose.Types.ObjectId('5e3ffb0987b506070b3945a5')
				]
			});
			await user.save();
			return user;
		},
		createChannel: async (_, { name }) => {
			const channel = new Channel({ name, messages: [] });
			await channel.save();
			return channel;
		},
		newMessage: async (_, { from, body, to }) => {
			const channel = await Channel.findById(mongoose.Types.ObjectId(to));
			await channel.messages.push({ from: from, body: body });
			await channel.save();
			return channel;
		},
		addUserToChannel: async (_, { id, channel }) => {
			const user = await User.findById(mongoose.Types.ObjectId(id));
			await user.channels.push(mongoose.Types.ObjectId(channel));
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

let currentRoom = '';
let backlog = [];

io.on('connection', function(socket) {
	//socket.emit('news', { hello: 'world' });
	socket.on('channel', async message => {
		//	console.log(message);
		if (currentRoom !== message.to) {
			socket.leave(currentRoom);
			socket.join(message.to);
		}
		io.in(message.to).emit('channel', message);
		backlog.push(message);
		//socket.broadcast.emit('channel', message);
		//io.emit('channel', message);

		/** BAZA SE SINHRONIZUJE SA APLIKACIJOM NA SVAKE DVE SEKUNDE */
		setInterval(() => sync(), 2000);

		// const channel = await Channel.findById(mongoose.Types.ObjectId(message.to));
		// await channel.messages.push({ from: message.from, body: message.body });
		// await channel.save();
	});
});

let sync = async () => {
	console.log(backlog);
	await backlog.map(async msg => {
		//console.log(`Upisivanje ${msg.body} u ${msg.to}`);
		const channel = await Channel.findById(mongoose.Types.ObjectId(msg.to));
		await channel.messages.push({ from: msg.from, body: msg.body });
		await channel.save();
	});
	backlog = [];
	//console.log(backlog);
};
