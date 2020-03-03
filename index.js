const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bCryptjs = require('bcryptjs');
const config = require('./config.json')

const port = 3000;

//connect to db
// mongoose.connect('mongodb+srv://alexisAdmin:qEtuouteq123.@anode-xdocc.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.connect(`mongodb+srv://${config.MONGO_USER}:${config.MONGO_PASSWORD}.@${config.MONGO_CLUSTER_NAME}.mongodb.net/test?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> console.log('DB connected!'))
.catch(err =>{
	console.log(`DB connection error: ${err.message}`);
});

//test connectivity
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log('We are connected to monogo db');
});


app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`))