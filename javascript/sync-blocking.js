// 블로킹 실험
const start = Date.now();
while (Date.now() - start < 5000) {
  // 5초 동안 블로킹
}
console.log('5초 후');
// 첫 렌더링조차 막힘


let count = 0;
function increment() {
  for (let i = 0; i < 10000; i++) {
    count++; // 이 연산은 중단되지 않는다. -> 원자성 보장
  }
}

increment();
increment();

console.log(count); // 싱글 스레드 - 20000이 보장된다.
// 읽기 -> 연산 -> 쓰기가 하나의 턴에서 완료!
// 다음 코드는 이 작업이 완전히 끝난 후 실행!


// html 실험용
function heavyComputation() {
  const arr = Array(10000000).fill(0);
  return arr.map((x) => x + 1).reduce((a, b) => a + b); // 긴 루프는 작업 분할로 개선해야한다. (청크 처리)
}


{
  // 만약 JS가 멀티스레드였다면...?
  // 스레드 A
  element.style.color = 'red';
  element.remove(); // DOM에서 제거

  // 스레드 B (동시 실행)
  element.style.fontSize = '20px'; // 이미 삭제된 노드에 접근?
  element.textContent = 'Hello';   // 에러 발생!


  // 다른 예시
  let count = 0;
  // 스레드 A
  count = count + 1;  // 1. count 읽기 (0) → 2. 연산 (0+1) → 3. 쓰기 (1)
  // 스레드 B (동시 실행)
  count = count + 1;  // 1. count 읽기 (0) → 2. 연산 (0+1) → 3. 쓰기 (1)
  // 결과: count = 1 (예상은 2)
}

{
  // js는 싱글 스레드이지만 비동기 요청의 순서 문제가 발생할 수 있다.
  let userData = null;

  async function fetchUser(id) {
    const response = await fetch(`/api/user/${id}`);
    userData = await response.json();
  }

  // 사용자가 빠르게 프로필 전환
  fetchUser(1);  // 요청 A
  fetchUser(2);  // 요청 B

  // 문제: 요청 B가 먼저 도착하면?
  // userData가 User 2 → User 1로 덮어써짐

  // why? 네트워크 요청은 백그라운드에서 병렬 처리
  // 응답 순서가 보장되지 않음(race condition 문제 발생)
}

{
  // 비동기 요청의 순서 문제를 해결하는 방법
  // "요청 취소 (AbortController)""
  let currentController = null;

  async function fetchUser(id) {
    if (currentController) {
      currentController.abort(); // 이전 요청 취소
    }

    currentController = new AbortController();
    const response = await fetch(`/api/user/${id}`, {
      signal: currentController.signal
    });
    userData = await response.json();
  }

  // 또는 시퀀스 번호 사용
  let latestRequestId = 0;

  async function fetchUser(id) {
    const requestId = ++latestRequestId;
    const response = await fetch(`/api/user/${id}`);
    const data = await response.json();

    // 최신 요청만 반영
    if (requestId === latestRequestId) {
      userData = data;
    }
  }
}