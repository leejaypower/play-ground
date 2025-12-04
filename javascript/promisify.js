// ** 다양한 비동기 패턴(콜백, 이벤트, Promise)이 혼재하면 코드 일관성이 깨진다.
// Promisify를 통해 모든 비동기를 Promise로 통일하면 async/await로 동기 코드처럼 읽기 쉽게 작성할 수 있다.
// + .then() 체이닝 가능, async/await 사용 가능, Promise.all()로 병렬 처리 가능, 에러 처리가 try/catch로 일관됨

// ** 예시 1. 콜백 기반 - 체이닝 불가
{
  setTimeout(() => {
    console.log('1초 후');
    setTimeout(() => {
      console.log('또 1초 후');
      // 계속 중첩...
    }, 1000);
  }, 1000);

  // Promise로 래핑
  const delay = (ms) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(); // Promise를 "완료" 상태로 만듦
      }, ms);
    });
  };
  // 축약하면
  const delay2 = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  async function animate() {
    await delay(1000);
    console.log('1초 후');
    await delay(1000);
    console.log('또 1초 후');
  }
}

// ** 예시 2. Geolocation API - 콜백 기반
{
  navigator.geolocation.getCurrentPosition(
    (position) => {
      /* 성공 */
    },
    (error) => {
      /* 실패 */
    }
  );

  // Promisify
  const getPosition = () =>
    new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

  // 이제 async/await 가능!
  const position = await getPosition();
}

// ** 예시 3. 이벤트 기반
{
  const reader = new FileReader();
  reader.onload = (e) => {
    /* 결과 처리 */
  };
  reader.onerror = (e) => {
    /* 에러 처리 */
  };
  reader.readAsText(file);

  // Promisify
  const readFileAsText = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });

  // 깔끔하게 사용
  const text = await readFileAsText(file);
}

// ** 예시 4.  예전 라이브러리가 콜백 패턴을 쓴다면
{
  // legacyLibrary.doSomething(data, (err, result) => { ... });
  // // promisify로 감싸서 현대적으로 사용
  // const doSomethingAsync = promisify(legacyLibrary.doSomething);
  // const result = await doSomethingAsync(data);
}

// ** 콜백 베이스 비동기 함수 만들기 + 그것을 Promise로 전환하는 promisify 작성
function getSumAsync(a, b, callback) {
  setTimeout(() => {
    if (typeof a !== 'number' || typeof b !== 'number') {
      return callback(new Error('잘못된 파라미터'), null);
    }
    callback(null, a + b);
  }, 500);
}

function getProductAsync(x, y, callback) {
  setTimeout(() => {
    if (typeof x !== 'number' || typeof y !== 'number') {
      return callback(new Error('잘못된 파라미터'), null);
    }
    callback(null, x * y);
  }, 300);
}

const promisify = (fn) => {
  // 범용화하려면 return (...args)=> {} 으로 일반화해야함
  return (num1, num2) => {
    return new Promise((resolve, reject) => {
      fn(num1, num2, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  };
};

const sumPromise = promisify(getSumAsync);
// sumPromise(1, 2) → Promise<3>
sumPromise(1, 2)
  .then((res) => console.log(res)) // 3
  .catch((err) => console.error(err));
