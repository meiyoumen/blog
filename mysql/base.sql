#1.查询表中的单个字段

SELECT last_name FROM employees;

#2.查询表中的多个字段
SELECT last_name,salary,email FROM employees;

#查询常量值
SELECT 100;
SELECT 'join';

#查询表达式
SELECT 100*98;

#查询函数
SELECT VERSION();

#起别名
## 方式二
SELECT 100*98 AS '结果'
SELECT last_name AS 姓, first_name AS 名 FROM employees

## 方式一
SELECT last_name 姓, first_name 名 FROM employees

##案例：查询salary，显示结果为 out put
SELECT salary AS 'out put' FROM employees;


# 去重
#案例：查询员工表中涉及到的所有的部门编号
SELECT DISTINCT department_id FROM employees

#+号的作用

/*

java中的+号：
①运算符，两个操作数都为数值型
②连接符，只要有一个操作数为字符串

mysql中的+号：
仅仅只有一个功能：运算符

select 100+90; 两个操作数都为数值型，则做加法运算
select '123'+90;只要其中一方为字符型，试图将字符型数值转换成数值型
			如果转换成功，则继续做加法运算
select 'john'+90;	如果转换失败，则将字符型数值转换成0

select null+10; 只要其中一方为null，则结果肯定为null

*/

#案例：查询员工名和姓连接成一个字段，并显示为 姓名

# 在mysql拼接不用+号，而是用concat
SELECT CONCAT('a', 'b', 'c') AS 结果;

SELECT CONCAT(first_name,' ', last_name) AS 姓名 FROM employees;


DESC departments;
DESC employees;

#6.显示出表employees的全部列，各个列之间用逗号连接，列头显示成OUT_PUT

SELECT 
	IFNULL(commission_pct,0) AS 奖金率,
	commission_pct
FROM 
	employees;

SELECT
	CONCAT(`first_name`,',',`last_name`,',',`job_id`,',',IFNULL(commission_pct,0)) AS out_put
FROM
	employees;
	
	

# 条件查询

#进阶2：条件查询
/*

语法：
	select 
		查询列表
	from
		表名
	where
		筛选条件;

分类：
	一、按条件表达式筛选
	
	简单条件运算符：> < = != <> >= <=
	
	二、按逻辑表达式筛选
	逻辑运算符：
	作用：用于连接条件表达式
		&& || !
		and or not
		
	&&和and：两个条件都为true，结果为true，反之为false
	||或or： 只要有一个条件为true，结果为true，反之为false
	!或not： 如果连接的条件本身为false，结果为true，反之为false
	
	三、模糊查询
		like
		between and
		in
		is null
	
*/

SELECT * FROM employees WHERE salary >12000;
SELECT last_name, department_id FROM employees WHERE department_id <> 90


## %通配符 任意多个字符

/*
特点：
①一般和通配符搭配使用
	通配符：
	% 任意多个字符,包含0个字符
	_ 任意单个字符

*/
SELECT * FROM employees WHERE last_name LIKE '%a%'

#案例1：查询员工编号在100到120之间的员工信息

SELECT
	*
FROM
	employees
WHERE
	employee_id >= 120 AND employee_id<=100;
#----------------------
SELECT
	*
FROM
	employees
WHERE
	employee_id BETWEEN 120 AND 100;

#3.in
/*
含义：判断某字段的值是否属于in列表中的某一项
特点：
	①使用in提高语句简洁度
	②in列表的值类型必须一致或兼容
	③in列表中不支持通配符
	

*/
#案例：查询员工的工种编号是 IT_PROG、AD_VP、AD_PRES中的一个员工名和工种编号

SELECT last_name, job_id FROM employees WHERE job_id='IT_PROG' OR job_id='AD_VP' OR job_id='AD_PRES';

SELECT last_name, job_id FROM employees WHERE job_id IN('IT_PROG', 'AD_VP', 'AD_PRES')

#4、is null
/*
=或<>不能用于判断null值
is null或is not null 可以判断null值

*/

#案例1：查询没有奖金的员工名和奖金率

SELECT last_name, commission_pct FROM employees WHERE commission_pct IS NULL;
SELECT last_name, commission_pct FROM employees WHERE commission_pct IS NOT NULL;

#查询员工为176的员工的姓名 部门 年薪

/*
IFNULL(commission_pct,0) 奖金为null的情况
*/
SELECT last_name, department_id, salary*12*(1+IFNULL(commission_pct,0)) AS 年薪 FROM employees;


#查询没有奖金，且工资小于18000的salary,last_name

SELECT last_name, salary FROM employees WHERE commission_pct IS NULL AND salary < 18000;

