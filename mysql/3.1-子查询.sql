 #进阶7：子查询

/*
含义：
出现在其他语句中的select语句，称为子查询或内查询
外部的查询语句，称为主查询或外查询

分类：
按子查询出现的位置：
	select后面：
		仅仅支持标量子查询
	
	from后面：
		支持表子查询
	where或having后面：★
		标量子查询（单行） √
		列子查询  （多行） √
		
		行子查询
		
	exists后面（相关子查询）
		表子查询
按结果集的行列数不同：
	标量子查询（一行一列）
	列子查询  （一列多行）
	行子查询  （一行多列）
	表子查询  （多行多列）
*/
#一、where或having后面
/*
1、标量子查询（单行子查询）
2、列子查询  （多行子查询）
3、行子查询  （多列多行）

特点：
①子查询放在小括号内
②子查询一般放在条件的右侧
③标量子查询，一般搭配着单行操作符使用
> < >= <= = <>

列子查询，一般搭配着多行操作符使用
in、any/some、all

in/not in (用的比较多)  等于列表中的 任意一个 
any|some  (用的比较少)  和子查询返回的 某一个值 比较  a(a=15) > any(10, 20, 30) 只要大于其中一个就返回 min
all       和子查询返的 所有 值比较                    a(a=15) > all(10, 20, 30) 要大于所有的值         max 

④子查询的执行优先于主查询执行，主查询的条件用到了子查询的结果
*/



#1.标量子查询★ (子查询结果集 一行一列)

#案例1：谁的工资比 Abel 高?

#①查询Abel的工资
SELECT salary FROM employees WHERE last_name = 'Abel' 

#②查询员工的信息，满足 salary>①结果
SELECT * FROM employees WHERE salary > 
(
	SELECT salary FROM employees WHERE last_name = 'Abel' 
)

#案例2：返回job_id与141号员工相同，salary比143号员工多的员工 姓名，job_id 和工资
SELECT job_id FROM employees WHERE employee_id = 141
SELECT salary FROM employees WHERE employee_id = 143

SELECT last_name, job_id, salary FROM employees
WHERE job_id = (SELECT job_id FROM employees WHERE employee_id = 141) 
AND   salary > (SELECT salary FROM employees WHERE employee_id = 143)

-- 根据已知数据查询
SELECT last_name, job_id, salary FROM employees WHERE job_id = 'ST_CLERK' AND salary > 2600


#案例3：返回公司工资最少的员工的 last_name,job_id和salary
SELECT MIN(salary) FROM employees

SELECT   last_name, job_id, salary FROM employees 
WHERE salary = 
( 
	SELECT MIN(salary) FROM employees
)

#案例4：查询 最低工资大于50号部门 最低工资的部门id和 其最低工资

#①查询50号部门的最低工资
SELECT MIN(salary) FROM employees WHERE department_id = 50

#②查询每个部门的最低工资
SELECT MIN(salary) FROM employees GROUP BY department_id

#③ 在②基础上筛选，满足min(salary)>①
SELECT    MIN(salary),  department_id 
FROM     employees 
GROUP BY department_id
HAVING MIN(salary) > (
	# 返回结果集里只有一行一列
	SELECT MIN(salary) FROM employees WHERE department_id = 50
)

#非法使用标量子查询
SELECT MIN(salary),department_id
FROM employees
GROUP BY department_id
HAVING MIN(salary)>(
	# 返回结果集里出现了多行，所以非法，报错	
	SELECT  salary
	FROM employees
	WHERE department_id = 50
);


#2.列子查询（结果集一列多行）★

#案例1：返回location_id是1400或1700的部门中的所有员工姓名

#①查询location_id是1400或1700的部门编号
SELECT department_id FROM departments 
WHERE location_id IN(1400, 1700)

#②查询员工姓名，要求部门号是①列表中的某一个
SELECT last_name 
FROM employees 
WHERE department_id IN (
	SELECT DISTINCT	department_id 
	FROM departments 
	WHERE location_id IN(1400, 1700)
)


#案例2：返回其它工种中比job_id为‘IT_PROG’工种任一工资低的员工的员工号、姓名、job_id 以及salary

#①查询job_id为‘IT_PROG’部门任一工资
SELECT DISTINCT salary FROM employees WHERE job_id = 'IT_PROG'

#②查询员工号、姓名、job_id 以及salary，salary<(①)的任意一个
SELECT employee_id, last_name, job_id, salary FROM employees
WHERE salary < ANY(
	SELECT DISTINCT salary FROM employees WHERE job_id = 'IT_PROG'		
)AND job_id <> 'IT_PROG';


#或
SELECT last_name,employee_id,job_id,salary
FROM employees
WHERE salary<(
	SELECT MAX(salary)
	FROM employees
	WHERE job_id = 'IT_PROG'

) AND job_id<>'IT_PROG';

#3、行子查询（结果集一行多列或多行多列）

#案例：查询员工编号最小并且工资最高的员工信息
SELECT * FROM employees WHERE  (employee_id, salary) = (
	SELECT MIN(employee_id),MAX(salary)FROM employees
)


#或者 
SELECT * FROM employees
WHERE employee_id=(
	SELECT MIN(employee_id) FROM employees
)AND salary=(
	SELECT MAX(salary) FROM employees
);


#二、select后面
/*
	仅仅支持标量子查询
*/

#案例：查询每个部门的员工个数

SELECT d.*, (
	SELECT COUNT(*) FROM employees e WHERE e.department_id = d.department_id
) 个数 FROM departments d

#案例2：查询员工号=102的部门名
SELECT  (
	SELECT department_name
	FROM departments d
	INNER JOIN employees e
	ON d.department_id=e.department_id
	WHERE e.employee_id=102
) 部门名;
 
 
 
#三、from后面
/*
	将子查询结果充当一张表，要求必须起别名
*/

#案例：查询每个部门的平均工资的工资等级
#①查询每个部门的平均工资
SELECT AVG(salary) FROM employees GROUP BY department_id
                   

SELECT * FROM job_grades;
#②连接 ①的结果集和job_grades表，筛选条件平均工资 between lowest_sal and highest_sal

SELECT  ag_dep.*,g.`grade_level`
FROM (
	SELECT AVG(salary) ag,department_id
	FROM employees
	GROUP BY department_id
) ag_dep
INNER JOIN job_grades g
ON ag_dep.ag BETWEEN lowest_sal AND highest_sal;



#四、exists后面（相关子查询）

/*
语法：
exists(完整的查询语句)
结果：
1或0
*/

SELECT EXISTS(SELECT employee_id FROM employees WHERE salary=300000);

#案例1：查询有员工的部门名

#in
SELECT department_name
FROM departments d
WHERE d.`department_id` IN(
	SELECT department_id
	FROM employees

)

#exists

SELECT department_name
FROM departments d
WHERE EXISTS(
	SELECT *
	FROM employees e
	WHERE d.`department_id`=e.`department_id`


);


#案例2：查询没有女朋友的男神信息

#in

SELECT bo.*
FROM boys bo
WHERE bo.id NOT IN(
	SELECT boyfriend_id
	FROM beauty
)

#exists
SELECT bo.*
FROM boys bo
WHERE NOT EXISTS(
	SELECT boyfriend_id
	FROM beauty b
	WHERE bo.`id`=b.`boyfriend_id`

);

