{
  // ** 절차적 프로그래밍으로 커피 머신 만들어 보기

  type CoffeeCup = {
    shots: number;
    hasMilk: boolean;
  }

  const BEANS_GRAM_PER_SHOT: number = 7;
  let coffeeBeans: number = 0;

  function makeCoffee(shots: number): CoffeeCup {
    if (coffeeBeans < shots * BEANS_GRAM_PER_SHOT) {
      throw new Error('Not enough coffee beans!');
    }
    coffeeBeans -= shots * BEANS_GRAM_PER_SHOT;

    return {
      shots,
      hasMilk: false,
    }
  }

  coffeeBeans += 3 * BEANS_GRAM_PER_SHOT;
  const coffee = makeCoffee(2);
}




