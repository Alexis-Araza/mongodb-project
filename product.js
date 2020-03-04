const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcryptjs = require('bcryptjs');
const config = require('./config.json');
const Product = require('./models/products.js');

const port = 3000;

//test connectivity
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log('Monogo DB connection established!');
});

app.use((req,res,next)=>{
	console.log(`${req.method} request for ${req.url}`);
	next(); // included to go to next milestone
});

//connect to db
const mongodbURI = `mongodb+srv://${config.MONGO_USER}:${config.MONGO_PASSWORD}@${config.MONGO_CLUSTER_NAME}.mongodb.net/product?retryWrites=true&w=majority`;
mongoose.connect(mongodbURI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> console.log('Database conenction established!'))
.catch(err =>{
	console.log(`Database connection error: ${err.message}`);
});




//including body-parser, cors, bcryptjs
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(cors());




// html body test
app.get('/', (req, res) => res.send('Product Page!'));




//get all products
app.get('allProducts', (req,res)=>{
	User.find().then(result =>{
		res.send(result);
	})
});




//register product
app.post('/newProduct', (req,res)=>{
	// checking if user is found in the db already
	User.findOne({username:req.body.username}, (err, userResult)=>{
		if (userResult){
			res.send('Username already in use, please select another one.');

		} else {

	const hash = bcryptjs.hashSync(req.body.password); //hash the password
	const user = new User({
	    _id : new mongoose.Types.ObjectId,
	    username : req.body.username,
	    email : req.body.email,
	    password : hash
   });

	//save to database and notify accordingly
	user.save().then(result =>{
		res.send(result);
	}).catch(err => res.send(err));		

		}

	})
});




//check product
app.post('/checkProduct', (req,res)=>{
	User.findOne({username:req.body.username}, (err, userResult)=>{
		if (userResult){
			if (bcryptjs.compareSync(req.body.password, userResult.password)){
				res.send(userResult);
			} else {
				res.send('not authorized');
			}
		} else {
			res.send('user not found. Please register or try again');
		}
	});
});




//keep this at bottom to see errors
app.listen(port, () => console.log(`Port ${port} should be functioning!`))