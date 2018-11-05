var mysql = require("mysql");
var inquirer = require("inquirer");

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
    connection.query("SELECT * from bamazon.products", (err, res) => {
        if (err) throw err;
        console.log("============\nProduct List\n============");
        console.log("ID | Product | Price");
        for (var i = 0; i < res.length; i++)
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + (res[i].price).toFixed(2));
        console.log("");
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
        var query = "SELECT * from bamazon.products WHERE item_id=?";
        connection.query(query, parseInt(ans.id), (err, res) => {
            if (err) throw err;
            res = res[0];
            if (!res.item_id) 
                console.log("Invalid ID");
            else if (ans.qty > res.stock_quantity)
                console.log("Insufficient quantity.\nOrder canceled.");
            else {
                var newQty = parseInt(res.stock_quantity) - parseInt(ans.qty);
                var query = "UPDATE bamazon.products SET stock_quantity=? WHERE item_id=?";
                connection.query(query, [newQty, ans.id], (err) => {
                    if (err) throw err;
                    var cost = parseInt(ans.qty) * parseInt(res.price);
                    console.log("\nOrder success!\nCost of purchase: $" + cost.toFixed(2));
                })
            }
            connection.end();
        })
    });
}