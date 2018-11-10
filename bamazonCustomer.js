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
    console.log("\nWelcome to Bamazon.node.com!\n")
    displayAll();
});

function displayAll(){
    connection.query("SELECT item_id AS ID, product_name AS Product, price AS Price from bamazon.products", (err, res) => {
        if (err) throw err;
        console.log("\n============\nProduct List\n============\n");
        console.table(res);
        // console.log("ID | Product | Price");
        // for (var i = 0; i < res.length; i++)
        //     console.log(res[i].item_id + " | " + res[i].product_name + " | " + (res[i].price).toFixed(2));
        // console.log("");
        customerOrder();
    })
}

function customerOrder() {
    inquirer.prompt([
        {
        name: "id",
        type: "input",
        message: "Enter ID of the item you want to purchase: "
        },
        {
        name: "qty",
        type: "input",
        message: "Enter desired quantity: "
        }
    
    ])
    .then((ans) => {
        if (isNaN(ans.id) || isNaN(ans.qty) || ans.qty < 0 || !ans.id || !ans.qty) {
            console.log("\nOne or more values is not valid.\n")
            return connection.end();
        }
        else {
            var query = "SELECT * from bamazon.products WHERE item_id=?";
            connection.query(query, parseInt(ans.id), (err, res) => {
                if (err) throw err;
                res = res[0];
                if (!res.item_id) {
                    console.log("Invalid ID");
                    return connection.end();
                } 
                else if (ans.qty > res.stock_quantity) {
                    console.log("Insufficient quantity.\nOrder canceled.");
                    return connection.end();
                }
                else {
                    var newQty = parseInt(res.stock_quantity) - parseInt(ans.qty);
                    var query = "UPDATE bamazon.products SET stock_quantity=? WHERE item_id=?";
                    connection.query(query, [newQty, ans.id], (err) => {
                        if (err) throw err;
                        var cost = parseInt(ans.qty) * parseInt(res.price);
                        var query = "UPDATE bamazon.products SET product_sales=? WHERE item_id=?";
                        var newProductSales = parseInt(res.product_sales) + cost;
                        connection.query(query, [newProductSales, ans.id], (err) => { 
                            if (err) throw err;
                            var query = "SELECT product_sales FROM bamazon.departments WHERE department_name=?";
                            connection.query(query, res.department_name, (err, res2) =>{
                                if (err) throw err;
                                var newDeptSales = parseInt(res2[0].product_sales) + cost;
                                var query = "UPDATE bamazon.departments SET product_sales=? WHERE department_name=?";
                                connection.query(query, [newDeptSales, res.department_name], (err) =>{ 
                                    if (err) throw err;                                     
                                    console.log("\nOrder success!\nCost of purchase: $" + cost.toFixed(2)); 
                                    return connection.end();
                                })
                            })
                        })
                    })
                }
            })
        }
    });
}