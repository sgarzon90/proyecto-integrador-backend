const { getCollection, generateId } = require("../connectionDB.js");

// Función para calcular el total de la compra
const calculateTotal = (items) => {
    let total = 0;
    items.forEach((item) => {
        total += item.precio * item.cantidad; // Multiplica el precio por la cantidad de cada producto
    });
    return total;
};

const processShoppingCart = async (req, res) => {
    try {
        const { items, customerInfo } = req.body;

        // Obtener la colección de transacciones
        const transactionsCollection = await getCollection("transactions");

        // Calcular el total de la compra
        let total = 0;
        for (const item of items) {
            total += item.precio * item.cantidad;

            // Actualizar el stock del producto en la base de datos
            const productCollection = await getCollection("products");
            const product = await productCollection.findOne({ id: item.id });
            if (!product) {
                throw new Error(`Producto con ID ${item.id} no encontrado`);
            }
            const updatedStock = product.stock - item.cantidad;
            if (updatedStock < 0) {
                throw new Error(`No hay suficiente stock para el producto con ID ${item.id}`);
            }
            await productCollection.updateOne({ id: item.id }, { $set: { stock: updatedStock } });
        }

        // Crear el documento de la transacción
        const transaction = {
            fecha: new Date(),
            total,
            nombre: customerInfo.nombre,
            apellido: customerInfo.apellido,
            productos: items.map((item) => ({
                id: item.id,
                nombre: item.nombre,
                cantidad: item.cantidad,
                precio: item.precio,
            })),
        };

        // Insertar la transacción en la colección
        await transactionsCollection.insertOne(transaction);

        // Enviar respuesta al cliente
        res.status(200).send({ success: true, message: "Transacción procesada correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Error al procesar la transacción" });
    }
};

module.exports = { processShoppingCart };