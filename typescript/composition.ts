// 상속의 문제점: 수직적인 관계 - 부모 클래스에 의존하는 관계
// js는 클래스의 다중 상속을 직접적으로 지원하지 않는다. 즉, "하나의 클래스는 오직 하나의 부모 클래스만 갖는다."
// 상속의 대안: **Composition (조합)**
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

  interface syrupProvider {
    addVanillaSyrup(cup: CoffeeCup): CoffeeCup;
  }

  interface milkProvider {
    addMilk(cup: CoffeeCup): CoffeeCup;
  }


  class CoffeeMachine implements CoffeeMaker, CafeCoffeeMaker {
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

    static makeMachine(coffeeBeans: number) {
      return new CoffeeMachine(coffeeBeans);
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

    private extract(shots: number): CoffeeCup {
      console.log(`커피를 추출합니다... 🫖`);
      return {
        shots,
        hasMilk: false,
      };
    }

    makeCoffee(shots: number): CoffeeCup {
      this.grindBeans(shots);
      this.preheat();
      return this.extract(shots);
    }

    clean() {
      console.log('🧼 🫧 🧴');
    }
  }

  class MilkSteamer {
    private steamMilk(): void {
      console.log('우유 거품을 부어 넣습니다. 🥛');
    }

    addMilk(cup: CoffeeCup) {
      this.steamMilk();
      return {
        ...cup,
        hasMilk: true,
      }
    }
  }

  class FancyMilkSteamer {
    private steamMilk(): void {
      console.log('고오오오급 우유 거품을 더 부드럽게 부어 넣습니다. 🥛🥛');
    }

    addMilk(cup: CoffeeCup) {
      this.steamMilk();
      return {
        ...cup,
        hasMilk: true,
      }
    }
  }

  class VanillaSyrupMixer {
    private getVanillaSyrup(): boolean {
      console.log(`바닐라 파우더와 설탕으로 시럽을 만듭니다...🧂🥣`)
      return true;
    }

    addVanillaSyrup(cup: CoffeeCup) {
      const syrup = this.getVanillaSyrup();
      return {
        ...cup,
        hasSyrup: syrup
      }
    }
  }

  class VanillaBeanSyrupMixer {
    private getVanillaSyrup(): boolean {
      console.log(`바닐라 빈을 추출하여 고급 바닐라 시럽을 만듭니다...🫛🥣🍨`)
      return true;
    }

    addVanillaSyrup(cup: CoffeeCup) {
      const syrup = this.getVanillaSyrup();
      return {
        ...cup,
        hasSyrup: syrup
      }
    }
  }


  class LatteMachine extends CoffeeMachine {
    constructor(
      private beans: number,
      public readonly serialNumber: string,
      // DI (Dependency Injection)
      private milkSteamer: MilkSteamer) {
      super(beans);
    }

    makeCoffee(shots: number): CoffeeCup {
      const coffee = super.makeCoffee(shots);
      const latte = this.milkSteamer.addMilk(coffee)

      return latte;
    }
  }

  class VanillaCoffeeMachine extends CoffeeMachine {
    constructor(private beans: number,
      public readonly serialNumber: string,
      // DI (Dependency Injection) - 생성자 주입
      private vanillaSyrupMixer: VanillaSyrupMixer) {
      super(beans);
    }

    makeCoffee(shots: number): CoffeeCup {
      const coffee = super.makeCoffee(shots);
      const vanillaCoffee = this.vanillaSyrupMixer.addVanillaSyrup(coffee);
      return vanillaCoffee;
    }
  }

  class VanillaLatteMachine extends CoffeeMachine {
    constructor(
      private beans: number,
      public readonly serialNumber: string,
      // 인터페이스를 통해 클래스 간의 타이트한 의존성을 decoupling한다.
      private milk: milkProvider,
      private syrup: syrupProvider) {
      super(beans);
    }

    makeCoffee(shots: number): CoffeeCup {
      const coffee = super.makeCoffee(shots);
      const latte = this.milk.addMilk(coffee)
      const vanillaLatte = this.syrup.addVanillaSyrup(latte);

      return vanillaLatte;
    }
  }

  // milk
  const milkMaker = new MilkSteamer();
  const fancyMilkMaker = new FancyMilkSteamer();

  const vanillaSyrupMixer = new VanillaSyrupMixer();
  const vanillaBeanSyrupMixer = new VanillaBeanSyrupMixer();

  const vanillaLatteMachine = new VanillaLatteMachine(23, "1234567890", milkMaker, vanillaSyrupMixer);
  const expensiveVanillaLatteMachine = new VanillaLatteMachine(23, "1234567890", fancyMilkMaker, vanillaBeanSyrupMixer);
}


