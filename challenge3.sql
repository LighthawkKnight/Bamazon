use bamazon;

create table products (
	department_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(40),
    over_head_costs DOUBLE(30,2)
);

alter table products
add column product_sales DECIMAL(10,2) after stock_quantity