// 콜백 베이스 비동기 함수 만들기 + 그것을 Promise로 전환하는 promisify 작성

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
  return (num1, num2) => { // 범용화하려면 return (...args)=> {} 으로 일반화해야함
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
  .then(res => console.log(res))       // 3
  .catch(err => console.error(err));