#查询job_id不为'IT' 或者工资为12000的员信息

SELECT * FROM employees WHERE job_id <> 'IT' OR salary=12000;

#经典面试题
SELECT * FROM employees;   -- 和
SELECT * FROM employees WHERE commission_pct LIKE '%%' OR last_name LIKE '%%'  -- 一样
SELECT * FROM employees WHERE commission_pct LIKE '%%' AND last_name LIKE '%%' -- 不一样

-- 结果是否一样？ 答 and 不一样 如果判断的字段有null值不一样


#进阶3：排序查询
/*
语法：
select 查询列表
from 表名
【where  筛选条件】
order by 排序的字段或表达式;


特点：
1、asc代表的是升序，可以省略
desc代表的是降序

2、order by子句可以支持 单个字段、别名、表达式、函数、多个字段

3、order by子句在查询语句的最后面，除了limit子句

*/

#1、按单个字段排序

SELECT * FROM employees ORDER BY  employee_id DESC;


#案例：查询部门编号>=90的员工信息，并按员工编号降序
SELECT * FROM employees WHERE employee_id >=90 ORDER BY employee_id DESC;

#3、按表达式排序
#案例：查询员工信息 按年薪降序
SELECT *, salary*12*(1+IFNULL(commission_pct,0)) 年薪
FROM employees 
ORDER BY salary*12*(1+IFNULL(commission_pct,0))

#4、按别名排序
#案例：查询员工信息 按年薪升序

SELECT *,salary*12*(1+IFNULL(commission_pct,0)) 年薪
FROM employees
ORDER BY 年薪 ASC;

#5、按函数排序
#案例：查询员工名，并且按名字的长度降序
SELECT LENGTH(last_name) 长度, last_name FROM employees ORDER BY 长度 DESC;

#6、按多个字段排序
#案例：查询员工信息，要求先按工资降序，再按employee_id升序
SELECT employee_id, last_name, salary FROM employees ORDER BY salary DESC , employee_id ASC;


#进阶4：常见函数

/*

概念：类似于java的方法，将一组逻辑语句封装在方法体中，对外暴露方法名
好处：1、隐藏了实现细节  2、提高代码的重用性
调用：select 函数名(实参列表) 【from 表】;
特点：
	①叫什么（函数名）
	②干什么（函数功能）

分类：
	1、单行函数
	如 concat、length、ifnull等
	2、分组函数
	
	功能：做统计使用，又称为统计函数、聚合函数、组函数
	
常见函数：
	一、单行函数
	字符函数：
	length:获取字节个数(utf-8一个汉字代表3个字节,gbk为2个字节)
	concat
	substr
	instr
	trim
	upper
	lower
	lpad
	rpad
	replace
	
	数学函数：
	round
	ceil
	floor
	truncate
	mod
	
	日期函数：
	now
	curdate
	curtime
	year
	month
	monthname
	day
	hour
	minute
	second
	str_to_date
	date_format
	其他函数：
	version
	database
	user
	控制函数
	if
	case


	

*/


#一、字符函数

#1.length 获取参数值的字节个数

SELECT LENGTH('join') -- 4
SELECT LENGTH('张三丰ha'); -- utf8一个汉字三个字节

SHOW VARIABLES LIKE '%char%'

# concat 拼接
SELECT CONCAT(first_name,' - ',last_name) 姓名 FROM employees;

# upper LOWER(str)

SELECT UPPER('name')

#示例：将姓变大写，名变小写，然后拼接
SELECT CONCAT(UPPER(last_name), '  ', LOWER(first_name))  姓名 FROM employees;

#4.substr、substring 
## 注意索引从1开始
#截取从指定索引处后面所有字符
SELECT SUBSTR('李莫愁爱上了陆展元',7)  out_put;

#截取从指定索引处指定字符长度的字符
SELECT SUBSTR('李莫愁爱上了陆展元',1,3) out_put;

#案例：姓名中首字符大写，其他字符小写然后用_拼接，显示出来
SELECT CONCAT(UPPER(SUBSTR(last_name,1,1)),'_',LOWER(SUBSTR(last_name,2)))  out_put
FROM employees;

#5.instr 返回子串第一次出现的索引，如果找不到返回0
SELECT INSTR('杨不殷六侠悔爱上了殷六侠','殷八侠') AS out_put;

#6.trim
SELECT LENGTH(TRIM('    张翠山    ')) AS out_put;

#7.lpad 用指定的字符实现左填充指定长度

SELECT LPAD('殷素素',10,'*') AS out_put;

#8.rpad 用指定的字符实现右填充指定长度

