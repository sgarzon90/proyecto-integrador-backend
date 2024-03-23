const Joi = require("joi");

const validateEmail = (req, res, next) => {
    const schema = Joi.object({
        fullname: Joi.string().min(3).max(50).required(),
        telephone: Joi.string().min(6).max(13).required(),
        email: Joi.string().email().required(),
        consult: Joi.string().min(15).max(150).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    next();
};

module.exports = {
    validateEmail,
};