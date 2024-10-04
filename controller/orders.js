const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all orders
const getOrder = async (req, res) => {
    try {
        const orders = await prisma.orders.findMany();
        res.status(200).json(orders);
    } catch (err) {
        console.error('Failed to retrieve orders:', err.message);
        res.status(500).json({ error: 'Failed to retrieve orders' });
    }
};

// Create a new order
const createOrder = async (req, res) => {
    const { customerid, productid, orderdate, quantity, totalPrice, payment_method, payment_date, amount } = req.body;

    // Validate date format
    const parsedOrderDate = new Date(orderdate);
    const parsedPaymentDate = new Date(payment_date);

    if (isNaN(parsedOrderDate.getTime())) {
        return res.status(400).json({ error: 'Invalid order date format. Use YYYY-MM-DD.' });
    }

    if (isNaN(parsedPaymentDate.getTime())) {
        return res.status(400).json({ error: 'Invalid payment date format. Use YYYY-MM-DD.' });
    }

    try {
        const order = await prisma.orders.create({
            data: {
                customerid,
                productid,
                orderdate: parsedOrderDate, // Use parsed date
                quantity,
                totalPrice,
            },
        });

        const payment = await prisma.payments.create({
            data: {
                orderid: order.orderid, // Reference the newly created order's ID
                payment_method,
                payment_date: parsedPaymentDate, // Use parsed date
                amount,
                payment_status: 'pending',
            },
        });

        console.log('Transaction committed:', { order, payment });
        res.status(201).json({ message: 'Order created successfully.', order, payment });
    } catch (err) {
        console.error('Failed to create orders:', err.message);
        res.status(500).json({ error: 'Failed to create order' });
    }
};


module.exports = { createOrder, getOrder };
