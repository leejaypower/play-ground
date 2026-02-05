// for 문은 블록 스코프인가? 경우에 따라 다르다.
for (let i = 0; i < 3; i++) {
  console.log(i);
}

// 사실상 이렇게 동작:
{
  let i;  // for문 전체를 감싸는 외부 스코프

  i = 0;
  if (i < 3) {
    { // 첫 번째 반복 블록
      let i = 0;  // 외부 i를 복사한 새로운 i
      console.log(i);
    }
    i++;
  }

  if (i < 3) {
    { // 두 번째 반복 블록
      let i = 1;  // 외부 i를 복사한 새로운 i
      console.log(i);
    }
    i++;
  }

  if (i < 3) {
    { // 세 번째 반복 블록
      let i = 2;  // 외부 i를 복사한 새로운 i
      console.log(i);
    }
    i++;
  }
}