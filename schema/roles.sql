
-- Use below if need to reset table 
use employ_trackerDB;
drop table if exists roles;
-- -- -- -- -- -- -- -- -- -- -- -- 

-- Create roles table
create table roles(
    id integer auto_increment,
    title varchar(30) not null,
    salary decimal(15) not null,
    department_id integer not null,

    primary key(id),
    foreign key(department_id) references department(id)
);