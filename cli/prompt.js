const inq = require('inquirer');
const cTable = require('console.table');


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
                viewAllEmployees(connection);
                return;
            case("View All Employees By Manager"):
                viewAllEmployeesByManager(connection);
                return;
            case("Add Employee"):
                addEmployee(connection);
                return;
            case("Remove Employee"):
                removeEmployee(connection);
                return;
            case("Update Employee Role"):
                updateEmployeeRole(connection);
                return;
            case("Update Employee Manager"):
                updateEmployeeManager(connection);
                return;
            case("View All Roles"): //Complete
                let roles = await viewAllRoles(connection);
                console.log('\n')
                console.table(roles);
                return;
            case("Add Role"): //Complete
                await addRole(connection);
                return;
            case("Remove Role"):
                removeRole(connection);
                return;
            case("Add Department"): //Complete
                await addDepartment(connection);
                return;
            case ("View All Departments"): //Complete
                let departments = await viewDepartments(connection);
                console.log('\n')
                console.table(departments);
                return;
            default: //Complete
                console.log("Unrecognized action ERROR");
                return;
        }
    });
}

function viewAllEmployees(connection) {

}

function viewAllEmployeesByManager(connection) {

}

async function addEmployee(connection) {
    //TODO: need to create query to get all roles
    let roles = viewAllRoles(connection);

    //TODO: need to create a query to get all the manager names
    let managers = viewAllEmployeesByManager(connection);

    inq.prompt([{
        name: "first_name",
        type: 'input',
        message: "What is the employee first name?",
        validate: function(value) { return (value) ? true : false }
    },
    {
        name: "last_name",
        type: "input",
        message: "What is the employee last name?",
        validate: function(value) { return (value) ? true : false }
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

function removeEmployee(connection) {

}

function updateEmployeeRole(connection) {

}

function updateEmployeeManager(connection) {

}

function viewAllRoles(connection) {
    return new Promise((resolve, reject) => {
        connection.query(
            "SELECT * FROM roles",
            (err, results) => {
                if(err) {
                    return reject(err)
                } else {
                    return resolve(results);
                }
            }
        );
    })
}

async function addRole(connection) {
    // Add role to the roles table
    await inq.prompt([{
        name: "title",
        message: "Specify which title to add: ",
        type: "input"
    },
    {
        name: "salary",
        message: "Specify salary (digits): ",
        type: "input"
    },
    {
        name: "department",
        message: "Choose department: ",
        type: "rawlist",
        choices: async function() {
            let results = await viewDepartments(connection);
            let departments = [];
            results.forEach((item) => departments.push(item.name));
            return departments;
        }
    }])
    .then(async function(answer) {
        let rowPacket = await getIdOfDepartmentName(connection, answer.department);
        // rowPacket is an array of results... It should only ever return one item
        
        await connection.query(
           "INSERT INTO roles SET ?",
           {
               title: answer.title,
               salary: answer.salary,
               department_id: rowPacket[0].id
           },
           function(err) {
               if(err) throw err;
           }
        )
    })
}

function getIdOfDepartmentName(connection, departmentName) {
    return new Promise((resolve, reject) => {
        connection.query(
            "SELECT id FROM department WHERE name = ?",
            [departmentName],
            (err, results) => {
                if(err) return reject(err);
                return resolve(results);
            }
        )
    })
}

// function getNameOfDepartmentId(connection, id) {
//     return new Promise((resolve, reject) => {
//         connection.query(
//             "SELECT name FROM department WHERE id = ?",
//             [id],
//             (err, results) => {
//                 if(err) return reject(err);
//                 return resolve(results);
//             }
//         )
//     })
// }

function removeRole(connection) {
    
}

async function addDepartment(connection) {
    await inq.prompt({
        name: "department",
        message: "Specify which department to add: ",
        type: "input"
    })
    .then(async function(answer) {
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

function viewDepartments(connection) {
    return new Promise((resolve, reject) => {
        connection.query(
            "SELECT * FROM department",
            (err, results) => {
                if(err) {
                    return reject(err)
                } else {
                    return resolve(results);
                }
            }
        );
    })
}

module.exports = prompt;