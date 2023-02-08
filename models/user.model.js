const mongoose = require('mongoose');
const role = require('mongoose-role');

const User = new mongoose.Schema({
    first: {
        type: String,
        required: true
    },
    last: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    userConnections: [Object],
    requestedConnections: [Object]
}, {
    virtuals: {
        fullName: {
            get() {
                return `${this.first} ${this.last}`;
            }
        }
    }
});

User.plugin(role, {
    roles: [
        'user', 'admin'
    ],
    accessLevels: {
        user: ['user'],
        admin: ['user', 'admin']
    }
})

module.exports = mongoose.model('User', User);