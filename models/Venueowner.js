const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const  bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken")
const VenueOwnerSchema = new Schema({
    owner: {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phone:{ type: String, required: true },
        bankAccount: { type: Number, required: true }
        // Add other owner details as needed
    },
    venue: {
        name: { type: String, required: true },
        location: { type: String, required: true },
        maxcount:{type: Number, required: true},
        price: { type: Number, required: true },
        desc:{type:String},
        image:[] // URL or path to image
        // Add other venue details as needed
    },
    tokens: [{ // Array to store multiple tokens for multiple sessions
        token: {
            type: String,
            required: true
        }
    }]
});

// Hash the plain text password before saving
VenueOwnerSchema.pre('save', async function (next) {
    const owner = this;

    if (owner.isModified('owner.password')) {
        owner.owner.password = await bcrypt.hash(owner.owner.password, 8);
    }

    next();
});

// Generate JWT token
VenueOwnerSchema.methods.generateAuthToken = async function () {
    const owner = this;
    const token = jwt.sign({ ownerId: owner._id}, 'your_jwt_secret');
    owner.tokens = owner.tokens.concat({ token });
    await owner.save();
    return token;
};

const VenueOwner = mongoose.model('VenueOwner', VenueOwnerSchema);
module.exports = VenueOwner;
