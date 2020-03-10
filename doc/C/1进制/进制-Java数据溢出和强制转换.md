
```Js
/*
	数据类型：
		引用数据类型：类，接口，数组。
		基本数据类型：4类8种
			整数：			占用字节
				byte		1
				short		2
				int			4
				long		8
			浮点数：
				float		4
				double		8
			字符：
				char		2
			布尔：	
				boolean		1

		注意：
			整数默认是int类型。long类型加后缀L或者l。
			浮点数默认是double类型。float类型后加后缀F或者f。

		面试题：java中的char类型是否可以存储一个中文，为什么?
				可以。原因是java采用的unicode编码方法，这个编码用两个字节表示一个字符。
*/
class VariableDemo {
	public static void main(String[] args) {
		//定义变量的格式：数据类型 变量名 = 初始化值;
		
		//定义byte类型的变量
		byte b = 100;
		System.out.println(100);
		System.out.println(b);

		//定义short类型的变量
		short s = 10000;
		System.out.println(s);

		//定义int类型的变量
		int i = 100000000;
		System.out.println(i);

		//int j = 10000000000000;
		long l =  10000000000000L;
		System.out.println(l);

		//定义float类型变量
		float f = 12.5F;
		System.out.println(f);

		//定义double类型变量
		double d = 12.5;
		System.out.println(d);

		//定义char类型变量
		char ch = 'A';
		System.out.println(ch);

		//定义boolean类型变量
		boolean flag = true;
		System.out.println(flag);
	}
}

```

## 数据溢出是如何解决的
![image](http://note.youdao.com/yws/public/resource/f063c3257d1eff57c9d293a7ebd0a3df/xmlnote/36B299BC47C747BEB8B3F57829516A1D/3931)


## byte+int结果是byte类型图解
![image](http://note.youdao.com/yws/public/resource/f063c3257d1eff57c9d293a7ebd0a3df/xmlnote/8311AA2FB0E843628B05D27D8EDB371A/3927)

## byte+int结果是int类型图解
![image](http://note.youdao.com/yws/public/resource/f063c3257d1eff57c9d293a7ebd0a3df/xmlnote/9860FADBA62645E7A4BC4D11F0461096/3929)