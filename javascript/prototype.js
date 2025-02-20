{
  // js에서 상속을 위해 사용되는 prototype
  // prototype-based language
  // - 객체 지향 프로그래밍을 할 수 있는 한 가지의 방식으로서, 행동들과 객체를 재사용할 수 있다.
  const x = {};
  const y = {};
  console.log(x.toString()); // [object Object] => 가능
  // 왜 가능할까? 프로토타입 체인이 있기 때문 - object를 상속한다.

  console.log(x.__proto__ === y.__proto__); // true

  // 1. 생성자 함수
  function CoffeeMachine(beans) {
    this.beans = beans;

    // instance level의 메서드
    this.makeCoffee = (shots) => {
      console.log("making...");
    };
  }

  // prototype level의 메서드
  CoffeeMachine.prototype.makeCoffee = function (shots) {
    console.log("making...");
  };

  function LatteMachine(beans, milk) {
    this.beans = beans;
    this.milk = milk;
  }

  // 고전적인 상속 방법
  LatteMachine.prototype = Object.create(CoffeeMachine.prototype);
}
