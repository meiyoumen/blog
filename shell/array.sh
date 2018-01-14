#!/bin/bash
arr=(A B "C" D)
echo "arr[0]: ${arr[0]}"
echo "arr[1]: ${arr[1]}"
echo "arr[2]: ${arr[2]}"
echo "arr[3]: ${arr[3]}"

#使用@ 或 * 可以获取数组中的所有元素:

echo "arr: ${arr[*]}"  		    # arr: A B C D
echo "arr: ${arr[@]}"  			# arr: A B C D 

echo "arr length: ${#arr[*]}"	#arr length: 4
echo "arr length: ${#arr[@]}"	##arr length: 4

echo $?

# arr[0]: A
# arr[1]: B
# arr[2]: C
# arr[3]: D
# arr: A B C D
# arr: A B C D
# 0
