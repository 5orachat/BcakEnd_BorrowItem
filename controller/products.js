const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

// insert one product
const createProduct = async (req, res) => {
    const { productid, productname, price,stock,type } = req.body;
    try {
        const prod = await prisma.products.create({
            data: {
                productid,
                productname,
                price,
                stock,
                type
            }
        });
        res.status(200).json({
            status: "ok",
            message: `product with ID = ${prod.productid} is created` // ส่ง ID ที่ถูกสร้างกลับไป
          });
        } catch (err) {
          // จัดการข้อผิดพลาด
          res.status(500).json({
            status: "error",
            message: "Failed to create user",
            error: err.message
          });
    }
};
// update one product
const updateProduct = async (req, res) => {
    const { productname,price, stock, type } = req.body;
    const { id } = req.params; // Get the product ID from the URL parameter

    // Build the data object for the update
    const data = {};
    if (productname) data.productname = productname;
    if (price) data.price = price;
    if (stock) data.stock = stock;
    if (type) data.type = type;

    // Check if there's any data to update
    if (Object.keys(data).length === 0) {
        return res.status(400).json({ 
            status: 'error',
            message: 'No data provided for update.'
        });
    }

    try {
        const prod = await prisma.products.update({
            data,
            where: { productid: Number(id) } // Use the ID from the URL
        });
        res.status(200).json({
            status: 'ok',
            message: `Product with ID = ${id} is updated`,
            product: prod
        });
    } catch (err) {
        // Handle known Prisma errors
        if (err.code === 'P2002') {
            // Unique constraint violation (e.g., productname already exists)
            res.status(400).json({ 
                status: 'error',
                message: 'Product productname already exists.' 
            });
        } else if (err.code === 'P2025') {
            // Record not found
            res.status(404).json({ 
                status: 'error',
                message: `Product with ID = ${id} not found.` 
            });
        } else {
            // Handle other unexpected errors
            console.error('Update product error: ', err);
            res.status(500).json({ 
                status: 'error',
                message: 'An unexpected error occurred.' 
            });
        }
    }
};

// delete customer by productid
const deleteProduct =  async (req, res) => {
    const id = req.params.id;
    try {
        // ตรวจสอบว่าลูกค้ามีอยู่หรือไม่
        const existingProduct = await prisma.products.findUnique({
          where: {
            productid: Number(id),  
          },
        });
    
        // ถ้าไม่พบ
        if (!existingProduct) {
          return res.status(404).json({ message: 'product not found' });
        }
    
        await prisma.products.delete({
          where: {
            productid: Number(id),
          },
        });
    
        // ส่งข้อความเมื่อทำการลบสำเร็จ
        res.status(200).json({
          status: "ok",
          message: `product with ID = ${id} is deleted`  // แสดง ID ที่ถูกลบ
        });
      } catch (err) {
        console.error('Delete product error: ', err);  // แสดงข้อผิดพลาดใน console
        res.status(500).json({ error: err.message });  // ส่งข้อความข้อผิดพลาดกลับไปที่ client
      }
    };
// get all Products 
const getProducts =  async (req, res) => {
    const custs = await prisma.products.findMany()
    res.json(custs)
};
// get only one product by productid
const getProduct =  async (req, res) => {
    const id = req.params.id;
    try {
        const cust = await prisma.products.findUnique({
            where: { productid: Number(id) },
        });
        if (!cust) {
            res.status(404).json({ 'message': 'product not found!' });
        } else {
            res.status(200).json(cust);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};
// search any product by productname
const getProductsByTerm = async (req, res) => {
    const  searchString  = req.params.term;
    try {
        const custs = await prisma.products.findMany({
            where: { 
                OR: [
                    {
                        productname: {
                            contains: searchString
                        }
                    }
                ]
            },
        });
        if (!custs || custs.length == 0) {
            res.status(404).json({ 'message': 'Product not found!' });
        } else {
            res.status(200).json(custs);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};
module.exports = {
    createProduct, getProduct, getProducts,
    updateProduct, deleteProduct, getProductsByTerm
};