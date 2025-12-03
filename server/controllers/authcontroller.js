const User = require('../models/user.js');
const jwt = require('jsonwebtoken');


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const register = async(req,res)=>{
    try{
    const userExists = await User.findOne({email:req.body.email});
    if(userExists){
        return res.status(400).json({message: 'User already exists'});

    }
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    const token = generateToken(user._id);
    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token
    });
}
catch(err){
    res.status(500).json({message: err.message});
}
}

const login = async(req,res)=>{
    try{
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(!user){  
            return res.status(401).json({message: 'Invalid credentials'});
        }
        
    const pass = await user.comparePassword(password);
    if(pass){
        res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id)
    });
    }
    else{
        res.status(401).json({message: 'Invalid credentials'});
    }
}
catch(err){
            res.status(500).json({message: err.message});

}

}

module.exports = {generateToken,register,login}