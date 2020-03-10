# 一、常用包
常用包 | 说明
---|---
fmt	   | 实现格式化的输入输出操作，其中的fmt.Printf()和fmt.Println()是开发者使用最为频繁的函数。	
io	   | 实现了一系列非平台相关的IO相关接口和实现，比如提供了对os中系统相关的IO功能的封装。我们在进行流式读写（比如读写文件）时，通常会用到该包。	
bufio  | 它在io的基础上提供了缓存功能。在具备了缓存功能后， bufio可以比较方便地提供ReadLine之类的操作。	
strconv| 提供字符串与基本数据类型互转的能力。
os	   | 本包提供了对操作系统功能的非平台相关访问接口。接口为Unix风格。提供的功能包括文件操作、进程管理、信号和用户账号等。	
sync   | 它提供了基本的同步原语。在多个goroutine访问共享资源的时候，需要使用sync中提供的锁机制。	
flag   | 它提供命令行参数的规则定义和传入参数解析的功能。绝大部分的命令行程序都需要用到这个包。	
encoding/json   | 	JSON目前广泛用做网络程序中的通信格式。提供了对JSON的基本支持，比如从一个对象序列化为JSON字符串，或者从JSON字符串反序列化出一个具体的对象等。
http   | 通过http包，只需要数行代码，即可实现一个爬虫或者一个Web服务器，这在传统语言中是无法想象的。

# 二、完整包列表
包	|  说明
---|---
bufio	        | 实现缓冲的I/O
bytes	        | 提供了对字节切片操作的函数
crypto	        | 收集了常见的加密常数
==errors==	    | 实现了操作错误的函数
Expvar	        | 为公共变量提供了一个标准的接口，如服务器中的运算计数器
==flag==	    | 实现了命令行标记解析
==fmt==	        | 实现了格式化输入输出
hash	        | 提供了哈希函数接口
html	        | 实现了一个HTML5兼容的分词器和解析器
image	        | 实现了一个基本的二维图像库
==io==	        | 提供了对I/O原语的基本接口
log	            | 它是一个简单的记录包，提供最基本的日志功能
math	        | 提供了一些基本的常量和数学函数
mine	        | 实现了部分的MIME规范
==net==	        | 提供了一个对UNIX网络套接字的可移植接口，包括TCP/IP、 UDP域名解析和UNIX域套接字
==os==	        | 为操作系统功能实现了一个平台无关的接口
path	        | 实现了对斜线分割的文件名路径的操作
reflect         | 实现了运行时反射，允许一个程序以任意类型操作对象
regexp	        | 实现了一个简单的正则表达式库
runtime         | 包含与Go运行时系统交互的操作，如控制goroutine的函数
sort	        | 提供对集合排序的基础函数集
strconv         | 实现了在基本数据类型和字符串之间的转换
strings         | 实现了操作字符串的简单函数
sync	        | 提供了基本的同步机制，如互斥锁
syscall         | 包含一个低级的操作系统原语的接口
testing         | 提供对自动测试Go包的支持
==time==	    | 提供测量和显示时间的功能
unicode         | Unicode编码相关的基础函数

## archive
包	|  说明
---|---
tar	| 实现对tar压缩文档的访问
zip	| 提供对ZIP压缩文档的读和写支持

## compress
包	|  说明
---|---
bzip2 |  实现了bzip2解压缩
flate |  实现了RFC 1951中所定义的DEFLATE压缩数据格式
gzip  |  实现了RFC 1951中所定义的gzip格式压缩文件的读和写
lzw	  |  实现了 Lempel-Ziv-Welch编码格式的压缩的数据格式
zlib  |  实现了RFC 1950中所定义的zlib格式压缩数据的读和写

## container
包	|  说明
---|---
heap |	提供了实现heap.Interface接口的任何类型的堆操作
lsit |	实现了一个双链表
ring |	实现了对循环链表的操作

