
-- Create database / Drop database 
DROP DATABASE IF EXISTS employ_trackerDB;
CREATE DATABASE employ_trackerDB;

-- Use below if need to reset table 
use employ_trackerDB;
-- -- -- -- -- -- -- -- -- -- -- -- 

-- Use below if need to reset table 
drop table if exists roles;
drop table if exists department;
drop table if exists employee;
-- -- -- -- -- -- -- -- -- -- -- -- 

-- Create department table
create table department(
    id integer auto_increment,
    name varchar(30),

    primary key(id)
);

-- Create roles table
create table roles(
    id integer auto_increment,
    title varchar(30) not null,
    salary decimal(15) not null,
    department_id integer not null,

    primary key(id),
    foreign key(department_id) references department(id)
);

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