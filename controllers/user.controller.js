const router = require('express').Router();
const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT = process.env.JWT;
const expires = {expiresIn: "1h"}
const { validate, admin } = require('../middleware');
const { error, success, issue } = require('../helpers');

router.post('/signup', async (req, res) => {
    try {
        
        const { first, last, email, password, passwordCheck } = req.body;

        if(password !== passwordCheck) throw new Error('Password Validation does not match');

        const user = new User({
            first, last, email,
            password: bcrypt.hashSync(password, 13),
            role: "user"
        });

        const newUser = user.save();

        const token = jwt.sign({id: newUser._id}, JWT, expires);

        const displayObj = {
            id: (await newUser)._id,
            name: (await newUser).fullName,
            email: (await newUser).email,
            token: token
        }

        newUser ?
            success(res, displayObj) :
            issue(res);
        
    } catch (err) {
        error(res, err);
    }
});

router.post('/login', async (req, res) => {
    try {
        
        const { email, password } = req.body;

        const user = await User.findOne({email: email});
        const passwordCheck = bcrypt.compare(password, user.password);

        if(!user || !passwordCheck) {
            throw new Error("Email or Password do not match our records.")
        }

        const token = jwt.sign({id: user._id}, JWT, expires);

        const displayObj = {
            id: (await user)._id,
            name: (await user).fullName,
            token: token
        }

        user ?
            success(res, displayObj) :
            issue(res);

    } catch (err) {
        error(res, err);
    }
});

router.patch('/profile', validate, async (req, res) => {
    try {

        /* 
            Need to consider what is getting updated.
                - name, email, password, userConnections, role
        */

        const userId = req.user.id;
        const info = req.body;
        const returnOption = {new: true};

        const user = await User.findOneAndUpdate({_id: userId}, info, returnOption);

        const displayObj = {
            id: (await user)._id,
            name: (await user).fullName,
            email: (await user).email,
            connections: (await user).userConnections,
            no_connections: (await user).userConnections.length
        }

        user ?
            success(res, displayObj) :
            issue(res);
        
    } catch (err) {
        error(res, err);
    }
});

//* Admin Create
// router.post('/create/admin', async(req,res) => {

// });
//* Admin Update
// router.put('/:id', async(req, res) => {

// });

// router.delete('/:id', async (req, res) => {
//     try {
        
//     } catch (err) {
//         error(res, err);
//     }
// });

module.exports = router;