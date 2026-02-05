// ** 렉시컬(lexical) 스코프: 코드가 "작성된 위치"에서 결정되는 상위 스코프 **
// - 클로저가 동작하는 기반
let x = 1;

function first() {
  let x = 10;
  second(); // 2를 출력
}

function second() {
  console.log(x); // 전역의 x를 참조 (선언된 위치가 중요)
}

first();

// ** 클로저 **
function outer() {
  const value = 'outer value';
  return function inner() {
    console.log(value); // 클로저로 인해 outer의 value에 접근 가능
  };
}

// ** 클로저와 렉시컬 환경 **
// 렉시컬 환경 = 현재 스코프 + 상위 스코프(렉시컬 스코프) 참조
function makeCounter() {
  let count = 0; // 이 변수는 반환된 함수의 렉시컬 환경에 포함됨

  return function () {
    return count++; // 외부 함수의 변수에 접근 가능
  };
}

const counter = makeCounter();
console.log(counter()); // 0
console.log(counter()); // 1

function createFamily() {
  let familyName = '김'; // 렉시컬 환경에 저장

  return {
    // 화살표 함수의 this와 렉시컬 환경은 다른 개념
    getFamilyName: () => {
      return familyName; // 렉시컬 환경에서 familyName을 찾음
    },

    // 클로저를 통한 private 변수 구현
    setFamilyName: (newName) => {
      familyName = newName;
    },
  };
}

const family = createFamily();
console.log(family.getFamilyName()); // "김"

family.setFamilyName('이'); // 클로저: 선언된 시점에 있는 환경을 기억함. 즉 이 함수가 선언된 시점에 있는 name을 기억함.
console.log(family.getFamilyName()); // "이"

{
  // 실험 1: var는 블록을 무시
  function test1() {
    if (true) {
      var x = 1;
    }
    console.log(x);  // 1 
  }

  // // 실험 2: let은 블록에 갇힘
  function test2() {
    if (true) {
      let y = 2;
    }
    console.log(y);  // Error
  }

  test1();
  test2();

  // 실험 3: for문의 var
  for (var i = 0; i < 3; i++) {
    // var는 참조만 저장하고 값은 나중에 읽는다.
    setTimeout(() => console.log('var:', i), 100);
  }
  console.log('after loop:', i);  // 3

  // 실험 4: for문의 let
  for (let j = 0; j < 3; j++) {
    // let은 값이 스냅샷처럼 고정된다.
    setTimeout(() => console.log('let:', j), 100);
  }
  console.log('after loop:', j); // Error
}