## crypto
包	|  说明
---|---
aes	         |  实现了AES加密（以前的Rijndael）
cipher	     |  实现了标准的密码块模式，该模式可包装进低级的块加密实现中
des	         |  实现了数据加密标准（ Data Encryption Standard，DES）和三重数据加密算法（ TripleData Encryption Algorithm， TDEA）
dsa	         |  实现了FIPS 186-3所定义的数据签名算法（ Digital Signature Algorithm）
ecdsa	     |  实现了FIPS 186-3所定义的椭圆曲线数据签名算法（ Elliptic Curve Digital Signature Algorithm）
elliptic     |  实现了素数域上几个标准的椭圆曲线
hmac	     |  实现了键控哈希消息身份验证码（ Keyed-Hash Message Authentication Code，HMAC）
md5	         |  实现了RFC 1321中所定义的MD5哈希算法
rand	     |  实现了一个加密安全的伪随机数生成器
rc4	         |  实现了RC4加密，其定义见Bruce Schneier的应用密码学（ Applied Cryptography）
rsa	         |  实现了PKCS#1中所定义的RSA加密
sha1	     |  实现了RFC 3174中所定义的SHA1哈希算法
sha256	     |  实现了FIPS 180-2中所定义的SHA224和SHA256哈希算法
sha512	     |  实现了FIPS 180-2中所定义的SHA384和SHA512哈希算法
subtle	     |  实现了一些有用的加密函数，但需要仔细考虑以便正确应用它们
tls	         |  部分实现了RFC 4346所定义的TLS 1.1协议
x509	     |  可解析X.509编码的键值和证书
x509/pkix	 | 包含用于对X.509证书、 CRL和OCSP的ASN.1解析和序列化的共享的、低级的结构

## ==database==
包	|  说明
---|---
sql	        | 围绕SQL提供了一个通用的接口
sql/driver	| 定义了数据库驱动所需实现的接口，同sql包的使用方式

## debug
包	|  说明
---|---
dwarf	| 提供了对从可执行文件加载的DWARF调试信息的访问，这个包对于实现Go语言的调试器非常有价值
elf	    | 实现了对ELF对象文件的访问。 ELF是一种常见的二进制可执行文件和共享库的文件格式。 Linux采用了ELF格式
gosym	| 访问Go语言二进制程序中的调试信息。对于可视化调试很有价值
macho	| 实现了对http://developer.apple.com/mac/library/documentation/DeveloperTools/Conceptual/MachORuntime/Reference/reference.html 所定义的Mach-O对象文件的访问
pe	   | 实现了对PE（ Microsoft Windows Portable Executable）文件的访问


## encoding
包	|  说明
---|---
ascii85	|  实现了ascii85数据编码，用于btoa工具和Adobe’s PostScript以及PDF文档格式
asn1	|  实现了解析DER编码的ASN.1数据结构，其定义见ITU-T Rec X.690
base32	|  实现了RFC 4648中所定义的base32编码
base64	|  实现了RFC 4648中所定义的base64编码
binary	|  实现了在无符号整数值和字节串之间的转化，以及对固定尺寸值的读和写
csv	    |  可读和写由逗号分割的数值（ csv）文件
gob	    |  管理gob流——在编码器（发送者）和解码器（接收者）之间进行二进制值交换
hex	    |  实现了十六进制的编码和解码
json	|  实现了定义于RFC 4627中的JSON对象的编码和解码
pem	    |  实现了PEM（ Privacy Enhanced Mail）数据编码
xml	    |  实现了一个简单的可理解XML名字空间的XML 1.0解析器

## go
包	|  说明
---|---
ast	    | 声明了用于展示Go包中的语法树类型
build	| 提供了构建Go包的工具
doc	    | 从一个Go AST（抽象语法树）中提取源代码文档
parser	| 实现了一个Go源文件解析器
printer	| 实现了对AST（抽象语法树）的打印
scanner	| 实现了一个Go源代码文本的扫描器
token	| 定义了代表Go编程语言中词法标记以及基本操作标记（ printing、 predicates）的常量

