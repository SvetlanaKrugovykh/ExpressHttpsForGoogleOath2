const https = require('https');
const fs = require('fs');
require('dotenv').config();
const express = require('express');

const { google } = require('googleapis');
const request = require('request');

const app = express();
const options = {
	key: fs.readFileSync('path/to/server.key'),
	cert: fs.readFileSync('path/to/server.crt')
};

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URL = process.env.GOOGLE_CALENDAR_REDIRECT_URI;
const oauth2Client = new google.auth.OAuth2(
	CLIENT_ID,
	CLIENT_SECRET,
	REDIRECT_URL
);
const scopes = ['https://www.googleapis.com/auth/calendar'];

const authorizationUrl = oauth2Client.generateAuthUrl({
	access_type: 'offline',
	scope: scopes,
	include_granted_scopes: true,
});
console.log('Authorize this app by visiting this url:', authorizationUrl);

let userCredential = null;
let token = 'start';

const port = process.env.PORT || 5000;
const router = express.Router();

router.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/index.html'));
});

router.get("/auth", async (req, res) => {
	await loadAuthorizationPage()
	const response = await ExpectingForToken();
	res.send(response);
});

router.get("/google/callback", (req, res) => {
	let q = url.parse(req.url, true).query;
	if (q.error) { // An error response e.g. error=access_denied
		console.log('Error:' + q.error);
	} else { // Get access and refresh tokens (if access_type is offline)
		let { tokens } = oauth2Client.getToken(q.code);
		oauth2Client.setCredentials(tokens);

		/** Save credential to the global variable in case access token was refreshed.
			* ACTION ITEM: In a production app, you likely want to save the refresh token
			*              in a secure persistent database instead. */
		userCredential = tokens;
	}
	console.log("token from callback", token);
});

async function loadAuthorizationPage() {
	const path = authorizationUrl.replace('https://accounts.google.com', '');
	//const path = `/o/oauth2/v2/auth?response_type=code&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${REDIRECT_URL}&scope=${scopes[0]}&access_type=offline`;;
	const options = {
		host: 'accounts.google.com',
		path: path,
		method: 'GET',
	}
	console.log('auth_path_', options.host + options.path)
	const req = https.request(options, (res) => {
		console.log(`statusCode: ${res.statusCode}`)
		res.on('data', (d) => {
			process.stdout.write(d)
		})
	})
	req.on('error', (error) => {
		console.error(error)
	})
	req.end()
}

//#region ExamplesTemprorary	
async function loadAuthorizationPageExampleHtml() {
	request(authorizationUrl, (error, response, body) => {
		if (error) {
			console.error(error);
		} else if (response.statusCode !== 200) {
			console.error(`Request failed with status code ${response.statusCode}`);
		} else {
			console.log(body);
		}
	});
}
//#endregion

async function ExpectingForToken() {
	//not done yet
	if (!token === '') {
		return 'dfgdfg';
	} else {
		return 'sdfgsdfgsdfg';
	}
}

app.use(router);

https.createServer(options, app).listen(port, () => {
	//app.listen(port, () => {
	console.log(`Server running at https://localhost:${port}`)
}).on('error', (err) => {
	console.error('Failed to start server:', err);
	process.exit(1);
});
