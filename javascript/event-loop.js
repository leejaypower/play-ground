{
  console.log('1');

  setTimeout(() => {
    console.log('4'); // setTimeout이 0초인데, then보다 늦게 실행되는 이유는?
  }, 0);

  Promise.resolve().then(() => {
    console.log('3');
  });

//   console.log('2');
}

{
  console.log('script start');

  setTimeout(() => {
    console.log('setTimeout 1');
  }, 0);

  Promise.resolve()
    .then(() => {
      console.log('promise 1');
    })
    .then(() => {
      console.log('promise 2');
    });

  setTimeout(() => {
    console.log('setTimeout 2');
    Promise.resolve().then(() => {
      console.log('promise in setTimeout');
    });
  }, 0);

  Promise.resolve().then(() => {
    console.log('promise 3');
  });

  console.log('script end');

  // 실행 순서
  // script start
  // script end
  // promise 1
  // promise 3
  // promise 2
  // setTimeout 1
  // setTimeout 2
  // promise in setTimeout

  // Microtask는 Task보다 우선순위가 높다
}

{
  console.log('1');

  setTimeout(() => console.log('2'), 0);

  async function test() {
    console.log('3');
    await Promise.resolve();
    console.log('4');
  }

  test();

  Promise.resolve().then(() => console.log('5'));

  console.log('6');

  // await 이후 코드는 어디로 가는가?
  // 실행순서: 1 -> 3 -> 6 -> 5 -> 4 -> 2 라고 예상했지만
  // 실제 실행순서: 1 -> 3 -> 6 -> 4 -> 5 -> 2 이다.
  // 이미 실행한 작업과 논리적으로 연결된 작업이기 때문에 먼저 완료한다. 
  // Promise.resolve() 다음 코드는 .then처럼 동작한다고 이해하면 된다.
}

{
  // 헷갈리는 케이스
  // Promise 안에 setTimeout
  Promise.resolve().then(() => {
    console.log('A'); // Microtask
    setTimeout(() => {
      console.log('B'); // Task (나중에)
    }, 0);
    console.log('C'); // 동기 (A 바로 다음)
  });
  // 실행순서: A -> C -> B


  // setTimeout 안에 Promise
  setTimeout(() => {
    console.log('A'); // Task
    Promise.resolve().then(() => {
      console.log('B'); // Microtask (A 다음)
    });
    console.log('C'); // 동기 (A 바로 다음)
  }, 0);
  // 순서: A → C → B
  // A, C는 같은 Task 안의 동기 코드, B는 Microtask로 추가됨 → Call Stack 비면 바로 실행

  // async/await
  async function test() {
  console.log('1'); // 동기
  
  await Promise.resolve();
  console.log('2'); // Microtask
  
  await Promise.resolve();
  console.log('3'); // Microtask (2 다음)
  }

  test();
  console.log('4'); // 동기
  // 실행순서: 1 -> 4 -> 2 -> 3
  // `await` 이후 코드는 `.then()` 안에 있는 것처럼 동작
  // 각 `await`마다 새로운 Microtask 생성
}