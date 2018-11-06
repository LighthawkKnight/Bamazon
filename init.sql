DROP DATABASE IF EXISTS bamazon;
create database bamazon;

use bamazon;

create table products (
	item_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(40),
    department_name VARCHAR(40),
    price DOUBLE(30,2),
    stock_quantity INT(20)
);

insert into products(product_name, department_name, price, stock_quantity)
values("Laptop", "Electronics", 1000, 10),
	("Shoes", "Clothing", 70, 20),
    ("Novel", "Books", 20, 30),
    ("Balexa", "Electronics", 50, 100),
    ("4K HDR TV", "Electronics", 3000, 10),
    ("Textbook", "Books", 100, 50),
    ("Movie", "Video", 60, 80),
    ("TV Series", "Video", 30, 70),
    ("Jewelry", "Clothing", 800, 10),
    ("Jeans", "Clothing", 40, 100);