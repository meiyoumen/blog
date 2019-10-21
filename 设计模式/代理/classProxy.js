class Subject {
  constructor(){
    console.log('Subject Class created')
  }
  request(){
    console.log('Subject.request invoked')
  }
}

class RealSubject extends Subject {
  constructor(){
    super()
    console.log('RealSubject Class created')
  }
  request() {
    console.log('RealSubject.request invoked')
  }
}

/**
 代理模式是为一个对象提供一个代用品或占位符，以便控制对它的访问。
 代理模式的关键是，当客户不方便直接访问一个对象或者不满足需要的时候，提供一个替身对象来控制对这个对象的访问，
 客户实际上访问的是替身对象。替身对象对请求做出一些处理之后，再把请求转交给本体对象。
 */
class Proxy extends Subject{
  constructor(){
    super()
    console.log('Proxy Class created')
  }

  request() {
    this.realSubject = new RealSubject()
    this.realSubject.request()
  }
}

let proxy = new Proxy()
proxy.request()