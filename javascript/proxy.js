// ** Proxy는 어떤 객체를 감싸서 그 객체에 접근하거나 수정할 때 대신 가로채는 기능을 가진 객체
// 즉 Proxy는 객체 접근을 가로채는 중간 레이어를 만든다
{
  const proxy = new Proxy(target, handler); // target: 원본 객체, handler: 핸들러 객체
  // 원본 객체: 프록시가 감싸는 진짜 객체
  // 핸들러 객체: 가로챌 동작들을 정의하는 객체. 여기에 “트랩(trap)”이라는 함수를 넣는다.

  const user = { name: 'Tom' };

  const proxy2 = new Proxy(user, {
    get(target, prop) {
      console.log('get:', prop);
      return target[prop];
    },
    set(target, prop, value) {
      console.log('set:', prop, value);
      target[prop] = value;
      return true;
    },
  });

  proxy2.name; // get: name
  proxy2.age = 10; // set: age 10
  // ** 내부적으로 target에 접근할지 말지도 Proxy가 결정
}

{
  // ** proxy의 동작에 왜 reflect를 사용해야할까?
  // 1. getter가 있을 때 this 바인딩이 깨질 수 있음
  const user = {
    name: 'Tom',
    get upperName() {
      return this.name.toUpperCase();
    },
  };

  user.upperName; // => this가 user를 가리킴

  const proxy = new Proxy(user, {
    get(target, prop, receiver) {
      return target[prop];
    },
  });

  proxy.upperName; // => this가 proxy 객체가 되기를 기대하지만 target(원본 객체)를 가리킴

  const p = new Proxy(user, {
    get(target, prop, receiver) {
      return Reflect.get(target, prop, receiver);
    },
  });

  p.upperName; // => this가 proxy를 가리킴. "receiver"가 proxy를 this로 전달해줌
}
