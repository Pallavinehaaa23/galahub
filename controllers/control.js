const VenueOwner = require("../models/Venueowner");
const User=require("../models/User")
const bcrypt=require("bcrypt")
const allVenue = async (req, res) => {
  try {
    const venues = await VenueOwner.find({}); // Fetch all documents from VenueOwner collection
    const venueList = venues.map(v => ({
      _id: v._id, // Include the ID of the document
      ownerId: v.owner._id, // Assuming owner is nested under `owner` property in Venueowner model
      venue: v.venue // Include the venue data
    }));
    res.json(venueList);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

const Ownerdet = async (req, res) => {
  try {
    const owners = await VenueOwner.find({}); // Fetch all documents from VenueOwner collection
    const ownerList = owners.map(v => v.owner); // Extract owner details
    res.json(ownerList);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

const GetVen = async (req, res) => {
    const vid=req.body.vid
  try {
    const venueOwner = await VenueOwner.findOne({_id:vid});
    if (!venueOwner) {
      return res.status(404).json({ message: 'Venue not found' });
    }
    res.send(venueOwner.venue);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
const NewUser=async(req,res)=>{
  try{
    const {name,email,password}=req.body;
    const newUser = new User({
      name,
      email,
      password
    });
  await newUser.save();
  const token = await newUser.generateAuthToken();
  res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to register user' });
  }
}
const LoginUser=async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare input password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    // Generate JWT token
    const token = await user.generateAuthToken();

    // Send back user data and token
    res.json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}



// Register venue owner
const addVenue = async (req, res) => {
  const { ownerName, email, password, phone, bankAccount, venueName,location, maxCount,  price,description } = req.body;
  // let images = [];

  // Check if req.files is defined and not empty
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No images were uploaded' });
  }

  // Map uploaded files to their paths
  const image = req.files.map(file => file.path);


  try {
      // Check if owner with the same email exists
      let existingOwner = await VenueOwner.findOne({ 'owner.email': email });

      if (existingOwner) {
          return res.status(400).json({ error: 'Owner already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10); 

      // Create new venue owner
      const newOwner = new VenueOwner({
          owner: {
              name: ownerName,
              email: email,
              password: hashedPassword,
              phone: phone,
              bankAccount: bankAccount
          },
          venue: {
              name: venueName,
              location: location,
              maxcount: maxCount,
              price: price,
              desc: description,
             
              image: image
          }
      });

      // Save owner to database
      await newOwner.save();

      // Generate JWT token
      const token = await newOwner.generateAuthToken();

      res.status(201).json({ message: 'Owner registered successfully', token });
  } catch (error) {
      console.error('Error in addVenue:', error);
      res.status(500).json({ error: 'Server error' });
  }
};




module.exports = { allVenue, Ownerdet, GetVen ,NewUser,LoginUser,addVenue};
