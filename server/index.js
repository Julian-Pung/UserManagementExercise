const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.port || 80;
const pubDir = path.join(__dirname, 'public');

// Standard middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(pubDir));

// API
const api = express.Router();
api.use('/users', require('./api/users'));
api.use('/roles', require('./api/roles'));
api.use('/rights', require('./api/rights'));
app.use('/api', api);

// Redirect to index.html for single page application
app.get(/.*/, (req, res) => {
	res.sendFile(path.join(pubDir, 'index.html'));
});

app.listen(port, () => {
	console.log(`User management server is running on localhost:${port}`);
});
