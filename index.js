const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcryptjs = require('bcryptjs');
const config = require('./config-copy.json');
const product = require('./models/groceryList.json');
const User = require('./models/users.js');

const port = 3000;

//connect to db
const mongodbURI = `mongodb+srv://${config.MONGO_USER}:${config.MONGO_PASSWORD}@${config.MONGO_CLUSTER_NAME}.mongodb.net/shop?retryWrites=true&w=majority`;
mongoose.connect(mongodbURI, {useNewUrlParser: true, useUnifiedTopology: true})
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

app.use((req,res,next)=>{
	console.log(`${req.method} request for ${req.url}`);
	next(); // included to go to next milestone
});



//including body-parser, cors, bcryptjs
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(cors());



app.get('/', (req, res) => res.send('Hello World!'));

app.get('/allProducts', (req,res)=>{
	res.json(product);
});

app.get('/product/p=:id', (req,res)=>{
	const idParam = req.params.id;
	for (let i = 0; i < product.length; i++){
		if (idParam.toString() === product[i].id.toString()) {
			res.json(product[i]);
		} 
	}
});



//register user
app.post('/registerUser', (req,res)=>{
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

	//save to database and notify user accordingly
	user.save().then(result =>{
		res.send(result);
	}).catch(err => res.send(err));		

		}

	})
});




//get all user
app.get('allUsers', (req,res)=>{
	User.find().then(result =>{
		res.send(result);
	})
});




//login the user
app.post('/loginUser', (req,res)=>{
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
app.listen(port, () => console.log(`Example app listening on port ${port}!`))