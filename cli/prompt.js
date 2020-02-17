var inq = require('inquirer');

// This will be the actions that a user can take in the CLI
const actions = [
    "View All Employees",
    "View All Employees By Manager",
    "Add Employee",
    "Remove Employee",
    "Update Employee Role",
    "Update Employee Manager",
    "View All Roles",
    "Add Role",
    "Remove Role",
    "Add Department",
    "View All Departments"
];

async function prompt(connection) {
    return inq.prompt({
        type: "list",
        message: "What would you like to do?",
        name: "action",
        choices: actions
    })
    .then(async function(answer) {
        //based on action input
        console.log(answer.action)
        switch(answer.action) {
            case("View All Employees"):
                viewAllEmployees();
                return;
            case("View All Employees By Manager"):
                viewAllEmployeesByManager();
                return;
            case("Add Employee"):
                addEmployee();
                return;
            case("Remove Employee"):
                removeEmployee();
                return;
            case("Update Employee Role"):
                updateEmployeeRole();
                return;
            case("Update Employee Manager"):
                updateEmployeeManager();
                return;
            case("View All Roles"):
                viewAllRoles();
                return;
            case("Add Role"):
                addRole();
                return;
            case("Remove Role"):
                removeRole();
                return;
            case("Add Department"):
                await addDepartment(connection);
                return;
            case ("View All Departments"):
                viewDepartments();
                return;
            default:
                console.log("Unrecognized action ERROR");
                return;
        }
    });
}

function viewAllEmployees() {

}

function viewAllEmployeesByManager() {

}

async function addEmployee() {
    //TODO: need to create query to get all roles
    let roles = viewAllRoles();

    //TODO: need to create a query to get all the manager names
    let managers = viewAllEmployeesByManager();

    inq.prompt([{
        name: "first_name",
        type: 'input',
        message: "What is the employee first name?",
        validate: function(value) { (value) ? true : false }
    },
    {
        name: "last_name",
        type: "input",
        message: "What is the employee last name?",
        validate: function(value) { (value) ? true : false }
    },
    {
        name: "role",
        type: "rawlist",
        message: "What is the employees role?",
        choices: roles
    },
    {
        name: "manager",
        type: "rawlist",
        message: "What is the employees manager?",
        choices: managers
    }
    ])
    .then(function(answer) {
        console.log(answer);

        //TODO: Create query to insert new employee
    })
}

function removeEmployee() {

}

function updateEmployeeRole() {

}

function updateEmployeeManager() {

}

function viewAllRoles() {
    //TODO: View all roles and show in table
}

function addRole() {
    // Add role to the roles table

}

function removeRole() {

}

async function addDepartment(connection) {
    await inq.prompt({
        name: "department",
        message: "Specify which department to add: ",
        type: "input"
    })
    .then(async function(answer) {
        console.log(answer.department);
        await connection.query(
            "INSERT INTO department SET ?",
            {
                name: answer.department
            },
            function(err) {
                if(err) throw err;
            }
        )
    })

}

function viewDepartments() {

}

module.exports = prompt;