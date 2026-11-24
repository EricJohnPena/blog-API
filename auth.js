const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Post = require('./models/Post');

dotenv.config();


module.exports.createAccessToken = (user) => {
    const data = {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin
    }

    return jwt.sign(data, process.env.JWT_SECRET_KEY, {});
}

module.exports.verify = (req, res, next) => {
    console.log(req.headers.authorization);

    let token = req.headers.authorization;

    if (typeof token === "undefined") {
        return res.send({
            auth: "Failed. No Token"
        });
    } else {
        token = token.slice(7, token.length);

        console.log(token);

        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
            if (err) {
                return res.status(403).send({
                    auth: "Failed",
                    message: err.message
                })
            } else {
                req.user = decodedToken;

                next();
            }
        })

    }
}

module.exports.verifyAdmin = (req, res, next) => {
    if (req.user.isAdmin) {
        next();
    } else {
        return res.status(401).send({
            auth: "Failed",
            message: "Action Forbidden"
        })
    }
}

module.exports.errorHandler = (err, req, res, next) => {
    console.error(err);

    const statusCode = err.status || 500;

    const errorMessage = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        error: {
            message: errorMessage,
            errorCode: err.code || 'SERVER_ERROR',
            details: err.details || null
        }
    })
}

module.exports.verifyOwnerOrAdmin = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).send({ message: 'Post not found' });
        }

        const isOwner = post.author.toString() === req.user.id;
        const isAdmin = req.user.isAdmin;

        if (isOwner || isAdmin) {
            req.post = post;
            return next();
        }

        return res.status(403).send({
            auth: 'Failed',
            message: 'Action forbidden: Only the author or an admin can perform this action'
        });
    } catch (error) {
        return module.exports.errorHandler(error, req, res);
    }
};