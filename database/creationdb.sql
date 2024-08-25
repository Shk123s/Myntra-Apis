-- Create categories table
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL DEFAULT NULL,
  `type` VARCHAR(45) NULL DEFAULT NULL,
  `created_at` DATETIME NULL DEFAULT NULL,
  `updated_at` DATETIME NULL DEFAULT NULL,
  `is_active` TINYINT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
);

-- Create certificates table
CREATE TABLE IF NOT EXISTS `certificates` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `certificate_name` VARCHAR(100) NULL DEFAULT NULL,
  `certificate_email` VARCHAR(100) NULL DEFAULT NULL,
  `certificate_path` VARCHAR(100) NULL DEFAULT NULL,
  `created_at` DATETIME NULL DEFAULT NULL,
  `updated_at` DATETIME NULL DEFAULT NULL,
  `is_active` TINYINT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
);

-- Create exceluplaoddata table
CREATE TABLE IF NOT EXISTS `exceluplaoddata` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `sr` INT NOT NULL,
  `firstname` VARCHAR(45) NULL DEFAULT NULL,
  `lastname` VARCHAR(45) NULL DEFAULT NULL,
  `gender` VARCHAR(45) NULL DEFAULT NULL,
  `country` VARCHAR(45) NULL DEFAULT NULL,
  `age` INT NULL DEFAULT NULL,
  `date` DATETIME NULL DEFAULT NULL,
  `userid` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
);

-- Create subcategories table
CREATE TABLE IF NOT EXISTS `subcategories` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `subcategoryname` VARCHAR(50) NULL DEFAULT NULL,
  `CategoryID` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `CategoryID` (`CategoryID` ASC) VISIBLE,
  CONSTRAINT `subcategories_ibfk_1`
    FOREIGN KEY (`CategoryID`)
    REFERENCES `categories` (`id`)
);

-- Create sizes table
CREATE TABLE IF NOT EXISTS `sizes` (
  `size_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(10) NOT NULL,
  `is_active` TINYINT(1) NULL DEFAULT NULL,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`size_id`)
);

-- Create products table
CREATE TABLE IF NOT EXISTS `products` (
  `product_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(20) NOT NULL,
  `description` TEXT NOT NULL,
  `type` ENUM('MEN', 'WOMEN', 'KID', 'GENERAL') NULL DEFAULT NULL,
  `price` FLOAT NOT NULL,
  `discount` FLOAT NULL DEFAULT NULL,
  `rating` VARCHAR(10) NULL DEFAULT NULL,
  `total_rating` INT NOT NULL,
  `image` VARCHAR(655) NULL DEFAULT NULL,
  `is_active` TINYINT(1) NULL DEFAULT NULL,
  `is_deleted` TINYINT(1) NULL DEFAULT NULL,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL DEFAULT NULL,
  `size_id` INT NULL DEFAULT NULL,
  `SubCategoryID` INT NULL DEFAULT NULL,
  PRIMARY KEY (`product_id`),
  INDEX `size_id` (`size_id` ASC) VISIBLE,
  INDEX `fk_SubCategory` (`SubCategoryID` ASC) VISIBLE,
  CONSTRAINT `fk_SubCategory`
    FOREIGN KEY (`SubCategoryID`)
    REFERENCES `subcategories` (`id`),
  CONSTRAINT `products_ibfk_1`
    FOREIGN KEY (`size_id`)
    REFERENCES `sizes` (`size_id`)
);

-- Create product_sizes table
CREATE TABLE IF NOT EXISTS `product_sizes` (
  `product_size_id` INT NOT NULL AUTO_INCREMENT,
  `product_id` INT NULL DEFAULT NULL,
  `size_id` INT NULL DEFAULT NULL,
  `is_active` TINYINT(1) NULL DEFAULT NULL,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`product_size_id`),
  INDEX `product_id` (`product_id` ASC) VISIBLE,
  INDEX `size_id` (`size_id` ASC) VISIBLE,
  CONSTRAINT `product_sizes_ibfk_1`
    FOREIGN KEY (`product_id`)
    REFERENCES `products` (`product_id`)
    ON DELETE CASCADE,
  CONSTRAINT `product_sizes_ibfk_2`
    FOREIGN KEY (`size_id`)
    REFERENCES `sizes` (`size_id`)
);

-- Create suppliers table
CREATE TABLE IF NOT EXISTS `suppliers` (
  `SupplierID` INT NOT NULL AUTO_INCREMENT,
  `companyName` VARCHAR(100) NULL DEFAULT NULL,
  `companyAddress` VARCHAR(200) NULL DEFAULT NULL,
  `companyPhone` VARCHAR(15) NULL DEFAULT NULL,
  `companyEmail` VARCHAR(100) NULL DEFAULT NULL,
  `website` VARCHAR(100) NULL DEFAULT NULL,
  `contactPerson` VARCHAR(50) NULL DEFAULT NULL,
  `paymentTerms` VARCHAR(50) NULL DEFAULT NULL,
  PRIMARY KEY (`SupplierID`),
  UNIQUE INDEX `companyName_UNIQUE` (`companyName` ASC) VISIBLE
);

-- Create users table
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `phone_no` VARCHAR(15) NULL DEFAULT NULL,
  `email` VARCHAR(50) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  `is_active` TINYINT(1) NULL DEFAULT NULL,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL DEFAULT NULL,
  `otp` INT NULL DEFAULT NULL,
  `is_role` INT NULL DEFAULT '0',
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `phone_no` (`phone_no` ASC) VISIBLE
);

-- Create userposts table
CREATE TABLE IF NOT EXISTS `userposts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `content` TEXT NULL DEFAULT NULL,
  `post_date` DATETIME NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_approved` TINYINT(1) NULL DEFAULT '0',
  `userid` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `userid` (`userid` ASC) VISIBLE,
  CONSTRAINT `userposts_ibfk_1`
    FOREIGN KEY (`userid`)
    REFERENCES `users` (`user_id`)
);

-- Create wishlists table
CREATE TABLE IF NOT EXISTS `wishlists` (
  `wishlist_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NULL DEFAULT NULL,
  `product_id` INT NULL DEFAULT NULL,
  `is_active` TINYINT(1) NULL DEFAULT NULL,
  `is_deleted` TINYINT(1) NULL DEFAULT NULL,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL DEFAULT NULL,
  `quantity` INT NULL DEFAULT NULL,
  PRIMARY KEY (`wishlist_id`),
  INDEX `user_id` (`user_id` ASC) VISIBLE,
  INDEX `product_id` (`product_id` ASC) VISIBLE,
  CONSTRAINT `wishlists_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `users` (`user_id`)
    ON DELETE CASCADE,
  CONSTRAINT `wishlists_ibfk_2`
    FOREIGN KEY (`product_id`)
    REFERENCES `products` (`product_id`)
    ON DELETE CASCADE
);
