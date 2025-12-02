{
  // ** js에서 this는 함수가 "호출"될 때 정해진다. 함수가 "호출" 되는 방식에 따라 달라진다. **

  console.log(this); // global

  // 함수를 선언하면 기본적으로 전역(글로벌 객체)에서 접근이 가능하다. var도 마찬가지 (호이스팅). let, const는 안됨
  function pointThis() {
    console.log(this);
  }
  // 전역 호출은 window.pointThis(); 와 같음
  pointThis();

  class Counter {
    count = 0;
    increase = function () {
      console.log(this); // 여기서 increase 함수가 호출되기 전까지 this가 Counter 인스턴스를 가리킨다고 단언할 수 없음
    };

    // 화살표 함수는 선언될 당시의 상위 스코프를 가리킴 = 렉시컬(lexical) 스코프의 this를 고정한다
    increase2 = () => {
      console.log(this); // 클래스 필드의 화살표 함수 - Counter 인스턴스를 가리키는 this를 고정한다.
      // 이렇게 constructor가 생략되어도? YES. 클래스 필드는 자동 생성된 생성자 내부에서 초기화된다.
    };

    // class Counter {
    //   count = 0;
    //   increase = () => {
    //     console.log(this);
    //   };
    // }

    // 실제로는 이렇게 변환:
    // class Counter {
    //   constructor() {  // 자동 생성!
    //     this.count = 0;
    //     this.increase = () => {
    //       console.log(this);
    //     };
    //   }
    // }
  }

  // *부록) 클래스 정의 시
  // Counter (constructor function)
  // Counter.prototype = { increase: function }

  const counter = new Counter();
  counter.increase(); // Counter 인스턴스를 가리킴

  // *부록) new Counter()시
  // counter = {
  //   count: 0,
  //   increase: function() { ... },    // 클래스 필드 때문에 인스턴스에 복사됨
  //   increase2: () => { ... },        // 역시 인스턴스에 고정됨
  //   __proto__: Counter.prototype
  // }

  const caller = counter.increase; // 함수 자체를 할당해본다. (js는 함수를 일급 객체로 다루니까)
  caller(); // undefined 출력 => this를 잃어버림. 왜? 함수가 원래의 컨텍스트와 분리되어 호출되면서 this 바인딩이 끊어짐

  // 함수의 this를 counter 인스턴스로 고정시키는 방법
  const caller2 = counter.increase.bind(counter);
  caller2();
  counter.increase.apply(counter);
  counter.increase.call(counter);

  // 혹은 화살표 함수를 사용한다 -> this 바인딩을 고정해서 분리 호출해도 this를 잃어버리지 않기 때문!
  const caller3 = counter.increase2;
  caller3(); // Counter 인스턴스를 가리킴

  class Jay {}
  const jay = new Jay();
  jay.say = counter.increase;
  jay.say(); // 함수를 호출할 때 this가 결정된다: Jay

  // 객체는 스코프 체인이 없다!
  const obj = {
    name: 'jay',
    sayThis: () => {
      console.log(this); // 그렇기에 전역 객체 global을 가리킴
    },
  };

  obj.sayThis(); // global
}
