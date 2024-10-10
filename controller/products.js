const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../asset/picture'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
    }
});

// Filter to allow only image files
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type, only JPEG, PNG, and GIF are allowed!'), false);
    }
};

const uploadimg = multer({ storage, fileFilter }).single('image'); // Ensure it's a single file upload

// Insert one product
const createProduct = async (req, res) => {
    const { productname, stock } = req.body;
    const imageFile = req.file; // Get the uploaded file

    // Basic validation
    if (!productname || !stock || !imageFile) {
        return res.status(400).json({
            status: "error",
            message: "Product name, stock, and image file are required"
        });
    }

    try {
        const prod = await prisma.products.create({
            data: {
                productname,
                stock: parseInt(stock, 10), // Ensure stock is an integer
                image: imageFile.path // Store the path of the uploaded image
            }
        });
        res.status(201).json({
            status: "ok",
            message: `Product with ID = ${prod.product_id} is created`
        });
    } catch (err) {
        console.error("Error creating product:", err);
        res.status(500).json({
            status: "error",
            message: "Failed to create product",
            error: err.message // Provide more detail about the error
        });
    }
};

// update one product
const updateProduct = async (req, res) => {
    const { productname, stock, image } = req.body; // ใช้ฟิลด์ตามโมเดล
    const { id } = req.params; // Get the product ID from the URL parameter

    // Build the data object for the update
    const data = {};
    if (productname) data.productname = productname;
    if (stock !== undefined) data.stock = parseInt(stock, 10); // Ensure stock is an integer
    if (image) data.image = image; // Assuming image is being sent as a file path or Blob

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
            where: { product_id: Number(id) } // Use the ID from the URL
        });
        res.status(200).json({
            status: 'ok',
            message: `Product with ID = ${id} is updated`,
            product: prod
        });
    } catch (err) {
        // Handle known Prisma errors
        if (err.code === 'P2002') {
            // Unique constraint violation (if applicable)
            res.status(400).json({ 
                status: 'error',
                message: 'Product name already exists.' 
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

// delete product by product_id
const deleteProduct = async (req, res) => {
    const id = req.params.id; // ดึง ID จากพารามิเตอร์ URL

    try {
        // ตรวจสอบว่าผลิตภัณฑ์มีอยู่หรือไม่
        const existingProduct = await prisma.products.findUnique({
            where: {
                product_id: Number(id),
            },
        });

        // ถ้าไม่พบผลิตภัณฑ์
        if (!existingProduct) {
            return res.status(404).json({ 
                status: 'error',
                message: 'Product not found' 
            });
        }

        // ลบผลิตภัณฑ์
        await prisma.products.delete({
            where: {
                product_id: Number(id),
            },
        });

        // ส่งข้อความเมื่อทำการลบสำเร็จ
        res.status(200).json({
            status: "ok",
            message: `Product with ID = ${id} is deleted` // แสดง ID ที่ถูกลบ
        });
    } catch (err) {
        console.error('Delete product error: ', err); // แสดงข้อผิดพลาดใน console
        res.status(500).json({ 
            status: 'error',
            message: 'An unexpected error occurred.' 
        }); // ส่งข้อความข้อผิดพลาดกลับไปที่ client
    }
};

// get all Products 
const getProducts =  async (req, res) => {
    const pros = await prisma.products.findMany()
    res.json(pros)
};

// Export the upload middleware and createProduct function
module.exports = { uploadimg, createProduct, updateProduct, deleteProduct, getProducts };
