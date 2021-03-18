const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
	{
		username: { type: String, required: true, unique: true },
		firstname: { type: String, required: true, },
		lastname: { type: String, required: true},
		password: { type: String, required: true },
		email: { type: String, required: true },
		role: {type: String, required: true},
		activated: {type: Number, required: true, default: 1},
		image: {type: String, required: true}

	},
	{ collection: 'users' } //specification 
)



const model = mongoose.model('UserSchema', UserSchema)

module.exports = model