const { User } = require('../models');
const { error } = require('../helpers');
const JWT = process.env.JWT;

const validateSession = async (req, res, next) => {
    try {
        
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, JWT);
        if(!decoded) throw new Error('Not Authorized');

        const user = await User.findOne({_id: token.id});
        if(!user) throw new Error('User not in Database');

        req.user = user;

        next();
    } catch (err) {
        error(res, err);
    }
}

module.exports = validateSession;