## hash
包	|  说明
---|---
adler32	| 实现了Adler-32校验和
crc32	| 实现了32位的循环冗余校验或CRC-32校验和
crc64	| 实现了64位的循环冗余校验或CRC-64校验和
fnv	    | 实现了Glenn Fowler、 Landon Curt Noll和Phong Vo所创建的FNV-1和FNV-1a未加密哈希函数

## html
包	|  说明
---|---
template	| 它自动构建HTML输出，并可防止代码注入

## image
包	|  说明
---|---
color	| 实现了一个基本的颜色库
draw	| 提供一些做图函数
gif	    | 实现了一个GIF图像解码器
jpeg	| 实现了一个JPEG图像解码器和编码器
png	    | 实现了一个PNG图像解码器和编码器

## io
包	|  说明
---|---
ioutil	| 实现了一些实用的I/O函数

## log
包	|  说明
---|---
syslog	| 提供了对系统日志服务的简单接口


## math
包	|  说明
---|---
big	    |  实现了多精度的算术运算（大数）
cmplx	|  为复数提供了基本的常量和数学函数
rand	|  实现了伪随机数生成器

## mime
包	|  说明
---|---
multipart	|  实现了在RFC 2046中定义的MIME多个部分的解析

## ==net==
包	|  说明
---|---
http	        | 提供了HTTP客户端和服务器的实现
mail	        | 实现了对邮件消息的解析
rpc	            | 提供了对一个来自网络或其他I/O连接的对象可导出的方法的访问
smtp	        | 实现了定义于RFC 5321中的简单邮件传输协议（ Simple Mail Transfer Protocol)
textproto	    | 实现了在HTTP、 NNTP和SMTP中基于文本的通用的请求/响应协议
url	            | 解析URL并实现查询转义
http/cgi	    | 实现了定义于RFC 3875中的CGI（通用网关接口）
http/fcgi	    | 实现了FastCGI协议
http/httptest	| 提供了一些HTTP测试应用
http/httputil	| 提供了一些HTTP应用函数，这些是对net/http包中的东西的补充，只不过相对不太常用
http/pprof	    | 通过其HTTP服务器运行时提供性能测试数据，该数据的格式正是pprof可视化工具需要的
rpc/jsonrpc	    | 为rpc包实现了一个JSON-RPC ClientCodec和ServerCodec

## ==os==
包	|  说明
---|---
exec	| 可运行外部命令
user	| 通过名称和id进行用户账户检查

## path
包	|  说明
---|---
filepath	|  实现了以与目标操作系统定义文件路径相兼容的方式处理文件名路径

## ==regexp==
包	|  说明
---|---
syntax	| 将正则表达式解析为语法树

## runtime
包	|  说明
---|---
debug |	包含当程序在运行时调试其自身的功能
pprof |	以pprof可视化工具需要的格式写运行时性能测试数据


## sync
包	|  说明
---|---
atomic	|  提供了低级的用于实现同步算法的原子级的内存机制

## testing
包	|  说明
---|---
iotest	| 提供一系列测试目的的类型，实现了Reader和Writer标准接口
quick	| 实现了用于黑箱测试的实用函数
script	| 帮助测试使用通道的代码

## text
包	|  说明
---|---
scanner	        |  为UTF-8文本提供了一个扫描器和分词器
tabwriter	    |  实现了一个写筛选器（ tabwriter.Writer），它可将一个输入的tab分割的列翻译为适当对齐的文本
template	    |  数据驱动的模板引擎，用于生成类似HTML的文本输出格式
template/parse	|  为template构建解析树
unicode/utf16	|  实现了UTF-16序列的的编码和解码
unicode/utf8	|  实现了支持以UTF-8编码的文本的函数和常数

原文：https://blog.csdn.net/huwh_/article/details/53710530
