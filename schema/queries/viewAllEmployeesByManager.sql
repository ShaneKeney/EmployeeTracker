
-- Shows all managers by id, first name, last name
select 
	id, first_name, last_name
from 
	employee t1
inner join (select manager_id from employee group by manager_id having manager_id is not null) t2
	on t2.manager_id = t1.id;
