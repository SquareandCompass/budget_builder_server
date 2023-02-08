const validateSession = require('./validate-session');
const adminValidate = require('./admin-validate');

module.exports = {
    validate: validateSession,
    admin: adminValidate
}