SELECT RPAD('殷素素',12,'ab') AS out_put;

#9.replace 替换

SELECT REPLACE('周芷若周芷若周芷若周芷若张无忌爱上了周芷若','周芷若','赵敏') AS out_put;

#二、数学函数

#round 四舍五入
SELECT ROUND(1.567, 2)
SELECT ROUND(-1.55);

#ceil 向上取整,返回>=该参数的最小整数
SELECT CEIL(-1.02);

#floor 向下取整，返回<=该参数的最大整数
SELECT FLOOR(-9.99);

#truncate 截断 小数位
SELECT TRUNCATE(1.69999,2);

#mod取余
/*
mod(a,b) ：  a-a/b*b

mod(-10,-3):-10- (-10)/(-3)*（-3）=-1
*/
SELECT MOD(10,-3);
SELECT 10%3;

#三、日期函数

#now 返回当前系统日期+时间 2018-10-14 23:39:35
SELECT NOW(); 

#curdate 返回当前系统日期，不包含时间 2018-10-14
SELECT CURDATE(); 
 
#curtime 返回当前时间，不包含日期 23:39:14
SELECT CURTIME(); 


#可以获取指定的部分，年、月、日、小时、分钟、秒
SELECT YEAR(NOW()) 年;
SELECT YEAR('1998-1-1') 年;

SELECT  YEAR(hiredate) 年 FROM employees;
SELECT YEAR(hiredate) 年 FROM employees

SELECT MONTH(NOW()) 当前月
SELECT MONTHNAME(NOW()) October;



#str_to_date 将字符通过指定的格式转换成日期

SELECT STR_TO_DATE('1998-3-2','%Y-%c-%d') AS out_put;

#查询入职日期为1992--4-3的员工信息
SELECT * FROM employees WHERE hiredate = '1992-4-3';

SELECT * FROM employees WHERE hiredate = STR_TO_DATE('4-3 1992','%c-%d %Y');

#date_format 将日期转换成字符
SELECT DATE_FORMAT(NOW(),'%y年%m月%d日') AS out_put;

#查询有奖金的员工名和入职日期(xx月/xx日 xx年)
SELECT last_name, DATE_FORMAT(hiredate,'%y年%m月%d日') AS 入职日期 
FROM employees 
WHERE commission_pct IS NOT NULL

#四、其他函数
##  版本号
SELECT VERSION(); 

## 查看库
SELECT DATABASE();
SELECT USER();


#五、流程控制函数
#1.if函数： if else 的效果
SELECT IF(10>5, '大', '小') -- 大
SELECT last_name, commission_pct, IF(commission_pct IS NULL, '没奖金', '有奖金') 备注
FROM employees;


#2.case函数的使用一： switch case 的效果

/*
java中
switch(变量或表达式){
	case 常量1：语句1;break;
	...
	default:语句n;break;


}

mysql中
case 要判断的字段或表达式
when 常量1 then 要显示的值1或语句1;
when 常量2 then 要显示的值2或语句2;
...
else 要显示的值n或语句n;
end
*/

/*案例：查询员工的工资，要求

部门号=30，显示的工资为1.1倍
部门号=40，显示的工资为1.2倍
部门号=50，显示的工资为1.3倍
其他部门，显示的工资为原工资

*/
##  注意case前面有,号
SELECT salary 原始工资,department_id,CASE department_id
WHEN 30 THEN salary*1.1
WHEN 40 THEN salary*1.2
WHEN 50 THEN salary*1.3
ELSE salary
END AS 新工资
FROM employees;


#3.case 函数的使用二：类似于 多重if
/*
java中：
if(条件1){
	语句1；
}else if(条件2){
	语句2；
}
...
else{
	语句n;
}

mysql中：

case 
when 条件1 then 要显示的值1或语句1
when 条件2 then 要显示的值2或语句2
。。。
else 要显示的值n或语句n
end
*/

#案例：查询员工的工资的情况
如果工资>20000,显示A级别
如果工资>15000,显示B级别
如果工资>10000，显示C级别
否则，显示D级别

SELECT salary, CASE
WHEN salary>20000 THEN 'A'
WHEN salary>15000 THEN 'B'
WHEN salary>10000 THEN 'C'
ELSE 'D'
END AS 工资级别
FROM employees



