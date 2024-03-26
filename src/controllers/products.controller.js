const path = require("path");
const { getCollection, generateId } = require("../connectionDB.js");
const { HEADER_CONTENT_TYPE } = require("../constants/headers.js");
const {
    ERROR_ID_NOT_FOUND,
    ERROR_SERVER,
    ERROR_UPLOAD_NULL,
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
        imageFileName,
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
        imageFileName: Array.isArray(imageFileName) ? imageFileName[0].filename : "", // Tomar solo el nombre del archivo de la primera imagen en caso de ser un array
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
    if (imageFileName && imageFileName !== "default.jpg") {
        const filePath = path.join(DIR_IMAGES_PATH, imageFileName);
        deletefile(filePath);
    }
};

const getAll = async (req, res) => {
    res.set(HEADER_CONTENT_TYPE);
    try {
        const { search } = req.query;
        const filters = {};
        if (search) {
            filters["$or"] = [{ id: Number(search) }, { name: { $regex: normalizeValue(search), $options: "i" } }];
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
        // Verificar si se recibió la imagen
        if (!req.file) {
            return res.status(400).send({ success: false, message: ERROR_UPLOAD_NULL });
        }

        const collection = await getCollection("products");
        const id = await generateId(collection);

        // Crear el objeto de datos del producto
        const productData = createSchema({ ...req.body, id, imageFileName: req.file.filename });

        // Insertar el producto en la base de datos
        await collection.insertOne(productData);

        // Enviar respuesta exitosa
        res.status(201).send({ success: true, data: productData });
    } catch (error) {
        console.error(error.message);
        // Manejar errores y enviar respuesta de error al frontend
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

        const { id: productId, ...values } = req.body;
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
        deleteImage(product.imageFileName);
        res.status(200).send({ success: true, data: product });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ success: false, message: ERROR_SERVER });
    }
};

const uploadImage = async (req, res) => {
    res.set(HEADER_CONTENT_TYPE);

    try {
        const file = req.file;

        if (!file) return res.status(400).send({ success: false, message: ERROR_UPLOAD_NULL });

        res.status(201).send({ success: true, data: file });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ success: false, message: ERROR_SERVER });
    }
};
module.exports = { getAll, getOne, create, update, remove, uploadImage };