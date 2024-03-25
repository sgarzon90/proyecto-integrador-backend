const { getCollection, generateId } = require("../../../MI-CURSO-FULLSTACK/clase_61/banckend/src/connectionDB.js");

const processShoppingCart = async (req, res) => {
    try {
        const { items, customerInfo } = req.body;

        // Obtener la colección de transacciones
        const transactionsCollection = await getCollection("transactions");

        // Generar un nuevo ID para la transacción
        const id = await generateId(transactionsCollection);

        // Calcular el total de la compra
        const total = calculateTotal(items);

        // Crear el documento de la transacción
        const transaction = {
            id,
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