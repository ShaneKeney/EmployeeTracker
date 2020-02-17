
-- Use below if need to reset table 
use employ_trackerDB;
drop table if exists department;
-- -- -- -- -- -- -- -- -- -- -- -- 

-- Create department table
create table department(
    id integer auto_increment,
    name varchar(30),

    primary key(id)
);

