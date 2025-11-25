// Reflect는 JavaScript에서 ES6(ECMAScript 2015) 때 도입된 내장 객체로,
// 객체를 다루는 데 필요한 **기본 동작(내부 메서드)**을 모아둔 “유틸리티 객체”

// 1. 일관된 API 제공
// - 기존엔 Object.defineProperty, delete obj.prop처럼 문법이 제각각이었음
// - Reflect는 전부 메서드 형태 (Reflect.defineProperty, Reflect.deleteProperty)로 통일

// 2. 에러 대신 true/false 반환
// - 일부 연산은 기존 방식에서는 오류가 나지만, Reflect는 실패해도 false를 반환하도록 설계됨
// 즉, 더 안전한 방식

try {
  Object.defineProperty(obj, 'x', { value: 10, writable: false });
} catch (e) {
  // 오류 처리 필요
}

const ok = Reflect.defineProperty(obj, 'x', { value: 10, writable: false });
console.log(ok); // true or false

// 3. Proxy와 1:1로 동작을 맞추기 위해
// - Proxy 트랩(trap)들이 실행해야 하는 기본 동작을 Reflect 메서드로 처리
// - Proxy 만들 때 거의 필수 (proxy는 인터셉터, reflect는 기본 엔진 역할)
// - 왜 필수일까? 는 proxy.js에서 설명함

const person = {
  name: 'jay',
  age: 29,
};

console.log(Reflect.get(person, 'name')); // jay
console.log(Reflect.set(person, 'name', 'hyeon')); // true
console.log(person); // { name: 'hyeon', age: 29 }

console.log(Reflect.has(person, 'id')); // false
console.log(Reflect.has(person, 'name')); // true
console.log(Reflect.has(person, 'age')); // true

console.log(Reflect.deleteProperty(person, 'age')); // true
console.log(person); // { name: 'hyeon' }

Reflect.apply(Math.max, null, [1, 10, 5]); // 10

// ** Proxy와 함께 사용하기 **
const obj = { name: 'Tom' };

const proxy = new Proxy(obj, {
  get(target, prop, receiver) {
    console.log('get:', prop);
    return Reflect.get(target, prop, receiver); // 기본 동작 수행
  },
});

console.log(proxy.name);

// * receiver는 왜 필요할까?
// -> reciever는 객체의 getter/setter, prototype chaining에서까지 this를 "proxy 자신"으로 바인딩할 수 있게 해준다.
// 프레임 워크는 proxy를 중첩해서 재귀적으로 만드는 경우가 많음
// 이 때 this 바인딩이 proxy가 아니라 target이 되어버리는 상황이 온다면
// 반응형 추적 꺠짐 - reactive 디버깅이 안됨, 다중 proxy chaining 불가능
// (proxy.js 참고)

// ** “객체 감시(watch)” 기능 만들기
function observe(obj, callback) {
  return new Proxy(obj, {
    set(target, prop, value, receiver) {
      callback(prop, value);
      return Reflect.set(target, prop, value, receiver);
    },
  });
}

const data = observe({ a: 1 }, (prop, val) => {
  console.log(`변경됨: ${prop} = ${val}`);
});

data.a = 5; // 변경됨: a = 5

// ** 데이터 검증
function createUser(user) {
  return new Proxy(user, {
    set(target, prop, value) {
      if (prop === 'age' && value < 0) {
        throw new Error('나이는 음수가 될 수 없음');
      }
      return Reflect.set(target, prop, value);
    },
  });
}

const u = createUser({});
u.age = 10; // OK
u.age = -5; // Error!

// ** 읽기 전용 객체(immutable object) - Zustand 같은 상태관리에서 많이 사용됨
function readonly(obj) {
  return new Proxy(obj, {
    set() {
      throw new Error('읽기 전용 객체임');
    },
    deleteProperty() {
      throw new Error('삭제 불가');
    },
  });
}

const config = readonly({ apiKey: 'abc' });

// ** 로깅 / 디버깅용 Proxy
function logger(obj) {
  return new Proxy(obj, {
    get(target, prop, receiver) {
      console.log('get', prop);
      return Reflect.get(target, prop, receiver);
    },
  });
}

const o = logger({ a: 1 });
o.a; // get a

// ** 깊은 Reactivity (nested) - Vue/Pinia, solid-js가 사용하는 방식
function reactive(obj) {
  return new Proxy(obj, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      return typeof value === 'object' && value !== null
        ? reactive(value)
        : value;
    },
  });
}

// ** Proxy + Reflect로 “상태관리(store)” 를 만든다면?
function createStore(initialState) {
  // 상태 저장소
  const listeners = new Set();

  const state = new Proxy(initialState, {
    set(target, prop, value, receiver) {
      const result = Reflect.set(target, prop, value, receiver);

      // 구독자들에게 알림
      listeners.forEach((fn) => fn(prop, value));

      return result;
    },
  });

  return {
    state,
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };
}

const store = createStore({ count: 0 });
store.subscribe((prop, value) => {
  console.log(`${prop} = ${value}`);
});

store.state.count = 1; // count = 1

//** Vue 3 (Composition API)에서 Reflect 사용 방식 */
const handler = {
  get(target, prop, receiver) {
    track(target, prop); // 의존성 추적
    return Reflect.get(target, prop, receiver);
  },
  set(target, prop, value, receiver) {
    const oldVal = target[prop];
    const result = Reflect.set(target, prop, value, receiver);

    if (oldVal !== value) {
      trigger(target, prop); // 컴포넌트 리렌더
    }
    return result;
  },
};

function reactive(obj) {
  return new Proxy(obj, handler);
}
