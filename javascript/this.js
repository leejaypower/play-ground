{
  // ** js에서 this는 함수가 호출되는 방식에 따라 달라진다. **

  console.log(this);

  // 함수를 선언하면 기본적으로 전역(글로벌 객체)에서 접근이 가능하다. var도 마찬가지 (호이스팅). let, const는 안됨
  function pointThis() {
    console.log(this);
  }
  // 전역 호출은 window.pointThis(); 와 같음
  pointThis();

  class Counter {
    count = 0;
    increase = function () {
      console.log(this); // Counter 인스턴스를 가리킴
    };

    // increase = () => {
    //   console.log(this); // 화살표 함수는 선언될 당시의 상위 스코프를 가리킴 = 렉시컬(lexical) 스코프
    // };
  }
  const counter = new Counter();
  counter.increase(); //  // Counter 인스턴스를 가리킴

  const caller = counter.increase; // 함수 자체를 할당해본다. (js는 함수를 일급 객체로 다루니까)
  caller(); // undefined 출력 => this를 잃어버림. 왜? 함수가 원래의 컨텍스트와 분리되어 호출되면서 this 바인딩이 끊어짐

  // const caller2 = counter.increase.bind(counter); // 함수의 this를 counter 인스턴스로 고정시키는 방법
  // 혹은 화살표 함수를 사용하는 방법

  class Jay {}
  const jay = new Jay();
  jay.say = counter.increase; // Jay 인스턴스를 가리킴
  jay.say(); // Jay 인스턴스를 가리킴
}
