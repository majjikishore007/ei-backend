const jwt  = require('jsonwebtoken');
const keys = require('../config/database');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, keys.secret);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.json({ success : false, error: 'Auth failed'});
    }
};