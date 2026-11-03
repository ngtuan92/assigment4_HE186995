const jwt = require('jsonwebtoken');
const members = require('../member.json');

const createToken = (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required',
                missing: [!email && 'email', !password && 'password'].filter(Boolean)
            });
        }

        const member = members.find(
            user => user.email === email && user.password === password
        );

        if (!member) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        const payload = {
            email: member.email
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            }
        );

        return res.status(200).json({
            message: 'Login successful',
            token: token
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createToken
};
