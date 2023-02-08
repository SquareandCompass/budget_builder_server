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

        const token = jwt.sign({id: (await newUser)._id}, JWT, expires);

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

        console.log("Password: ", password);

        const user = await User.findOne({email: email});
        const passwordCheck = await bcrypt.compare(password, user.password);

        if(!user || !passwordCheck) {
            throw new Error("Email or Password do not match our records.")
        }

        const token = jwt.sign({id: (await user)._id}, JWT, expires);

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

//TODO: Consider how to update User Connection.
router.patch('/profile', validate, async (req, res) => {
    try {

        const user = req.user;
        const { 
            name, email, oldPassword, newPassword, newPasswordCheck, role 
        } = req.body;
        const returnOption = {new: true};

        console.log("Updated: ", oldPassword, newPassword)

        let updatedPassword;
        let updatedRole;

        if(newPassword === newPasswordCheck) {

            const verifyPass = bcrypt.compare(oldPassword, user.password);

            if(verifyPass) {
                updatedPassword = bcrypt.hashSync(newPassword, 13);
            }
        }

        if(role) {
            if(user.role !== "admin") throw new Error("User not authroized to alter the role");

            updatedRole = role;
        }

        const info = {
            name, email, 
            password: updatedPassword,
            role: role ? updatedRole : "user"
        }

        const updateUser = await User.findOneAndUpdate({_id: user.id}, info, returnOption);

        const displayObj = {
            id: (await updateUser)._id,
            name: (await updateUser).fullName,
            email: (await updateUser).email,
            password: (await updateUser).password,
            connections: (await updateUser).userConnections,
            no_connections: (await updateUser).userConnections.length
        }

        updateUser ?
            success(res, displayObj) :
            issue(res);
        
    } catch (err) {
        error(res, err);
    }
});

//* User Connection 

//* Connection Array Updates

//* Admin Create
router.post('/create/admin', async(req,res) => {
    try {
        
        const { 
            first, last, email, password, passwordCheck 
        } = req.body;

        if(password !== passwordCheck) throw new Error("Password doesn't match Check");

        const admin = new User({
            first, last, email, 
            password: bcrypt.hashSync(password, 13),
            role: "admin"
        });

        const newAdmin = admin.save();

        const token = jwt.sign({id: (await newAdmin)._id}, JWT, expires);

        const displayObj = {
            id: (await newAdmin)._id,
            name: (await newAdmin).fullName,
            email: (await newAdmin).email,
            role: (await newAdmin).role,
            token: token
        }

        newAdmin ?
            success(res, displayObj) :
            issue(res);

    } catch (err) {
        error(res, err);
    }
});
//* Admin Update
// router.put('/:id', async(req, res) => {

// });

//* Get All Users : Admin Route

router.delete('/:id', validate, async (req, res) => {
    try {
        
        const { id } = req.params;
        const user = await User.findById({_id: id});
        if(!user) throw new Error('No User Exists');

        const token_id = req.user.id;

        if( user.equals(token_id) || req.user.role === "admin") {
            const deleteUser = await User.findByIdAndDelete(id)
            console.log('Deleted User: ', deleteUser);

            const displayObj = {
                status: "User Deleted",
                name: (await deleteUser).fullName,
                email: (await deleteUser).email
            }

            deleteUser ?
                success(res, displayObj) :
                issue(res);
        }

    } catch (err) {
        error(res, err);
    }
});

module.exports = router;