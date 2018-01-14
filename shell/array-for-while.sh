#!/bin/bash
arr=(A B "C" D)
echo "-------FOR循环遍历输出数组--------"
for i in ${arr[@]};
do
	echo $i
done

printf "\n"
echo "---------------------------------------------"

for i in "${!arr[@]}";
do
	printf "%s %s\n" "$i" "${arr[$i]}"   #0 A
done

echo "-------WHILE循环输出 使用 let i++ 自增--------"
j=0
while [ $j -lt ${#arr[@]} ]
do
	echo ${arr[$j]}
	let j++
done

printf "\n"
echo "---------------------------------------------"

j=0
while [ $j -lt ${#arr[@]} ]
do
	printf "%s %s\n" "$j" "${arr[$j]}"  #0 A
	let j++
done

