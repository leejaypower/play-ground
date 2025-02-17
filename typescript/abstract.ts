{
  type CoffeeCup = {
    shots: number;
    hasMilk?: boolean;
    hasSyrup?: boolean;
  };

  interface CoffeeMaker {
    makeCoffee(shots: number): CoffeeCup;
  }

  interface CafeCoffeeMaker {
    makeCoffee(shots: number): CoffeeCup;
    fillCoffeeBeans(beans: number): void;
    clean(): void;
  }

  // ** 추상클래스 - 이 자체로는 인스턴스를 만들 수 없다.
  abstract class CoffeeMachine implements CoffeeMaker, CafeCoffeeMaker {
    private static BEANS_GRAM_PER_SHOT: number = 7; 
    protected _myCoffeeBeans: number = 0;

    public constructor(
      private coffeeBeans: number = 0
    ) {
      console.log(`☕️ 커피 머신 생성됨: 커피 콩 ${this.coffeeBeans}개`);
      this._myCoffeeBeans = coffeeBeans;
    }

    get myCoffeeBeans() {
      return `${this._myCoffeeBeans}개`;
    }

    fillCoffeeBeans(beans: number) {
      if (beans < 0) {
        throw new Error("0보다 큰 커피콩 수를 입력해주세요.");
      }
      console.log(`커피 콩 ${beans}개를 채웠습니다. 🛒`);

      this._myCoffeeBeans += beans;
      console.log(`현재 커피 콩은 ${this.myCoffeeBeans} 있습니다.`);
    }

    private grindBeans(shots: number) {
      console.log(`커피 콩을 갈아넣습니다. ⚙️`);
      if (this._myCoffeeBeans < shots * CoffeeMachine.BEANS_GRAM_PER_SHOT) {
        throw new Error(`커피콩이 ${shots * CoffeeMachine.BEANS_GRAM_PER_SHOT - this._myCoffeeBeans}개 부족합니다!`);
      }
      this._myCoffeeBeans -= shots * CoffeeMachine.BEANS_GRAM_PER_SHOT;
    }

    private preheat() {
      console.log('예열 중...🔥');
    }

    // 자식 행동에 따라 달라질 수 있다면 abstract 메서드로 선언해야 한다.
    protected abstract extract(shots: number): CoffeeCup;

    makeCoffee(shots: number): CoffeeCup {
      this.grindBeans(shots);
      this.preheat();
      return this.extract(shots);
    }

    clean() {
      console.log('🧼 🫧 🧴');
    }
  }

  class LatteMachine extends CoffeeMachine {
    constructor(beans: number, public readonly serialNumber: string) {
      super(beans);
    }

    private steamMilk(): void {
      console.log('우유 거품을 부어 넣습니다. 🥛');
    }

    // makeCoffee(shots: number): CoffeeCup {
    //   // 실수로 super를 호출하지 않는다면? => 이를 방지하기 위해 abstract 클래스를 사용해보자.
    //   // const coffee = super.makeCoffee(shots);
    //   this.steamMilk();
    //   return {
    //     shots,
    //     hasMilk: true,
    //   }
    // }

    protected extract(shots: number): CoffeeCup {
      this.steamMilk();
      return {
        shots,
        hasMilk: true,
      }
    }
  }

  class VanillaCoffeeMachine extends CoffeeMachine {
    private putVanillaSyrup(): void {
      console.log('바닐라 시럽을 넣습니다. 🍯');
    }

    protected extract(shots: number): CoffeeCup {
      this.putVanillaSyrup()
      return {
        shots,
        hasSyrup: true,
      }
    }
  }

  const machines: CoffeeMaker[] = [
    new LatteMachine(14, 'a-10'),
    new VanillaCoffeeMachine(14),
  ]

  machines.forEach(machine => {
    console.log(machine.makeCoffee(1));
  })
}
