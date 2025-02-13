{
  // ** 절차적 프로그래밍으로 커피 머신 만들어 보기
  type CoffeeCup = {
    shots: number;
    hasMilk: boolean;
  }

  class CoffeeMachine {
   static BEANS_GRAM_PER_SHOT: number = 7; // class level

    constructor(
      // ts에서는 생성자에서 public, private, readonly 를 사용하면 자동으로 할당되서 보일러 플레이트(set...) 줄일 수 있다.
      private coffeeBeans: number = 0 // instance level
    ) { }

    static makeMachine(coffeeBeans: number) {
      return new CoffeeMachine(coffeeBeans);
    }

    makeCoffee(shots: number): CoffeeCup {
      if (this.coffeeBeans < shots * CoffeeMachine.BEANS_GRAM_PER_SHOT) {
        throw new Error('Not enough coffee beans!');
      }
      return {
        shots,
        hasMilk: false,
      }
    }
  }

  const newMachine = new CoffeeMachine(100);
  const newMachine2 = CoffeeMachine.makeMachine(100)

  console.log(1,newMachine)
  console.log(2, newMachine2)
}
