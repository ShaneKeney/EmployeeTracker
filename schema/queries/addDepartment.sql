
-- pre-populate table as necessary
INSERT INTO department (name) values
("Engineering"),
("Marketing"),
("Human Resources"),
("Finance"),
("Operations")
 
-- Add department query
INSERT INTO department SET ?

-- Gets the id associated with a specific department name
SELECT id FROM department WHERE name = "Legal";

-- Display table
select * from department;

