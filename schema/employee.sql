
-- Use below if need to reset table 
USE employ_trackerDB;
DROP TABLE IF EXISTS employee;
-- -- -- -- -- -- -- -- -- -- -- -- 

-- Create employee table
CREATE TABLE employee(
    id INTEGER AUTO_INCREMENT,
    first_name varchar(30) NOT NULL,
    last_name varchar(30) NOT NULL,

    role_id integer NOT NULL,
    manager_id integer,

    primary key(id),
    foreign key(role_id) references roles(id),
    foreign key(manager_id) references employee(id)
);