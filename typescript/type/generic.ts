{
  // Generic : 일반적인 것, 즉 일반화된 데이터 타입!
  // 함수, 타입, 클래스 등에서 내부적으로 사용될 타입을 미리 정해두지 않고 "타입 변수"를 사용해 그 자리를 비워둔 다음에 
  // 실제로 그 값을 사용할 때 외부에서 타입 변수 자리에 타입을 지정하여 사용하는 방식
  // 외부에서 값을 생성할 때 제네릭을 이용해 원하는 타입으로 특정할 수 있다.
  // 코드의 재사용성을 높이고 타입 추론을 하는데 사용한다. (아래의 예시를 보면 바로 와닿음)
  export interface ApiResponseData<Data> {
    data: Data;
    statusCode: string;
    statusMessage?: string;
  }

  export const fetchPrice = (): Promise<ApiResponse<Price>> = {
    // ...
  }
  export const fetchOrder = (): Promise<ApiResponse<Order>> = {
    // ...
  }
}

{
  // ❌ 타입 안전하지 않은 코드
  function checkNotNullBad(arg: any): any {
    if (arg == null) {
      throw new Error('not valid');
    }
    return arg;
  }

  // ✅ 타입 안전한 코드 : generic 타입을 사용 
  // 참고로 tsx에서는 화살표 함수에서 제네릭을 사용하면 에러가 발생한다(제네릭 꺾쇠와 element tag 꺾쇠와 혼동)
  // extends 키워드를 사용하면 되긴 하지만 보통 제네릭을 사용할 때는 function 키워드로 선언한다.
  function checkNotNull<T>(arg: T): T {
    if (arg == null) {
      throw new Error('not valid');
    }
    return arg;
  }


  // ==== class에서 generic ====  
  interface Either<L, R> {
    left(): L;
    right(): R;
  }

  class SimpleEither<L, R> implements Either<L, R> {
    constructor(private leftValue: L, private rightValue: R) { }

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



  // ==== 제네릭 조건 ====
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
  // 이를 위해서 특정 타입을 상속해야한다.
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
  }

  const friend = {
    name: 'hyeon',
    age: 30,
  }

  // obj의 key인 속성만 올 수 있다고 강제, 그리고 그 obj[key]의 값을 리턴한다
  function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
  }

  console.log(getValue(me, 'name'));
  console.log(getValue(friend, 'age'));
}
