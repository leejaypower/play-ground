{
  function identity<T>(arg: T): T {
    return arg;
  }

  type User = {
    id: string;
    name: string;
  };

  const num = identity<number>(42); // T = number
  const str = identity<string>('hello'); // T = string
  const user = identity<User>({ id: '1', name: '이제이' }); // T = User

  // 타입 추론을 사용하면 타입을 명시적으로 지정하지 않아도 된다. -> 최대한 ts가 알아서 하도록 만들자
  const typeInferred = identity(10); // T = number
  const typeInferred2 = identity('hello'); // T = string
  const typeInferred3 = identity({ id: '1', name: '이제이' }); // T = User

  // ==== 제네릭 기본 예제 ====
  // ❌ 타입 안전하지 않은 코드
  function checkNotNullBad(arg: any): any {
    if (arg == null) {
      throw new Error('not valid');
    }
    return arg;
  }

  // ✅ 타입 안전한 코드 : generic 타입을 사용
  function checkNotNull<T>(arg: T): T {
    if (arg == null) {
      throw new Error('not valid');
    }
    return arg;
  }
}

{
  // ==== class에서 generic ====
  interface Either<L, R> {
    left(): L;
    right(): R;
  }

  class SimpleEither<L, R> implements Either<L, R> {
    constructor(
      private leftValue: L,
      private rightValue: R
    ) {}

    left(): L {
      return this.leftValue;
    }

    right(): R {
      return this.rightValue;
    }

    isLeft(): boolean {
      return this.leftValue !== null;
    }
  }

  // ==== 제네릭에 조건걸기 (extends) ====
  interface Employee {
    pay(): void;
  }

  class FullTimeEmployee implements Employee {
    pay(): void {
      console.log('full time');
    }

    workFullTime() {
      console.log('working a lot');
    }
  }

  class PartTimeEmployee implements Employee {
    pay(): void {
      console.log('part time');
    }

    workPartTime() {
      console.log('working part time');
    }
  }

  // ❌ "세부적인 타입"을 받아서 추상적인 타입으로 리턴하는 것은 좋지 않다.
  function payBad(employee: Employee): Employee {
    employee.pay();
    return employee;
  }

  // ✅ 제네릭에 조건을 걸어서 좀 더 제한적인 범위 내에서 사용할 수 있다.
  function payGood<T extends Employee>(employee: T): T {
    employee.pay();
    return employee;
  }

  const jay = new FullTimeEmployee();
  const hyeon = new PartTimeEmployee();
  jay.workFullTime();
  hyeon.workPartTime();

  // const jayAfterPay = payBad(jay);
  // const hyeonAfterPay = payBad(hyeon);
  // jayAfterPay.workFullTime(); // 에러

  const jayAfterPay = payGood(jay);
  const hyeonAfterPay = payGood(hyeon);
  jayAfterPay.workFullTime();
  hyeonAfterPay.workPartTime();

  const me = {
    name: 'jay',
    age: 29,
  };

  const friend = {
    name: 'hyeon',
    age: 30,
  };

  // obj의 key인 속성만 올 수 있다고 강제, 그리고 그 obj[key]의 값을 리턴한다
  function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
  }

  console.log(getValue(me, 'name'));
  console.log(getValue(friend, 'age'));
}
