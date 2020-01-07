const express = require('express');
const app = express();
const port = 4000;

app.get('/', (req, res) => res.send('Hello from Chat app'));

app.listen(port, () =>
	console.log(`🚀  Chat app is listening on port ${port}!`)
);
