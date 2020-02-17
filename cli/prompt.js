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
    "Remove Role"
];

function prompt() {
    return inq.prompt({
        type: "list",
        message: "What would you like to do?",
        name: "action",
        choices: actions
    },

    )
}

module.exports = prompt;