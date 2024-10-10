const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

// Get all User
const getUser = async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
};

//create users
const createUser = async (req, res) => {
    const { first_name, last_name, email, password, user_role } = req.body;
  
    //Hash the password
    const hashResult = await bcrypt.hash(password, 5);
    //256 = salt (การสุ่มค่าเพื่อเพิ่มความซับซ้อนในการเข้ารหัส)
  
    // Store the user data
    const userData = {
        first_name,
        last_name,
        email,
        password: hashResult, // ใช้รหัสผ่านที่เข้ารหัสแล้ว
        role: user_role
    };
  
    try {
        const user = await prisma.user.create({
            data: userData
        });
        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to insert user data!",
            error: error.message,
        });
    }
};

// Delete user
const deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
      // Check if the User exists
      const existingUser = await prisma.user.findUnique({
          where: {
            user_id: Number(id),  // Ensure Use_id is a number
          },
      });

      // If User not found
      if (!existingUser) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Delete the User
      await prisma.user.delete({
          where: {
            user_id: Number(id),
          },
      });

      // Send a success message when deletion is successful
      res.status(200).json({
          status: "ok",
          message: `User with ID = ${id} is deleted`  // Display the deleted ID
      });
  } catch (err) {
      console.error('Delete User error: ', err);  // Log the error to the console
      res.status(500).json({ error: err.message });  // Send error message back to client
  }
};

// Search any User by name
const getUsersByName = async (req, res) => {
  const searchString = req.params.term;

  try {
      const users = await prisma.user.findMany({
          where: {
              OR: [
                  { first_name: { contains: searchString } },
                  { last_name: { contains: searchString } },
                  { email: { contains: searchString } },
              ],
          },
      });

      if (!users || users.length === 0) {
          return res.status(404).json({ message: 'User not found!' });
      } else {
          return res.status(200).json(users);
      }
  } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};




module.exports = { getUser, createUser , deleteUser, getUsersByName};
