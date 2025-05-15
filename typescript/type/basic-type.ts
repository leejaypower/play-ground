// ** 🧙‍♀️ 아는 다리도 두드려보고 건너기 - 기본 타입 복습 **

// 타입스크립트에서 자바스크립트 라이브러리를 사용하는 경우 쓰일 수 있지만
// 웬만하면 쓰지말자. 가능하면 구체적으로 타입을 지정해서 사용 
let notSure: unknown = 0;
let anything: any = 0;

// ✔️ 예상치 못한 에러가 발생했을 때 로그를 남기고 종료하는 경우 never를 쓸 수 있다.
// 함수가 절대 리턴되지 않는다는 것을 것을 명시하기 위해 주로 쓰인다.
function throwError(message: string): never {
  throw new Error(message);
}
// (never 타입은 error가 아니라 exception에 더 어울리는 타입 : 
// error는 개발자 실수로 발생하는 것이고, exception은 미처 예상치 못한 것에 가까움
// 예를 들어 switch문 안에서 절대로 default로 오지 말아야 하는 경우, 개발자들이 모든 case에 대해 코드를 구현하도록 강제 해야 하는 경우
// 이런 경우 never 타입을 사용할 수 있음 - 엄격한 타입 검사를 목적으로 명시하는 경우)


// ✔️ object 타입도 구체적인 타입이 아니기 때문에 쓰지 않는 것이 좋다.
let obj: object = {};

function add(num1: number, num2: number): number {
  return num1 + num2;
}

function fetchNum(id: string): Promise<number> {
  return new Promise((resolve, reject) => {
    resolve(100);
  })
}

// ✔️ Rest Parameter를 사용하면 인자 수와 상관없는 액션을 취할 수도 있다.
function addNumbers(...numbers: number[]): number {
  return numbers.reduce((acc, curr) => acc + curr, 0);
}
addNumbers(1, 2, 3, 4, 5);
addNumbers(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);


const stringArr: readonly string[] = ['hello', 'world'];
const numberArr: Array<number> = [1, 2, 3];

// ✔️ 언제 튜플을 사용해야할까?  tuple은 interface, type alias, class로 대체 가능 
const tuple: [number, string] = [1, 'hello'];
// 인덱스로 값을 접근한다면 가독성이 떨어진다..
tuple[0] // 1
tuple[1] // 'hello'

// 혹은 이렇게 사용하면 좀 더 낫긴 하다.
const [numberValue, stringValue] = tuple;
numberValue // 1
stringValue // 'hello'
// 이 형태를 보면 react의 useState가 생각남
// function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>] { ... }
// 무언가 동적으로 리턴할때 class나 interface로 묶기가 애매하고, 동적으로 관련있는 다른 타입의 데이터를 묶어서 사용할 경우 정도만 튜플이 유용해보임


// ✔️ Union
type Direction = 'left' | 'right' | 'up' | 'down';

function move(direction: Direction) {
  console.log(direction);
}

move('left');
move('right');

// ✔️ Intersection Type - 타입 교차
type Position = { x: number; y: number };
type Moved = { distance: number; direction: Direction };

type NewPosition = Position & Moved;

const newPosition: NewPosition = { x: 10, y: 20, distance: 10, direction: 'left' };

// ✔️ Enum
// 'javascript'에서 enum 대신 사용하는 방법
const MAX_NUM = 10;
const MAX_STUDENT_PER_CLASS = 30;
const MONDAY = 0;
const TUESDAY = 1;
const WEDNESDAY = 2;
const DAYS_ENUM = Object.freeze({
  MONDAY: 0,
  TUESDAY: 1,
  WEDNESDAY: 2,
});

// typescript
enum Days {
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY = 'thursday',
}
console.log(Days.MONDAY); // 0
console.log(Days.TUESDAY); // 1
console.log(Days.WEDNESDAY); // 2 ... 값이 자동으로 할당됨 => 값에 자동 증가가 필요할 때 enum 사용하면 좋다!
console.log(Days.THURSDAY); // 'thursday'

let day: Days = Days.MONDAY;
day = Days.TUESDAY;
day = 1; // 가능

// 🥊 enum VS as const VS const enum 
// enum : 런타임에 실제 객체로 존재함. 즉 값으로 해석될 수 있다. 단순한 상수를 정의하는 용도로는 as const보다 비효율적. 런타임에서 참조해야할 때 사용하는게 좋다.
// 컴파일 될 때 즉시 실행 함수(IIFE)로 바뀌게 되는데 성능에 영향을 줄 수 있다. tree shaking 불가.
// 아래와 같이 역방향 접근이 가능하다.
Days[2] // TUESDAY
Days[100] // undefined - 이렇게 해도 컴파일 에러는 발생하지 않는다!!

// as const: readonly 속성 자동 적용됨. 런타임에 영향 없음.

// const enum: 빌드 시 참조값만 남기 때문에 tree shaking이 된다.
// 역방향 접근 불가해서 enum의 해당 문제를 예방할 수 있다.
// 아래와 같은 문제가 있다.
const myDay: Days = 100; // Days에 100이 없지만 에러가 발생하지 않는다!!

// ✔️ type assertion
// 200% 타입을 장담할 수 있을 때 사용
function jsStrFunc(): any {
  return 'hello';
}

const result = jsStrFunc()!;
console.log((result as string).length);
console.log((<string>result).length);
console.log(result!.length);



