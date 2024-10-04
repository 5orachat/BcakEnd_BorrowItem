const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Insert one customer
const createCustomer = async (req, res) => {
    const { user_name, name, lastname, address, email } = req.body; // Include user_name

    try {
        const cust = await prisma.customers.create({
            data: {
                user_name, // Add user_name to the data object
                name,
                lastname,
                address,
                email
            }
        });

        res.status(200).json({
            status: "ok",
            message: `User with ID = ${cust.customerid} is created`
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Failed to create user",
            error: err.message
        });
    }
};

// Update one customer
const updateCustomer = async (req, res) => {
    const { name, lastname, address, email, user_name } = req.body; // Include user_name
    const { id } = req.params;

    const data = {};
    if (name) data.name = name;
    if (lastname) data.lastname = lastname;
    if (address) data.address = address;
    if (email) data.email = email;
    if (user_name) data.user_name = user_name; // Add user_name to data if provided

    if (Object.keys(data).length === 0) {
        return res.status(400).json({
            status: 'error',
            message: 'No data provided for update.'
        });
    }

    try {
        const cust = await prisma.customers.update({
            data,
            where: { customerid: Number(id) }
        });
        res.status(200).json({
            status: 'ok',
            message: `Customer with ID = ${id} is updated`,
            user: cust
        });
    } catch (err) {
        if (err.code === 'P2025') {
            res.status(404).json({
                status: 'error',
                message: `User with ID = ${id} not found.`
            });
        } else {
            console.error('Update customer error: ', err);
            res.status(500).json({
                status: 'error',
                message: 'An unexpected error occurred.'
            });
        }
    }
};

// Delete customer
const deleteCustomer = async (req, res) => {
    const id = req.params.id;

    try {
        // Check if the customer exists
        const existingCustomer = await prisma.customers.findUnique({
            where: {
                customerid: Number(id),  // Ensure customerid is a number
            },
        });

        // If customer not found
        if (!existingCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Delete the customer
        await prisma.customers.delete({
            where: {
                customerid: Number(id),
            },
        });

        // Send a success message when deletion is successful
        res.status(200).json({
            status: "ok",
            message: `User with ID = ${id} is deleted`  // Display the deleted ID
        });
    } catch (err) {
        console.error('Delete customer error: ', err);  // Log the error to the console
        res.status(500).json({ error: err.message });  // Send error message back to client
    }
};

// Get all customers
const getCustomers = async (req, res) => {
    const custs = await prisma.customers.findMany();
    res.json(custs);
};

// Get only one customer by customer_id
const getCustomer = async (req, res) => {
    const id = req.params.id;
    try {
        const cust = await prisma.customers.findUnique({
            where: { customerid: Number(id) },
        });
        if (!cust) {
            res.status(404).json({ 'message': 'Customer not found!' });
        } else {
            res.status(200).json(cust);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// Search any customer by name
const getCustomersByTerm = async (req, res) => {
    const searchString = req.params.term;
    try {
        const custs = await prisma.customers.findMany({
            where: {
                OR: [
                    { name: { contains: searchString } },
                ]
            },
        });
        if (!custs || custs.length === 0) {
            res.status(404).json({ 'message': 'Customer not found!' });
        } else {
            res.status(200).json(custs);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// Export all functions
module.exports = {
    createCustomer, 
    getCustomer, 
    getCustomers,
    updateCustomer, 
    deleteCustomer, 
    getCustomersByTerm
};
