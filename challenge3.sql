use bamazon;

drop table if exists departments;
create table departments (
	department_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(40) UNIQUE,
    over_head_costs DECIMAL(30,2)
);

alter table departments
add column product_sales DECIMAL(30,2) after over_head_costs;

insert into departments(department_name, over_head_costs)
values("Electronics", 6000),
		("Clothing", 2000),
        ("Video", 1000),
        ("Books", 1000);
        

update departments
set product_sales = 0;