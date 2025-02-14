{
  // ** 절차적 프로그래밍으로 커피 머신 만들어 보기
  type CoffeeCup = {
    shots: number;
    hasMilk: boolean;
  };

  interface HomeCoffeeMaker {
    makeCoffee(shots: number): CoffeeCup;
  }

  interface CafeCoffeeMaker {
    makeCoffee(shots: number): CoffeeCup;
    fillCoffeeBeans(beans: number): void;
    clean(): void;
  }

  // CoffeeMaker, CommercialCoffeeMaker라는 규격을 따르는(implements), 구현하는 CoffeeMachine 클래스
  class CoffeeMachine implements HomeCoffeeMaker, CafeCoffeeMaker {
    private static BEANS_GRAM_PER_SHOT: number = 7; // *class level
    // #BEANS_GRAM_PER_SHOT: number = 7; 이렇게도 가능 (es2019)

    // protected : 상속받은 클래스에서 접근 가능
    protected _myCoffeeBeans: number = 0;

    constructor(
      // ts에서는 생성자에서 public, private, readonly 를 사용하면 자동으로 할당되서 보일러 플레이트(set...) 줄일 수 있다.
      private coffeeBeans: number = 0 // *instance level
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
      // 명시 안하면 public
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
        console.log(this._myCoffeeBeans, shots * CoffeeMachine.BEANS_GRAM_PER_SHOT);
        throw new Error("커피콩이 부족합니다!");
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

  const machine = new CoffeeMachine(100);
  const machine2 = CoffeeMachine.makeMachine(200);
  const machine3: CoffeeMachine = CoffeeMachine.makeMachine(300);
  
  // 인터페이스를 이용하면 어떤 행동까지만 허용할건지 제한할 수 있고 보장할 수 있다.
  const machine4: HomeCoffeeMaker = CoffeeMachine.makeMachine(400);
  // machine4.makeCoffee(1);
  // machine4.fillCoffeeBeans(1); // 오류 발생

  const machine5: CafeCoffeeMaker = CoffeeMachine.makeMachine(1000);
  class HomeUser {
    constructor(private machine: HomeCoffeeMaker) {}

    makeCoffee() {
      const coffee = this.machine.makeCoffee(1);
      console.log(coffee);
    }
  }

  class BaristaUser {
    constructor(private machine: CafeCoffeeMaker) {}

    makeCoffee() {
      const coffee = this.machine.makeCoffee(1);
      console.log(coffee);
      this.machine.fillCoffeeBeans(1);
      this.machine.clean();
    }
  }

  const homeUser = new HomeUser(machine4);
  const barista = new BaristaUser(machine5);

  homeUser.makeCoffee();
  barista.makeCoffee();
}
