create database myntra;

use myntra;

create table users(
user_id int primary key auto_increment,
name varchar(20) not null,
phone_no int unique,
email varchar(50) not null,
otp int null,
password varchar(50) not null,
address varchar(50) not null,
is_active boolean,
created_at datetime default current_timestamp,
updated_at datetime default null on update current_timestamp
);

create table products (
product_id int primary key auto_increment,
name varchar(20) not null,
description text not null,
type enum ('MEN','WOMEN'),
price float not null,
discount float,        
rating varchar(10) , 
total_rating int not null,
image varchar(50) not null,
is_active boolean,
is_deleted boolean,
 size_id int ,FOREIGN KEY (size_id) REFERENCES sizes(size_id),
created_at datetime default current_timestamp,
updated_at datetime default null on update current_timestamp
);


INSERT INTO products (name, description, type, price, discount, rating, total_rating, image, is_active, is_deleted,created_at,updated_at)
VALUES 
('Product 1', 'Description for Product 1.', 'MEN', 29.99, 2.50, '4.0', 50, 'product1.jpg', true, false,'2023-12-30 12:10:00',"2023-12-30 12:10:00"),
('Product 2', 'Description for Product 2.', 'WOMEN', 39.99, 5.00, '4.2', 80, 'product2.jpg', true, false,'2023-12-30 12:10:00',"2023-12-30 12:10:00"),
('Product 3', 'Description for Product 3.', 'MEN', 19.99, NULL, '3.8', 30, 'product3.jpg', true, false,'2023-12-30 12:10:00',"2023-12-30 12:10:00"),
('Product 4', 'Description for Product 4.', 'WOMEN', 49.99, 7.50, '4.5', 120, 'product4.jpg', true, false,'2023-12-30 12:10:00',"2023-12-30 12:10:00"),
('Product 5', 'Description for Product 5.', 'MEN', 59.99, 10.00, '4.7', 150, 'product5.jpg', true, false,'2023-12-30 12:10:00',"2023-12-30 12:10:00"),
('Product 6', 'Description for Product 6.', 'WOMEN', 34.99, 3.00, '4.1', 70, 'product6.jpg', true, false,'2023-12-30 12:10:00',"2023-12-30 12:10:00"),
('Product 7', 'Description for Product 7.', 'MEN', 44.99, 6.00, '4.3', 90, 'product7.jpg', true, false,'2023-12-30 12:10:00',"2023-12-30 12:10:00"),
('Product 8', 'Description for Product 8.', 'WOMEN', 24.99, 1.50, '3.5', 40, 'product8.jpg', true, false,'2023-12-30 12:10:00',"2023-12-30 12:10:00"),
('Product 9', 'Description for Product 9.', 'MEN', 69.99, 8.00, '4.8', 180, 'product9.jpg', true, false,'2023-12-30 12:10:00',"2023-12-30 12:10:00"),
('Product 10', 'Description for Product 10.', 'WOMEN', 54.99, 4.50, '4.4', 110, 'product10.jpg', true, false,'2023-12-30 12:10:00',"2023-12-30 12:10:00");


create table sizes(
size_id int primary key auto_increment,
name varchar(10) not null,
is_active boolean,
created_at datetime default current_timestamp,
updated_at datetime default null on update current_timestamp
);

INSERT INTO sizes (name, is_active,created_at,updated_at) VALUES ('XS', true,'2023-12-30 12:10:00',"2023-12-30 12:10:00");
INSERT INTO sizes (name, is_active,created_at,updated_at) VALUES ('S', true, '2023-12-30 12:10:00',"2023-12-30 12:10:00");
INSERT INTO sizes (name, is_active,created_at,updated_at) VALUES ('M', true, '2023-12-30 12:10:00',"2023-12-30 12:10:00");
INSERT INTO sizes (name, is_active,created_at,updated_at) VALUES ('L', true, '2023-12-30 12:10:00',"2023-12-30 12:10:00");
INSERT INTO sizes (name, is_active,created_at,updated_at) VALUES ('XL', true, '2023-12-30 12:10:00',"2023-12-30 12:10:00");

select * from sizes;
drop table product_sizes;

create table product_sizes(
product_size_id int primary key auto_increment,
product_id int, foreign key (product_id) references products(product_id) on delete cascade,
size_id int, foreign key (size_id) references sizes(size_id),
is_active boolean,
created_at datetime default current_timestamp,
updated_at datetime default null on update current_timestamp
);




create table wishlists(
wishlist_id int primary key auto_increment,
user_id int, foreign key (user_id) references users(user_id) on delete cascade,
product_id int, foreign key (product_id) references products(product_id)on delete cascade,
is_active boolean,
quantity int default null,
is_deleted boolean,
created_at datetime default current_timestamp,
updated_at datetime default null on update current_timestamp
);