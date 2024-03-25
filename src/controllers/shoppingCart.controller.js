const { getCollection } = require("../connectionDB.js");

const calculateTotal = (items) => {
    let total = 0;
    items.forEach((item) => {
        total += item.price * item.amount;
    });
    return total;
};

const processShoppingCart = async (req, res) => {
    try {
        const { items, customerInfo } = req.body;

        const transactionsCollection = await getCollection("transactions");

        const total = calculateTotal(items);

        for (const item of items) {
            const productCollection = await getCollection("products");
            const product = await productCollection.findOne({ id: item.id });
            if (!product) {
                throw new Error(`Producto con ID ${item.id} no encontrado`);
            }
            const updatedStock = product.stock - item.amount;
            if (updatedStock < 0) {
                throw new Error(`No hay suficiente stock para el producto con ID ${item.id}`);
            }
            await productCollection.updateOne({ id: item.id }, { $set: { stock: updatedStock } });
        }

        const transaction = {
            fecha: new Date(),
            total,
            nombre: customerInfo.nombre,
            apellido: customerInfo.apellido,
            productos: items.map((item) => ({
                id: item.id,
                nombre: item.name,
                cantidad: item.amount,
                precio: item.price,
            })),
        };

        await transactionsCollection.insertOne(transaction);

        res.status(200).send({ success: true, message: "Transacción procesada correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error al procesar la transacción" });
    }
};

module.exports = { processShoppingCart };