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
            case("View All Employees"): // Most complete (TODO: possibly join tables together rather than showing ids)
                let employees = await viewAllEmployees(connection);
                console.log('\n')
                console.table(employees);
                return;
            case("View All Employees By Manager"):
                viewAllEmployeesByManager(connection);
                return;
            case("Add Employee"): // Complete
                await addEmployee(connection);
                return;
            case("Remove Employee"):
                removeEmployee(connection);
                return;
            case("Update Employee Role"):  //Complete
                await updateEmployeeRole(connection);
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
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT 
                t1.id, 
                first_name, 
                last_name, 
                title,
                name as department
            FROM
                employee t1
            INNER JOIN roles t2 ON t1.role_id = t2.id
            INNER JOIN department t3 ON t2.department_id = t3.id;`,
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

// TODO: CHECK THIS AT SOME POINT
// Gets a list of all managers
function viewAllEmployeesByManager(connection) {
    return new Promise((resolve, reject) => {
        connection.query(
            `select 
                id, first_name, last_name
            from
                employee t1
            inner join (select manager_id from employee group by manager_id having manager_id is not null) t2
                on t2.manager_id = t1.id;`,
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

async function addEmployee(connection) {
    await inq.prompt([{
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
        choices: async function() {
            let results = await viewAllRoles(connection);
            let roles = [];
            results.forEach((item) => roles.push(item.title));
            return roles;
        }
    },
    {
        name: "manager",
        type: "rawlist",
        message: "What is the employees manager?",
        choices: async function() {
            let results = await viewAllEmployees(connection);
            let employees = [];
            employees.push("None");
            results.forEach((item) => employees.push(`${item.first_name} ${item.last_name}`));
            return employees;
        }
    }
    ])
    .then(async function(answer) {
        let managerIdRowPacket = await getIdOfManager(connection, answer.manager);
        let roleIdRowPacket = await getIdOfRole(connection, answer.role);

        await connection.query(
            "INSERT INTO employee SET ?",
            {
                first_name: answer.first_name,
                last_name: answer.last_name,
                role_id: roleIdRowPacket[0].id,
                manager_id: managerIdRowPacket[0].id
            },
            function(err) {
                if(err) throw err;
            }
        );
    })
}

function getIdOfManager(connection, manager) {
    return new Promise((resolve, reject) => {
        if(manager === "None") return resolve([{ id: null }]); //resolve null for not choosing a manager
        let firstName = manager.substr(0, manager.indexOf(" "));
        let lastName = manager.substr(manager.indexOf(" ") + 1, manager.length - 1);
        console.log(`${firstName}${lastName}`);
        connection.query(
            "SELECT id FROM employee WHERE first_name = ? AND last_name = ?",
            [firstName, lastName],
            (err, results) => {
                if(err) return reject(err);
                return resolve(results);
            }
        )
    })
}

function getIdOfRole(connection, role) {
    return new Promise((resolve, reject) => {
        connection.query(
            "SELECT id FROM roles WHERE title = ?",
            [role],
            (err, results) => {
                if(err) return reject(err);
                return resolve(results);
            }
        )
    })
}

function removeEmployee(connection) {

}

// TODO: updates employee role
async function updateEmployeeRole(connection) {
    await inq.prompt([{
        name: "employeeUpdate",
        message: "Choose the employee who needs updated role: ",
        type: "list",
        choices: async function() {
            let results = await viewAllEmployees(connection);
            let employees = [];
            results.forEach((item) => employees.push(`${item.first_name} ${item.last_name}`));
            return employees;
        }
    },
    {
        name: "newRole",
        message: `Select the new role for the employee`,
        type: "list",
        choices: async function() {
            let results = await viewAllRoles(connection);
            let roles = [];
            results.forEach((item) => roles.push(item.title));
            return roles;
        }
    }
    ])
    .then(async function(answer) {
        // Get the role id for the role selected
        let newRoleId = await getIdOfRole(connection, answer.newRole);
        let employeeFullName = answer.employeeUpdate;
        let employee = employeeFullName.split(" ");

        //We know it will always have a first name and last name (separated by a space)
        let firstName = employee[0];
        let lastName = employee[1];

        connection.query(
            "UPDATE employee SET ? WHERE first_name = ? AND last_name = ?;",
            [
                { role_id: newRoleId[0].id }, //object to specify column and value to update
                firstName,
                lastName
            ],
            function(err) {
                if(err) throw err;
            }
        )
    })
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