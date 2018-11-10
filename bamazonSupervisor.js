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
    console.log("\nWelcome to Bamazon.node.com's Supervisor system.\n")
    supervisorMenu();
});

function supervisorMenu() {
    inquirer.prompt(
        {
          type: "list",
          name: "item",
          message: "Choose an option:\n",
          choices: ["View Products Sales by Department", "Create New Department", "Exit"]
        })
    .then((menu) => {
        switch(menu.item) {
            case "View Products Sales by Department":
                viewAll();
                break;
            case "Create New Department":
                create();
                break;
            case "Exit":
            default:
                return connection.end();
        }
        
    })
}

function viewAll() {
    var query = "SELECT department_id AS ID, department_name AS Name, over_head_costs AS 'Overhead Costs', product_sales as 'Product Sales', (product_sales - over_head_costs) AS 'Total Profit' FROM bamazon.departments";
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log("");
        console.table(res);
        supervisorMenu();
    })
}

function create() {
    console.log("\nEnter new deparment info:\n")
    inquirer.prompt([
        {
        name: "name",
        type: "input",
        message: "Name: "
        },
        {
        name: "overhead",
        type: "input",
        message: "Overhead: $"
        }
    ]).then((item) => {
        if (!item.name || item.name == "" || isNaN(item.overhead) || item.overhead < 0) {
            console.log("\nOne or more values is not valid.\n")
            supervisorMenu();
        }
        else {
            var query = "INSERT INTO bamazon.departments(department_name, over_head_costs, product_sales) VALUES(?,?,0)";
            connection.query(query, [item.name, item.overhead], (err) => {
                if (err) throw err;
                console.log("\nDeparment successfully added.\n");
                supervisorMenu();
            });
        }
        // function isUnique() {
        //     var unique = true;
        //     var dept = [];
        //     connection.query("SELECT DISTINCT department_name FROM bamazon.departments", (err, res) => {
        //         res.forEach(item => {
        //             dept.push(item.department_name);
        //         });   
        //         for (var i = 0; i < dept.length; i++) 
        //             if (item.name === dept[i]) 
        //                 unique = false; 
        //         if (!unique) { 
        //             console.log("\nDepartment with this name already exists.\n")
        //             supervisorMenu();
        //         }
        //     })
        // }
    })
}