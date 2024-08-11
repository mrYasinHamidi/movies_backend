const jwt = require("jsonwebtoken");

function generateToken(userId, isAccessToken = true) {

    const payload = {userId: userId};

    const secret = process.env.JWT_SECRET;

    const expiresAt = isAccessToken ? process.env.JWT_EXPIRES_IN : process.env.JWT_REFRESH_EXPIRES_IN;

    return jwt.sign(
        payload, secret,
        {
            expiresIn: expiresAt
        });

}

function getUserId(token) {

    const secret = process.env.JWT_SECRET;

    const payload = jwt.decode(token);

    return payload.userId;
}

function isValid(token) {
    try {

        const secret = process.env.JWT_SECRET;

        const payload = jwt.verify(token, secret);

        return true;

    } catch (err) {

        return false;

    }
}

module.exports = {generateToken, isValid, getUserId};