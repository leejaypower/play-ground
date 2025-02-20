// ** 렉시컬 스코프 **
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
  const value = "outer value";
  return function inner() {
    console.log(value); // 클로저로 인해 outer의 value에 접근 가능
  };
}


// ** 클로저와 렉시컬 환경 **
function makeCounter() {
    let count = 0;  // 이 변수는 반환된 함수의 렉시컬 환경에 포함됨
    
    return function() {
      return count++;  // 외부 함수의 변수에 접근 가능
    };
}

const counter = makeCounter();
console.log(counter()); // 0
console.log(counter()); // 1

function createFamily() {
    let familyName = "김";  // 렉시컬 환경에 저장
    
    return {
        // 화살표 함수의 this와 렉시컬 환경은 다른 개념
        getFamilyName: () => {
            return familyName;  // 렉시컬 환경에서 familyName을 찾음
        },
        
        // 클로저를 통한 private 변수 구현
        setFamilyName: (newName) => {
            familyName = newName;
        }
    };
}

const family = createFamily();
console.log(family.getFamilyName()); // "김"

family.setFamilyName("이"); // 클로저: 선언된 시점에 있는 환경을 기억함. 즉 이 함수가 선언된 시점에 있는 name을 기억함.
console.log(family.getFamilyName()); // "이"