#二、分组函数
/*
功能：用作统计使用，又称为聚合函数或统计函数或组函数

分类：
sum 求和、avg 平均值、max 最大值 、min 最小值 、count 计算个数

特点：
1、sum、avg一般用于处理数值型
   max、min、count可以处理任何类型
2、以上分组函数都忽略null值

3、可以和distinct搭配实现去重的运算

4、count函数的单独介绍
一般使用count(*)用作统计行数

5、和分组函数一同查询的字段要求是group by后的字段

*/
#1、简单 的使用
SELECT SUM(salary) FROM employees
SELECT AVG(salary) FROM employees;
SELECT MIN(salary) FROM employees;
SELECT MAX(salary) FROM employees;
SELECT COUNT(salary) FROM employees;


SELECT SUM(salary) 和,AVG(salary) 平均,MAX(salary) 最高,MIN(salary) 最低,COUNT(salary) 个数
FROM employees;

SELECT SUM(salary) 和,ROUND(AVG(salary),2) 平均,MAX(salary) 最高,MIN(salary) 最低,COUNT(salary) 个数
FROM employees;


#4、和distinct搭配

SELECT SUM(DISTINCT salary),SUM(salary) FROM employees;

SELECT COUNT(DISTINCT salary),COUNT(salary) FROM employees;
SELECT COUNT(DISTINCT salary), COUNT(salary) FROM employees;


#5、count函数的详细介绍

SELECT COUNT(salary) FROM employees;


SELECT COUNT(*) FROM employees;

SELECT COUNT(1) FROM employees;

效率：
MYISAM存储引擎下  ，COUNT(*)的效率高
INNODB存储引擎下，COUNT(*)和COUNT(1)的效率差不多，比COUNT(字段)要高一些


#6、和分组函数一同查询的字段有限制
## 这个语句是不对的
SELECT AVG(salary),employee_id  FROM employees; 

## 正确的 和分组函数一同查询的字段要求是group by后的字段
SELECT AVG(salary) , employee_id FROM employees GROUP BY employee_id 

#进阶5：分组查询

/*
语法：

select 查询列表
from 表
【where 筛选条件】
group by 分组的字段
【order by 排序的字段】;

特点：
1、和分组函数一同查询的字段必须是group by后出现的字段
2、筛选分为两类：分组前筛选和分组后筛选
		针对的表			位置		连接的关键字

分组前筛选	原始表				            group by前	where
分组后筛选	group by后的结果集    		group by后	having

问题1：分组函数做筛选能不能放在where后面
答：不能

问题2：where——group by——having

一般来讲，能用分组前筛选的，尽量使用分组前筛选，提高效率

3、分组可以按单个字段也可以按多个字段
4、可以搭配着排序使用

*/

#1.简单的分组  5、和分组函数一同查询的字段要求是group by后的字段 这句话要仔细理解

#案例1：查询每个工种的员工平均工资
SELECT AVG(salary), job_id FROM employees GROUP BY job_id

#案例2：查询每个位置的部门个数
SELECT COUNT(*), location_id FROM departments GROUP BY location_id

#2、可以实现分组前的筛选

#案例1：查询邮箱中包含a字符的 每个部门的最高工资
 SELECT MAX(salary), email, department_id FROM employees 
WHERE email LIKE '%a%'
GROUP BY department_id

#案例2：查询有奖金的每个领导手下员工的平均工资

SELECT AVG(salary), manager_id FROM employees
WHERE commission_pct IS NOT NULL
GROUP BY manager_id

# 分组后筛选
#案例：查询哪个部门的员工个数>5

### #①查询每个部门的员工个数
SELECT COUNT(*), department_id 
FROM employees 
GROUP BY department_id

### ② 筛选刚才 ①结果
HAVING COUNT(*)>5

#案例2：每个工种有奖金的员工的最高工资>12000的工种编号和最高工资

SELECT MAX(salary), job_id
FROM employees
WHERE commission_pct IS NOT NULL
GROUP BY job_id
HAVING MAX(salary) > 12000

#案例3：领导编号>102的,每个领导手下的最低工资大于5000的领导编号和最低工资
SELECT MIN(salary), manager_id
FROM employees
WHERE manager_id>102
GROUP BY manager_id
HAVING MIN(salary) > 5000

#4.添加排序

#案例：每个工种有奖金的员工的最高工资>6000的工种编号和最高工资,按最高工资升序

SELECT job_id, MAX(salary) m
FROM employees
WHERE commission_pct IS NOT NULL
GROUP BY job_id
HAVING m>6000
ORDER BY m


#5.按多个字段分组

#案例：查询每个工种每个部门的最低工资,并按最低工资降序
SELECT job_id, department_id, MIN(salary)
FROM employees
GROUP BY job_id, department_id
ORDER BY MIN(salary) DESC;


