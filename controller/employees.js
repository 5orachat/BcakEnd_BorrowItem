const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();


// insert one employee
const createemployee = async (req, res) => {
    const { username_emp, password, empFirstname,empLastname,jop,salary } = req.body;
  
    try {
      // สร้างข้อมูลลูกค้าใหม่
      const emp = await prisma.employees.create({
        data: {
            username_emp,
            password,
            empFirstname,
            empLastname,
            jop,
            salary
        }
      });
  
      // ส่งการตอบกลับเมื่อสร้างลูกค้าสำเร็จ
      res.status(200).json({
        status: "ok",
        message: `employee with ID = ${emp.employeeid} is created` // ส่ง ID ที่ถูกสร้างกลับไป
      });
    } catch (err) {
      // จัดการข้อผิดพลาด
      res.status(500).json({
        status: "error",
        message: "Failed to create employee",
        error: err.message
      });
    }
  };

const updateemployee = async (req, res) => {
    const { empFistname, empLastname, jop, salary } = req.body;
    const { id } = req.params; // Get the employee ID from the URL parameter

    // Build the data object for the update
    const data = {};
    if (empFistname) data.empFistname = empFistname;
    if (empLastname) data.empLastname = empLastname;
    if (jop) data.jop = jop;
    if (salary) data.salary = salary;

    // Check if there's any data to update
    if (Object.keys(data).length === 0) {
        return res.status(400).json({ 
            status: 'error',
            message: 'No data provided for update.'
        });
    }

    try {
        const emp = await prisma.employees.update({
            data,
            where: { employeeid: Number(id) } // Use the ID from the URL
        });
        res.status(200).json({
            status: 'ok',
            message: `employee with ID = ${id} is updated`,
            user: emp
        });
    } catch (err) {
        // Handle known Prisma errors
         if (err.code === 'P2025') {
            // Record not found
            res.status(404).json({ 
                status: 'error',
                message: `employee with ID = ${id} not found.` 
            });
        } else {
            // Handle other unexpected errors
            console.error('Update employee error: ', err);
            res.status(500).json({ 
                status: 'error',
                message: 'An unexpected error occurred.' 
            });
        }
    }
};


const deleteemployee = async (req, res) => {
    const id = req.params.id;
  
    try {
      // ตรวจสอบว่าลูกค้ามีอยู่หรือไม่
      const existingemployee = await prisma.employees.findUnique({
        where: {
          employeeid: Number(id),  // ตรวจสอบว่า employee_id เป็นตัวเลข
        },
      });
  
      // ถ้าไม่พบลูกค้า
      if (!existingemployee) {
        return res.status(404).json({ message: 'employee not found' });
      }
  
      // ลบลูกค้า
      await prisma.employees.delete({
        where: {
          employeeid: Number(id),
        },
      });
  
      // ส่งข้อความเมื่อทำการลบสำเร็จ
      res.status(200).json({
        status: "ok",
        message: `employee with ID = ${id} is deleted`  // แสดง ID ที่ถูกลบ
      });
    } catch (err) {
      console.error('Delete employee error: ', err);  // แสดงข้อผิดพลาดใน console
      res.status(500).json({ error: err.message });  // ส่งข้อความข้อผิดพลาดกลับไปที่ client
    }
  };
  

// get all employees
const getemployees = async (req, res) => {
    const emps = await prisma.employees.findMany()
    res.json(emps)
};
// get only one employee by employee_id
const getemployee = async (req, res) => {
    const id = req.params.id;
    try {
        const emp = await prisma.employees.findUnique({
            where: { employeeid: Number(id) },
        });
        if (!emp) {
            res.status(404).json({ 'message': 'employee not found!' });
        } else {
            res.status(200).json(emp);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};
// search any employee by empFistname
const getemployeesByTerm = async (req, res) => {
    const searchString = req.params.term;
    try {
        const emps = await prisma.employees.findMany({
            where: {
                OR: [
                    {
                        empFistname: {
                            contains: searchString
                        }
                    },
                ]
            },
        });
        if (!emps || emps.length == 0) {
            res.status(404).json({ 'message': 'employee not found!' });
        } else {
            res.status(200).json(emps);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};
module.exports = {
    createemployee, getemployee, getemployees,
    updateemployee, deleteemployee, getemployeesByTerm
};


