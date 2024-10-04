-- CreateTable
CREATE TABLE `customers` (
    `customerid` INTEGER NOT NULL AUTO_INCREMENT,
    `user_name` VARCHAR(100) NULL,
    `name` VARCHAR(40) NOT NULL,
    `lastname` VARCHAR(40) NOT NULL,
    `address` VARCHAR(40) NOT NULL,
    `email` VARCHAR(40) NOT NULL,

    INDEX `fk_user_name`(`user_name`),
    PRIMARY KEY (`customerid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employees` (
    `employeeid` INTEGER NOT NULL AUTO_INCREMENT,
    `username_emp` VARCHAR(40) NOT NULL,
    `password` VARCHAR(50) NOT NULL,
    `empFirstname` VARCHAR(40) NOT NULL,
    `empLastname` VARCHAR(40) NOT NULL,
    `jop` VARCHAR(30) NOT NULL,
    `salary` INTEGER NULL,

    UNIQUE INDEX `username_emp`(`username_emp`),
    PRIMARY KEY (`employeeid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders` (
    `orderid` INTEGER NOT NULL AUTO_INCREMENT,
    `customerid` INTEGER NOT NULL,
    `productid` INTEGER NOT NULL,
    `orderdate` DATE NOT NULL,
    `quantity` INTEGER NOT NULL,
    `totalPrice` INTEGER NOT NULL,

    INDEX `customerid`(`customerid`),
    INDEX `productid`(`productid`),
    PRIMARY KEY (`orderid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payments` (
    `payment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderid` INTEGER NOT NULL,
    `payment_method` VARCHAR(50) NULL,
    `payment_date` DATETIME(0) NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `payment_status` ENUM('pending', 'completed', 'failed') NULL,

    INDEX `orderid`(`orderid`),
    PRIMARY KEY (`payment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `productid` INTEGER NOT NULL AUTO_INCREMENT,
    `productname` VARCHAR(25) NULL,
    `price` INTEGER NULL,
    `stock` INTEGER NULL,
    `type` VARCHAR(25) NULL,

    PRIMARY KEY (`productid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `user_name` VARCHAR(100) NOT NULL,
    `Password` VARCHAR(50) NOT NULL,
    `Role` VARCHAR(50) NULL,

    UNIQUE INDEX `user_name`(`user_name`),
    PRIMARY KEY (`user_name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `customers` ADD CONSTRAINT `fk_user_name` FOREIGN KEY (`user_name`) REFERENCES `user`(`user_name`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customerid`) REFERENCES `customers`(`customerid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`productid`) REFERENCES `products`(`productid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`orderid`) REFERENCES `orders`(`orderid`) ON DELETE NO ACTION ON UPDATE NO ACTION;
