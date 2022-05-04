const express = require('express')
const cors = require('cors')
const spotifyWebApi = require('spotify-web-api-node')
const path = require('path');


const app = express()
const PORT = process.env.PORT || 8001;

app.use(cors()); // To handle cross-origin requests
app.use(express.json()); // To parse JSON bodies

const credentials = {
  clientId: 'c579c74a5b744c5fb9ada5f6870e6877',
  clientSecret: '1caea26a5d1c4413afcaf4a064187fa1',
  redirectUri: 'http://localhost:8000/',
};

app.use(express.static(path.resolve(__dirname, '../client/public')));

app.get('/token', (req, res) => {
  let spotifyApi = new spotifyWebApi(credentials)
  spotifyApi.clientCredentialsGrant().then((data) => {
      res.json({
          accessToken : data.body.access_token,
      }) 
  })
  .catch((err) => {
      console.log(err);
      res.sendStatus(400)
  })
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});