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
values("Laptop", "Electronics", 1000, 100),
	("Shoes", "Clothing", 70, 200),
    ("Novel", "Books", 20, 300),
    ("Balexa", "Electronics", 50, 1000),
    ("TV", "Electronics", 3000, 50),
    ("Textbook", "Books", 100, 150),
    ("Movie", "Video", 60, 800),
    ("TV Series", "Video", 30, 700),
    ("Jewelry", "Clothing", 800, 10),
    ("Jeans", "Clothing", 40, 100);
