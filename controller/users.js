const { PrismaClient } = require('@prisma/client')
// const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const createUser = async (req, res) => {
    const { user_name, Password, Role } = req.body;
  
    // Hash the password
    // const hashResult = await bcrypt.hash(Password, 24);
    // 256 = salt (การสุ่มค่าเพื่อเพิ่มความซับซ้อนในการเข้ารหัส)
  
    // Store the user data
    const userData = {
      user_name: user_name,
      Role: Role,
      Password: Password
    };
  
    try {
        const user = await prisma.user.create({
            data: userData
        });
        res.status(200).json({message: 'ok'});
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "insert user data fail!",
        error,
      });
    } 
  }
  
  module.exports = { createUser }