#进阶6：连接查询
/*
含义：又称多表查询，当查询的字段来自于多个表时，就会用到连接查询
笛卡尔乘积现象：表1 有m行，表2有n行，结果=m*n行

发生原因：没有有效的连接条件
如何避免：添加有效的连接条件

分类：
	按年代分类：
	sql92标准:仅仅支持内连接
	sql99标准【推荐】：支持内连接+外连接（左外和右外）+交叉连接
	
	按功能分类：
		内连接：
			等值连接
			非等值连接
			自连接
		外连接：
			左外连接
			右外连接
			全外连接
		交叉连接
*/

USE girls;
#笛卡尔乘积限现： 表1 有m行 表2有n行 结果=m*n行
/*
结果出现 每个女的都有4个男朋友
*/
SELECT NAME, boyName  FROM boys, beauty  



#一、sql92标准
#1、等值连接
/*

① 多表等值连接的结果为多表的交集部分
②n表连接，至少需要n-1个连接条件
③ 多表的顺序没有要求
④一般需要为表起别名
⑤可以搭配前面介绍的所有子句使用，比如排序、分组、筛选

*/

 #案例1：查询女神名和对应的男神名
SELECT NAME, boyName  FROM boys, beauty  
WHERE beauty.boyfriend_id=boys.id


#案例2：查询员工名和对应的部门名
USE myemployees;
SELECT last_name, department_name
FROM employees, departments
WHERE employees.department_id = departments.department_id


#2、为表起别名
/*
①提高语句的简洁度
②区分多个重名的字段

注意：如果为表起了别名，则查询的字段就不能使用原来的表名去限定

*/
#查询员工名、工种号、工种名
SELECT e.last_name, e.job_id, j.job_title
FROM employees e, jobs j
WHERE e.job_id = j.job_id
AND e.commission_pct IS NOT NULL;

SELECT * FROM employees WHERE commission_pct IS NOT NULL


#5、可以加分组

#案例1：查询每个城市的部门个数

SELECT COUNT(*) 个数, city
FROM departments d, locations l
WHERE d.location_id = l.location_id
GROUP BY city

#6、可以加排序
#案例：查询每个工种的工种名和员工的个数，并且按员工个数降序
SELECT job_title,COUNT(*)
FROM employees e,jobs j
WHERE e.`job_id`=j.`job_id`
GROUP BY job_title
ORDER BY COUNT(*) DESC;




#7、可以实现三表连接？
#案例：查询员工名、部门名和所在的城市
SELECT last_name,department_name,city
FROM employees e,departments d,locations l
WHERE e.`department_id`=d.`department_id`
AND d.`location_id`=l.`location_id`
AND city LIKE 's%'

ORDER BY department_name DESC;


#2、非等值连接
#案例1：查询员工的工资和工资级别
SELECT * FROM job_grades;

SELECT salary, grade_level
FROM employees e, job_grades g
WHERE salary BETWEEN g.lowest_sal AND g.highest_sal

AND g.grade_level='A'


#3、自连接
#案例：查询 员工名和上级的名称
SELECT last_name, employee_id, manager_id
FROM employees e

/*
自已表中去查
*/
SELECT e.last_name, e.employee_id, m.last_name, m.manager_id
FROM employees e, employees m
WHERE e.employee_id = m.manager_id


#二、sql99语法
/*
语法：
	select 查询列表
	from 表1 别名 [连接类型]
	join 表2 别名
	on 连接条件
		[where 筛选条件]
		[group by 分组]
		[having 筛选条件]
		[order by 排序条件]

分类：
内连接（★）：inner
外连接
	左外(★):  left  【outer】
	右外(★)： right 【outer】
	全外：     full  【outer】
交叉连接：cross 

*/

#一）内连接

/*
语法：

select 查询条件
from 表1 别名
inner join 表2 别名
on 连接条件

分类：
等值
非等值
自连接

特点：
①添加排序、分组、筛选
②inner可以省略
③ 筛选条件放在where后面，连接条件放在on后面，提高分离性，便于阅读
④inner join连接和sql92语法中的等值连接效果是一样的，都是查询多表的交集

*/

#1、等值连接
#案例1.查询员工名、部门名
SELECT last_name, department_name
FROM departments d
JOIN employees e
ON d.department_id = e.department_id

#案例2.查询名字中包含e的员工名和工种名（添加筛选）
SELECT last_name, job_title
FROM employees e
JOIN jobs j
ON e.job_id = j.job_id
WHERE e.last_name LIKE '%e%'

#3. 查询部门个数>3的城市名和部门个数，（添加分组+筛选）
SELECT COUNT(*) 部门个数, city
FROM departments d
JOIN locations l
ON d.location_id = l.location_id
GROUP BY city
HAVING COUNT(*)>3;
