{
  // Promise의 진짜 힘: 나중에 원하는 때 사용 가능!
  const userPromise = fetch('/api/user/1');
  setTimeout(() => {
    userPromise.then((res) => console.log(res));
  }, 5000);

  // 여러 곳에서 재사용 가능! - 이런걸 할 일은 없겠지만...(그냥 체이닝하면 됨)
  userPromise.then((res) => updateUI(res));
  userPromise.then((res) => logAnalytics(res));

  // async/await는 즉시 소비
  async function foo() {
    const user = await fetch('/api/user/1'); // 여기서 바로 대기
  }

  // Promise는 나중에
  function foo() {
    const userPromise = fetch('/api/user/1'); // 저장만
    // 원하는 때 사용
    return userPromise;
  }

  // async 함수도 Promise를 반환하긴함
  async function fetchUser() {
    const res = await fetch('/api/user/1');
    return res.json();
  }

  const userPromise2 = fetchUser();
  console.log(userPromise2); // Promise {<pending>}

  // 여러 번 then 가능 - 이런걸 할 일은 없겠지만...
  userPromise2.then((user) => console.log('첫 번째:', user));
  userPromise2.then((user) => console.log('두 번째:', user));
  userPromise2.then((user) => console.log('세 번째:', user));

  // await도 나중에 사용할 수 있긴 한데??
  const promise = foo();
  setTimeout(() => {
    promise.then((user) => console.log(user));
  }, 5000);

  async function fetchUser() {
    const res = await fetch('/api/user/1');
    return res.json();
  }

  const userPromise3 = fetchUser();

  setTimeout(async () => {
    const user = await userPromise3;
    console.log(user);
  }, 5000);

  // 동시에 다른 곳에서도
  userPromise3.then((user) => updateUI(user));

  // ** 프로미스랑 차이점???????
  // async 함수 내부에서의 유연성이 다르다
  async function loadData() {
    const data = await fetch('/api/data').then((r) => r.json());

    // 이미 await 했음 - Promise가 아니라 값
    // 다른 곳에 전달하려면?
    updateUI(data); // 값 전달

    return data; // 값 반환 (Promise로 자동 래핑됨)
  }

  // Promise 체이닝 - Promise를 계속 전달 가능
  function loadData() {
    const promise = fetch('/api/data').then((r) => r.json());

    // Promise 자체를 전달
    promise.then((data) => updateUI(data));

    return promise; // Promise 그대로 반환
  }

  // ** async 함수 - 재사용 불가
  async function loadDashboard() {
    const user = await fetch('/api/user/1').then((r) => r.json());

    // user는 값, 다시 await 불가
    updateHeader(user);
    updateSidebar(user);

    // 만약 나중에 또 필요하면? 이미 소비됨
  }

  // ** Promise 체이닝 - 재사용 가능
  function loadDashboard() {
    const userPromise = fetch('/api/user/1').then((r) => r.json());

    // Promise를 여러 번 소비
    userPromise.then((user) => updateHeader(user));
    userPromise.then((user) => updateSidebar(user));

    // 나중에도 가능
    setTimeout(() => {
      userPromise.then((user) => logAnalytics(user));
    }, 5000);

    return userPromise;
  }

  // async 함수 - await는 무조건 대기
  async function loadData(userId) {
    const user = await fetch(`/api/users/${userId}`).then((r) => r.json());
    // 여기까지 왔으면 user는 이미 값
    // 조건부로 대기할 수 없음

    if (user.isPremium) {
      const premium = await fetch(`/api/premium/${user.id}`).then((r) =>
        r.json()
      );
      return { user, premium };
    }

    return { user };
  }

  // Promise - 조건부 대기 가능
  function loadData(userId) {
    const userPromise = fetch(`/api/users/${userId}`).then((r) => r.json());

    // Promise 상태로 조건 확인
    return userPromise.then((user) => {
      if (user.isPremium) {
        const premiumPromise = fetch(`/api/premium/${user.id}`).then((r) =>
          r.json()
        );
        return premiumPromise.then((premium) => ({ user, premium }));
      }
      return { user };
    });
  }

  // 👑👑👑👑 즉 !! 함수 내부에서 promise를 다룰 수 있는지 아닌지에 대한 차이
  async function foo() {
    const data = await promise;
    // ↑ 함수 내부에서 await 하는 순간
    //   Promise → 값으로 변환
    //   이후 재사용 불가

    return data; // 값 반환 (Promise로 래핑됨)
  }

  const finalResult = foo(); // Promise
  // 함수 밖에서는 Promise로 다룰 수 있음

  // Promise 체이닝
  function bar() {
    const promise = fetch('/api/data');

    // 함수 내부에서도 Promise 유지
    promise.then((data) => doSomething(data));
    promise.then((data) => doOtherThing(data));

    return promise; // Promise 그대로 반환
  }

  const finalResult2 = bar(); // Promise
  // 함수 밖에서도 Promise
  // 함수 안에서도 Promise
}

// ===== async/await이 아니라 promise 체인을 쓰기 좋은 예제 - Promise 캐싱 =====
class UserService {
  constructor() {
    this.cache = new Map();
  }

  getUser(id) {
    // Promise 자체를 캐싱!
    if (!this.cache.has(id)) {
      this.cache.set(
        id,
        fetch(`/api/users/${id}`).then((r) => r.json())
      );
    }

    return this.cache.get(id); // Promise 반환
  }

  // async/await 으로는 중복 요청 발생됨
  async getUser2(id) {
    if (this.cache.has(id)) {
      return this.cache.get(id);
    }

    const user = await fetch(`/api/users/${id}`).then((r) => r.json()); //
    this.cache.set(id, user); // 값이 넣어져버림
    return user;
  }
}

const service = new UserService();
// 첫 호출 - 네트워크 요청
service.getUser(1).then((user) => console.log(user));
// 두 번째 호출 - 같은 Promise 반환 (중복 요청 없음!)
service.getUser(1).then((user) => console.log(user));

// ===== Promise 지연 실행 예제 =====
function createLazyPromise(fn) {
  let promise = null;

  return () => {
    if (!promise) {
      promise = Promise.resolve().then(fn);
    }
    return promise;
  };
}

// 사용
const lazyUser = createLazyPromise(() =>
  fetch('/api/user/1').then((r) => r.json())
);

// 필요할 때만 실행
button.addEventListener('click', () => {
  lazyUser().then((user) => console.log(user));
});

// Promise들을 값으로 조합
function fetchDashboard(userId) {
  const userPromise = fetch(`/api/users/${userId}`).then((r) => r.json());
  const postsPromise = fetch(`/api/posts/${userId}`).then((r) => r.json());
  const followersPromise = fetch(`/api/followers/${userId}`).then((r) =>
    r.json()
  );

  // 각각 필요한 곳에서 사용
  userPromise.then((user) => updateHeader(user));
  postsPromise.then((posts) => updateFeed(posts));

  // 전체 조합도 가능
  return Promise.all([userPromise, postsPromise, followersPromise]).then(
    ([user, posts, followers]) => ({ user, posts, followers })
  );
}
