const express = require("express");
var router = express.Router();
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("../models/user");
var nodemailer = require('nodemailer');
const bcrypt=require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_SECRET = '?plhjlk4sdfjfgdja4565sdbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk'

app.use("/", express.static(path.join(__dirname, "static")));
app.use(bodyParser.json());

/* GET users listing. */

router.post('/register/', async function(req,res,next)
{
	//emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	console.log("aaaaaaaaa")
	const { username, password: plainTextPassword,email ,lastname,firstname, role = "simpleuser", image} = req.body
	if (!username || typeof username !== 'string') {
		return res.json({ status: 'error', error: 'Invalid username' })
	}
	if (!email || typeof email !== 'string' ) {
		return res.json({ status: 'error', error: 'Invalid email' })
	}
	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}
	const password = await bcrypt.hash(plainTextPassword, 10)
    console.log('pass' ,password)
	try {
		const response = await User.create({
			username,
			password,email,lastname,firstname, role,image
		})
////////////////		
	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
		user: 'jassemtalbi2@gmail.com',
		pass: 'jassem1998++gmail'
		}
	});
  
  var mailOptions = {
	from: 'Edubot',
	to: email,
	subject: 'Sending Email using Node.js',
	text: 'That was easy!'
  };
  
  transporter.sendMail(mailOptions, function(error, info){
	if (error) {
	  console.log(error);
	} else {
	  console.log('Email sent: ' + info.response);
	}
  });
  //////////////////////
		console.log(email)
		//res.redirect('/addCompte/login')
		console.log('User created successfully: ', response)
	} catch (error) {
		if (error.code === 11000) {
			// duplicate key
			return res.json({ status: 'error', error: 'Username already in use' })
		}
		throw error
	}
	
	res.json({ status: 'ok' })
	
})

router.post('/login/', async (req, res) => {
	const { username, password } = req.body
	const user = await User.findOne({ username }).lean()

	if (!user) {
		return res.json({ status: 'error', error: 'Invalid username/password' })
	}

	if (await bcrypt.compare(password, user.password)) {
		// the username, password combination is successful

		const token = jwt.sign(
			{
				id: user._id,
				username: user.username
			},
			JWT_SECRET
		)

		return res.json({ status: 'ok', data: token })
	}

	res.json({ status: 'error', error: 'Invalid username/password' })
})


module.exports = router;
