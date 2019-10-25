# 连接查询

#1.显示所有员工的姓名，部门号和部门名称。
USE myemployees;

## 92
SELECT last_name, d.department_id, department_name
FROM employees e, departments d
WHERE e.`department_id` = d.`department_id`;

## 99
SELECT last_name, d.department_id, department_name
FROM   employees e
INNER JOIN departments d
ON e.`department_id` = d.`department_id`


#2.查询90号部门员工的job_id和90号部门的location_id
SELECT job_id,location_id
FROM   employees e,departments d
WHERE  e.`department_id`=d.`department_id`
AND    e.`department_id`=90;


#99
SELECT     job_id, location_id
FROM       employees e
INNER JOIN departments d
ON    e.`department_id` = d.`department_id`
WHERE e.`department_id` = 90

#3. 选择所有有奖金的员工的 last_name , department_name , location_id , city
SELECT last_name , department_name , l.location_id , city
FROM   employees e,departments d,locations l
WHERE  e.department_id = d.department_id
AND    d.location_id=l.location_id
AND    e.commission_pct IS NOT NULL;


#4.选择city在Toronto工作的员工的 last_name , job_id , department_id , department_name 

SELECT last_name , job_id , d.department_id, department_name 
FROM   employees e, departments d, locations l
WHERE  e.department_id = d.department_id
AND    d.location_id = l.location_id
AND    city = 'Toronto';



#5.查询每个工种、每个部门的部门名、工种名和最低工资
SELECT department_name, job_title, MIN(salary) 最低工资
FROM   employees e,  departments d, jobs j
WHERE  e.`department_id`= d.`department_id`
AND    e.`job_id`= j.`job_id`
GROUP BY department_name, job_title;



#6.查询每个国家下的部门个数大于2的国家编号
SELECT country_id, COUNT(*) 部门个数
FROM   departments d, locations l
WHERE  d.`location_id` = l.`location_id`
GROUP BY country_id
HAVING 部门个数>2;


#7、选择指定员工的姓名，员工号，以及他的管理者的姓名和员工号，结果类似于下面的格式
employees   Emp#    manager Mgr#
kochhar     101 king    100


SELECT e.last_name employees,e.employee_id "Emp#",m.last_name manager,m.employee_id "Mgr#"
FROM employees e,employees m
WHERE e.manager_id = m.employee_id
AND e.last_name='kochhar';





# 外连接查询

#一、查询编号>3的女神的男朋友信息，如果有则列出详细，如果没有，用null填充
SELECT b.id,b.name,bo.*
FROM beauty b
LEFT OUTER JOIN boys bo
ON b.`boyfriend_id` = bo.`id`
WHERE b.`id`>3;


#二、查询哪个城市没有部门
SELECT city
FROM departments d
RIGHT OUTER JOIN locations l 
ON d.`location_id`=l.`location_id`
WHERE  d.`department_id` IS NULL;

#三、查询部门名为SAL或IT的员工信息

SELECT e.*,d.department_name,d.`department_id`
FROM departments  d
LEFT JOIN employees e
ON d.`department_id` = e.`department_id`
WHERE d.`department_name` IN('SAL','IT');


SELECT * FROM departments
WHERE `department_name` IN('SAL','IT');








#1. 查询和Zlotkey相同部门的员工姓名和工资

#①查询Zlotkey的部门
SELECT department_id
FROM employees
WHERE last_name = 'Zlotkey'

#②查询部门号=①的姓名和工资
SELECT last_name,salary
FROM employees
WHERE department_id = (
    SELECT department_id
    FROM employees
    WHERE last_name = 'Zlotkey'

)

#2.查询工资比公司平均工资高的员工的员工号，姓名和工资。

#①查询平均工资
SELECT AVG(salary)
FROM employees

#②查询工资>①的员工号，姓名和工资。

SELECT last_name,employee_id,salary
FROM employees
WHERE salary>(

    SELECT AVG(salary)
    FROM employees
);



#3.查询各部门中工资比本部门平均工资高的员工的员工号, 姓名和工资
#①查询各部门的平均工资
SELECT AVG(salary),department_id
FROM employees
GROUP BY department_id

#②连接①结果集和employees表，进行筛选
SELECT employee_id,last_name,salary,e.department_id
FROM employees e
INNER JOIN (
    SELECT AVG(salary) ag,department_id
    FROM employees
    GROUP BY department_id


) ag_dep
ON e.department_id = ag_dep.department_id
WHERE salary>ag_dep.ag ;



#4. 查询和姓名中包含字母u的员工在相同部门的员工的员工号和姓名
#①查询姓名中包含字母u的员工的部门

SELECT  DISTINCT department_id
FROM employees
WHERE last_name LIKE '%u%'

#②查询部门号=①中的任意一个的员工号和姓名
SELECT last_name,employee_id
FROM employees
WHERE department_id IN(
    SELECT  DISTINCT department_id
    FROM employees
    WHERE last_name LIKE '%u%'
);


#5. 查询在部门的location_id为1700的部门工作的员工的员工号

#①查询location_id为1700的部门

SELECT DISTINCT department_id
FROM departments 
WHERE location_id  = 1700


#②查询部门号=①中的任意一个的员工号
SELECT employee_id
FROM employees
WHERE department_id =ANY(
    SELECT DISTINCT department_id
    FROM departments 
    WHERE location_id  = 1700

);
#6.查询管理者是King的员工姓名和工资

#①查询姓名为king的员工编号
SELECT employee_id
FROM employees
WHERE last_name  = 'K_ing'

#②查询哪个员工的manager_id = ①
SELECT last_name,salary
FROM employees
WHERE manager_id IN(
    SELECT employee_id
    FROM employees
    WHERE last_name  = 'K_ing'

);

#7.查询工资最高的员工的姓名，要求first_name和last_name显示为一列，列名为 姓.名


#①查询最高工资
SELECT MAX(salary)
FROM employees

#②查询工资=①的姓.名

SELECT CONCAT(first_name,last_name) "姓.名"
FROM employees
WHERE salary=(
    SELECT MAX(salary)
    FROM employees

);
