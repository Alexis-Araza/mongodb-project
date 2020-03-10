const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcryptjs = require('bcryptjs');
const config = require('./config.json');
const Product = require('./models/products.js');
const User = require('./models/users.js')

const port = 3000;




//connect to db
const mongodbURI = `mongodb+srv://${config.MONGO_USER}:${config.MONGO_PASSWORD}@${config.MONGO_CLUSTER_NAME}.mongodb.net/product?retryWrites=true&w=majority`;
mongoose.connect(mongodbURI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> console.log('Database connection established!'))
.catch(err =>{
	console.log(`Database connection error: ${err.message}`);
});

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



//including body-parser, cors, bcryptjs
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(cors());




// html body test
app.get('/', (req, res) => res.send('Product Page!'));




//get all products
app.get('/allProducts', (req,res)=>{
	Product.find().then(result =>{
		res.send(result);
	})
});




//register product
app.post('/newProduct', (req,res)=>{
	// checking if user is found in the db already
	Product.findOne({product:req.body.product}, (err, productResult)=>{
		if (productResult){
			res.send('product already in database, please select another one.');

		} else {

	const product = new Product({
	    _id : new mongoose.Types.ObjectId,
	    product : req.body.product,
	    price : req.body.price,
	    description : req.body.description,
	    user_id : req.body.userId
   });

	//save to database and notify accordingly
	product.save().then(result =>{
		res.send(result);
	}).catch(err => res.send(err));		

		}

	})
});




//check product
app.post('/checkProduct', (req,res)=>{
	Product.findOne({product:req.body.product}, (err, productResult)=>{
		if (productResult){
			if (req.body.price, productResult.price){
				res.send(productResult);
			} else {
				res.send('invalid product');
			}
		} else {
			res.send('product not found. Please register this product or search again');
		}
	});
});





//delete product
app.delete('/deleteProduct/:id', (req,res)=>{ //don't forget : when putting id
	const idParam = req.params.id;
	Product.findOne({_id:idParam}, (err,productD)=>{
		if (productD){
			Product.deleteOne({_id:idParam}, err =>{
				res.send('Product deleted');
			});
		} else {
			res.send('Product not found');
		}
	}).catch(err => res.send(err));
});



//update details of product
app.patch('/updateProduct/:id',(req,res)=>{
  const idParam = req.params.id;
  Product.findById(idParam,(err,productD)=>{
    const updatedProduct ={
      product:req.body.product,
      price:req.body.price,
      description: req.body.description,
    };
    Product.updateOne({_id:idParam}, updatedProduct).then(result=>{
      res.send(result);
    }).catch(err => res.send(err));

  }).catch(err => res.send('not found'));
  
});



//keep this at bottom to see errors
app.listen(port, () => console.log(`Port ${port} should be functioning!`))