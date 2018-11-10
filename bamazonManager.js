var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "user",
  
    // Your password
    password: "password",
    database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    // display all
    console.log("\nWelcome to Bamazon.node.com's Manager System.\n")
    managerMenu();
});

function displayAll(){
    connection.query("SELECT item_id AS ID, product_name AS Product, price AS Price, stock_quantity AS Stock FROM bamazon.products", (err, res) => {
        if (err) throw err;
        console.log("\n============\nProduct List\n============\n");
        console.table(res);
        // console.log("ID | Product | Price | Stock");
        // for (var i = 0; i < res.length; i++)
        //     console.log(res[i].item_id + " | " + res[i].product_name + " | " + (res[i].price).toFixed(2) + " | " + res[i].stock_quantity);
        // console.log("");
        managerMenu();
    })
}

function viewLowInventory(){
    connection.query("SELECT item_id AS ID, product_name AS Product, stock_quantity AS Stock FROM bamazon.products WHERE stock_quantity<?", 5,  (err, res) => {
        if (err) throw err;
        if(res == "")             
            console.log("\nNo products found with less than 5 inventory\n")
        else {
            console.log("\n=============\nLow Inventory\n=============\n");
            console.table(res);
            // console.log("ID | Product | Stock");
            // for (var i = 0; i < res.length; i++)
            //     console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].stock_quantity);
        }
        managerMenu();
    })
}

function addInventory(){
    inquirer.prompt([
        {
        name: "id",
        type: "input",
        message: "Enter item ID to add: "
        },
        {
        name: "qty",
        type: "input",
        message: "Enter quantity to add: "
        }
    ])
    .then((add) => {
        if (isNaN(add.id) || isNaN(add.qty) || !add.id || !add.qty || add.qty < 0){
            console.log("\nOne or more values is not valid.\n")
            managerMenu();
        }
        var query = "SELECT * from bamazon.products WHERE item_id=?";
        connection.query(query, parseInt(add.id), (err, res) => {
            if (err) throw err;
            res = res[0];
            if (!res.item_id) {
                console.log("Invalid id.\n");
                managerMenu();
            }
            else {
                var newQty = parseInt(res.stock_quantity) + parseInt(add.qty);
                var query = "UPDATE bamazon.products SET stock_quantity=? WHERE item_id=?";
                connection.query(query, [newQty, add.id], (err) => {
                    if (err) throw err;
                    console.log("\n" + add.qty + " units of " + res.product_name + " added.\n");
                    managerMenu();
                })
            }
        })
    })
}

function addProduct(){

    var dept = [];
    connection.query("SELECT DISTINCT department_name FROM bamazon.departments", (err, res) => {
        res.forEach(item => {
            dept.push(item.department_name);
        })
        console.log("\nEnter new product info:\n")
        inquirer.prompt([
            {
            name: "name",
            type: "input",
            message: "Name: "
            },
            {
            name: "price",
            type: "input",
            message: "Price: $"
            },
            {
            name: "qty",
            type: "input",
            message: "Quantity: "
            },
            {
            name: "dept",
            type: "list",
            message: "Department:",
            choices: dept
            }
        ]).then((item) => {
            if (!item.name || item.name == "" || isNaN(item.price) || isNaN(item.qty) || item.price < 0 || item.qty <= 0) {
                console.log("\nOne or more values is not valid.\n")
                managerMenu();
            }
            else {
                var query = "INSERT INTO bamazon.products(product_name, department_name, price, stock_quantity) VALUES(?,?,?,?)";
                connection.query(query, [item.name, item.dept, item.price, item.qty], (err) => {
                    if (err) throw err;
                    console.log("\nItem successfully added.\n")
                    managerMenu();
                }) 
            }
        })
    })
}

function managerMenu(){
    inquirer.prompt(
        {
          type: "list",
          name: "item",
          message: "Choose an option:\n",
          choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
        })
    .then((menu) => {
        switch(menu.item) {
            case "View Products for Sale":
                displayAll();
                break;
            case "View Low Inventory":
                viewLowInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                addProduct();
                break;
            case "Exit":
            default:
                return connection.end();
        }
        
    })
}