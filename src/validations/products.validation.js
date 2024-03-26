const Joi = require("joi");
const validate = (schema, params, res, next) => {
    const { error } = schema.validate(params);
    if (error) {
        console.log({ error: error.details[0].message });
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
const validateParamId = (req, res, next) => {
    const schema = Joi.object({
        id: Joi.number().integer().positive().required().messages({
            "number.base": "El ID debe ser un número",
            "number.integer": "El ID debe ser un número entero",
            "number.positive": "El ID debe ser un número positivo",
            "any.required": "El ID es requerido",
        }),
    });
    validate(schema, req.params, res, next);
};
const validateBody = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(25).required(),
        description: Joi.string().min(15).max(150).allow("").allow(null).required(),
        stock: Joi.number().integer().min(0).required(),
        price: Joi.number().min(0).required(),
        isPromotion: Joi.boolean(),
        brand: Joi.string().allow("").allow(null),
        category: Joi.string().valid("Gorra", "Bolso", "Productos de Limpieza"),
        isImported: Joi.boolean(),
        isNational: Joi.boolean(),
        freeShipping: Joi.boolean(),
        imageFileName: Joi.string().min(15).max(300).required(),
    });
    validate(schema, req.body, res, next);
};
module.exports = {
    validateParamId,
    validateBody,
};