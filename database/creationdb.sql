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

    CREATE TABLE transactions (
    transaction_id VARCHAR(255) NOT NULL,
 --    user_id INT NOT NULL,
    user_name VARCHAR(255) NOT NULL,
	user_phone VARCHAR(255) NOT NULL,
	user_email VARCHAR(255) NOT NULL,
    subscription_id VARCHAR(255) NOT NULL,
    subscription_name VARCHAR(255) NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    amount DECIMAL(10, 2) NOT NULL,
    refunded_amount DECIMAL(10, 2) DEFAULT 0.00,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    payment_method VARCHAR(50),
   --  payment_gateway VARCHAR(50),
 --    gateway_reference_id VARCHAR(255),
    transaction_type VARCHAR(50) DEFAULT 'subscription',
    status VARCHAR(50) DEFAULT 'pending',
  --   description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    start_plan_date TIMESTAMP ,
    end_plan_date TIMESTAMP
    -- FOREIGN KEY (user_id) REFERENCES users(user_id),
--     FOREIGN KEY (subscription_id) REFERENCES subscriptions(subscription_id)
);
CREATE TABLE roles (
    id  INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

DROP table ROLES;
INSERT INTO roles (name, is_active) 
VALUES 
    ('admin', TRUE),
    ('client', TRUE),
    ('user', TRUE);


CREATE TABLE permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    is_active tinyint(1),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
INSERT INTO permissions (name, is_active)
VALUES 
    ('view', 1),
    ('edit', 1),
    ('delete', 1),
    ('create', 1);
SELECT * FROM dbmall.role_permission;


-- CREATE TABLE role_permissions (
--     role_id INT REFERENCES roles(id) ON DELETE CASCADE,
--     permission_id INT REFERENCES permissions(id) ON DELETE CASCADE,
--     resource_id INT REFERENCES resources(id) ON DELETE CASCADE,
--     PRIMARY KEY (role_id, permission_id, resource_id)
-- );

CREATE TABLE role_permission (
     id INT PRIMARY KEY AUTO_INCREMENT,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     role_id INT  NOT NULL,
     FOREIGN KEY (role_id) REFERENCES roles(id),
     permission_id INT NOT NULL,
     FOREIGN KEY (permission_id) REFERENCES permissions(id),
       resource_id INT REFERENCES resources(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id, resource_id)
);
drop table role_permission;
 -- role  permission -- 
 -- 1 = admin , 2 = client  3  = user 
 --  1 vieew  2 = edit 3 = delete 4 = create 


    CREATE TABLE resources (
    id int  PRIMARY KEY AUTO_INCREMENT,
    is_active tinyint(1),
    resource_name VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO role_permission (role_id, permission_id)
VALUES 
    (1, 1), -- Admin role gets "view" permission
    (1, 2), -- Admin role gets "edit" permission
    (1, 3), -- Admin role gets "delete" permission
    (1, 4), -- Admin role gets "create" permission
    (2, 4), -- Client role gets "view" permission
	(2, 2), -- Client role gets "edit" permission
    (2, 4), -- Client role gets "delete" permission
    (3, 1);-- User role gets "view" permission
   

drop table role_permission;


drop table transactions;  



CREATE TABLE cart (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);
