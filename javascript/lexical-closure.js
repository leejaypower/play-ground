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

{
  // ** 클로저와 이벤트 핸들러 **
  function attachHandlers() {
    const items = ['A', 'B', 'C'];
    const container = document.getElementById('list');

    items.forEach((item, index) => {
      const li = document.createElement('li');
      li.textContent = item;

      // 클릭 리스너가 items를 직접 참조하지 않아도 스코프 체인상 접근 가능한 모든 변수가 클로저에 포함될 가능성이 있다.
      li.addEventListener('click', function () {
        console.log(`Clicked: ${item}, index: ${index}`);
      });

      container.appendChild(li);
    });
  }


  // 여기서 forEach는 사실상 이렇게 동작:
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const index = i;

    // 콜백 함수 실행 (새로운 스코프)
    {
      const li = document.createElement('li');
      li.textContent = item;

      li.addEventListener('click', function () {
        console.log(item, index);
      });
    }
  }

  // 실제로 items가 포함되는지 확인
  function test1() {
    const items = ['A', 'B', 'C'];

    items.forEach((item) => {
      const btn = document.createElement('button');

      btn.addEventListener('click', function () {
        console.log(item);
        console.log(items);  // ← 명시적 참조
      });
    });
  }

  test1();


  // 명시적 참조 안함 -> 엔진이 최적화로 제거? 대부분의 경우 안전을 위해 items가 클로저에 포함될 가능성이 있다.
  function test2() {
    const items = ['A', 'B', 'C'];

    items.forEach((item) => {
      const btn = document.createElement('button');

      btn.addEventListener('click', function () {
        console.log(item);  // items 참조 안 함
      });
    });
  }

  test2();


  // 최적화: 이벤트 위임
  function attachHandlers2() {
    const items = ['A', 'B', 'C'];
    const container = document.getElementById('list');

    // HTML 먼저 생성
    items.forEach((item, index) => {
      const li = document.createElement('li');
      li.textContent = item;
      li.dataset.index = index;  // data-index 속성
      container.appendChild(li);
    });

    // 리스너는 단 하나!
    container.addEventListener('click', function (e) {
      if (e.target.tagName === 'LI') {
        const index = e.target.dataset.index;
        const item = items[index];
        console.log(`Clicked: ${item}, index: ${index}`);
      }
    });
  }

  // 최적화: WeakMap을 사용하여 메모리 최적화
  function attachHandlers3() {
    const items = ['A', 'B', 'C'];
    const container = document.getElementById('list');
    const itemMap = new WeakMap();  // 약한 참조

    items.forEach((item, index) => {
      const li = document.createElement('li');
      li.textContent = item;

      itemMap.set(li, { item, index });  // 요소와 데이터 매핑

      li.addEventListener('click', function () {
        const data = itemMap.get(this);
        console.log(data.item, data.index);
      });

      container.appendChild(li);
    });
  }
}