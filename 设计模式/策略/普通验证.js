/**
 registerForm.addEventListener绑定的函数比较庞大，包含了很多的if-else语句，看着都恶心，这些语句需要覆盖所有的校验规则。
 registerForm.addEventListener绑定的函数缺乏弹性，如果增加了一种新的校验规则，或者想要把密码的长度校验从6改成8，
 我们都必须深入registerForm.addEventListener绑定的函数的内部实现，这是违反了开放-封闭原则的。
 算法的复用性差，如果程序中增加了另一个表单，这个表单也需要进行一些类似的校验，那我们很可能将这些校验逻辑复制得漫天遍野。
 */
let registerForm = document.querySelector('#registerForm')
registerForm.addEventListener('submit', function() {
  if (registerForm.userName.value === '') {
    alert('用户名不能为空！')
    return false
  }
  if (registerForm.userName.length < 6) {
    alert('用户名长度不能少于6位！')
    return false
  }
  if (registerForm.passWord.value === '') {
    alert('密码不能为空！')
    return false
  }
  if (registerForm.passWord.value.length < 6) {
    alert('密码长度不能少于6位！')
    return false
  }
  if (registerForm.phoneNumber.value === '') {
    alert('手机号码不能为空！')
    return false
  }
  if (!/^1(3|5|7|8|9)[0-9]{9}$/.test(registerForm.phoneNumber.value)) {
    alert('手机号码格式不正确！')
    return false
  }
  if (registerForm.emailAddress.value === '') {
    alert('邮箱地址不能为空！')
    return false
  }
  if (!/^\w+([+-.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(registerForm.emailAddress.value)) {
    alert('邮箱地址格式不正确！')
    return false
  }
}, false)