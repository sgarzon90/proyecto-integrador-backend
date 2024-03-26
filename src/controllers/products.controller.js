const path = require("path");
const { getCollection, generateId } = require("../connectionDB.js");
const { HEADER_CONTENT_TYPE } = require("../constants/headers.js");
const {
    ERROR_ID_NOT_FOUND,
    ERROR_SERVER,
} = require("../constants/messages.js");
const { DIR_IMAGES_PATH } = require("../constants/paths.js");
const { deletefile } = require("../fileSystem.js");
const normalizeValue = (value) => {
    return value
        .toUpperCase()
        .trim()
        .replace("Á", "A")
        .replace("É", "E")
        .replace("Í", "I")
        .replace("Ó", "O")
        .replace("Ú", "U");
};
const createSchema = (values) => {
    const {
        id,
        name,
        description,
        stock,
        price,
        isPromotion,
        brand,
        category,
        isImported,
        isNational,
        freeShipping,
    } = values;
    return {
        id: Number(id),
        name: normalizeValue(name),
        description: description ?? null,
        stock: Number(stock),
        price: Number(price),
        isPromotion: Boolean(isPromotion),
        brand: brand ?? null,
        category: category ?? null,
        isImported: Boolean(isImported),
        isNational: Boolean(isNational),
        freeShipping: Boolean(freeShipping),
    };
};
const deleteImage = (imageFileName) => {
    if (imageFileName && imageFileName.length > 0) {
        const filePath = path.join(DIR_IMAGES_PATH, imageFileName);
        if (imageFileName != "default.jpg") {
            deletefile(filePath);
        }
    }
};

const getAll = async (req, res) => {
    res.set(HEADER_CONTENT_TYPE);
    try {
        const { search } = req.query;
        const filters = {};
        if (search) {
            if (!isNaN(search)) {
                filters["id"] = Number(search);
            } else {
                filters["name"] = { $regex: normalizeValue(search), $options: "i" };
            }
        }
        const collection = await getCollection("products");
        const products = await collection.find(filters).sort({ name: 1 }).hint("idx_id").hint("idx_name").toArray();
        res.status(200).send({ success: true, data: products });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: ERROR_SERVER });
    }
};

const getOne = async (req, res) => {
    res.set(HEADER_CONTENT_TYPE);
    try {
        const { id } = req.params;
        const collection = await getCollection("products");
        const product = await collection.findOne({ id: Number(id) });
        if (!product) return res.status(404).send({ success: false, message: ERROR_ID_NOT_FOUND });
        res.status(200).send({ success: true, data: product });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ success: false, message: ERROR_SERVER });
    }
};
const create = async (req, res) => {
    res.set(HEADER_CONTENT_TYPE);
    try {
        const collection = await getCollection("products");
        const id = await generateId(collection);
        const productData = createSchema({ ...req.body, id });
        await collection.insertOne(productData);
        res.status(201).send({ success: true, data: productData });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ success: false, message: ERROR_SERVER });
    }
};
const update = async (req, res) => {
    res.set(HEADER_CONTENT_TYPE);
    try {
        const { id } = req.params;
        const collection = await getCollection("products");
        const product = await collection.findOne({ id: Number(id) });
        if (!product) return res.status(404).send({ success: false, message: ERROR_ID_NOT_FOUND });
        // Eliminar el campo "id" de req.body antes de actualizar
        // const { id: productId, ...values } = req.body;
        const updatedValues = createSchema({ id: Number(id), ...values });
        await collection.updateOne({ id: Number(id) }, { $set: updatedValues });
        res.status(200).send({ success: true, data: updatedValues });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ success: false, message: ERROR_SERVER });
    }
};
const remove = async (req, res) => {
    res.set(HEADER_CONTENT_TYPE);
    try {
        const { id } = req.params;
        const collection = await getCollection("products");
        const product = await collection.findOne({ id: Number(id) });
        if (!product) return res.status(404).send({ success: false, message: ERROR_ID_NOT_FOUND });
        await collection.deleteOne({ id: Number(id) });
        res.status(200).send({ success: true, data: product });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ success: false, message: ERROR_SERVER });
    }
};
module.exports = { getAll, getOne, create, update, remove };