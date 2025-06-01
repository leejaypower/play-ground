import React, { useEffect, useState } from "react";

const numbers = [3, 7, 2, 10, 5];

// export default function FilterWithEffect() {
//   const [inputValue, setInputValue] = useState("");
//   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
//   const [visibleList, setVisibleList] = useState<number[]>([]);

//   // ❌ 지금 같은 경우에는 굳이 useEffect를 쓸 필요는 없음
//   useEffect(() => {
//     const filtered = numbers.filter((n) => {
//       if (inputValue === "") return true;
//       return n > Number(inputValue);
//     });

//     const sorted = [...filtered].sort((a, b) =>
//       sortOrder === "asc" ? a - b : b - a
//     );

//     setVisibleList(sorted);
//   }, [inputValue, sortOrder]); // 둘 중 하나라도 바뀌면 업데이트

//   return (
//     <div>
//       <input
//         type="number"
//         value={inputValue}
//         onChange={(e) => setInputValue(e.target.value)}
//         placeholder="숫자 입력"
//       />
//       <button
//         onClick={() =>
//           setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
//         }
//       >
//         {sortOrder === "asc" ? "내림차순 보기" : "오름차순 보기"}
//       </button>

//       <ul>
//         {visibleList.map((n) => (
//           <li key={n}>{n}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

export default function NumberFilterAndSort() {
  const [inputValue, setInputValue] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // 렌더할 때마다 계산: 필터링
  const filtered = numbers.filter((n) => {
    if (inputValue === "") {
      return true;
    }
    return n > Number(inputValue);
  });

  const sorted = [...filtered].sort((a, b) =>
    sortOrder === "asc" ? a - b : b - a
  );

  return (
    <div style={{ padding: "1rem", maxWidth: "400px" }}>
      <input
        type="number"
        placeholder="숫자 입력 (예: 4 → 4보다 큰 숫자만)"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        style={{ width: "100%", marginBottom: "0.5rem" }}
      />

      <button
        onClick={() =>
          setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
        }
        style={{
          marginBottom: "0.75rem",
          width: "100%",
          padding: "0.5rem",
          cursor: "pointer",
        }}
      >
        {sortOrder === "asc" ? "내림차순으로 보기" : "오름차순으로 보기"}
      </button>

      <ul style={{ paddingLeft: "1rem" }}>
        {sorted.map((num) => (
          <li key={num}>{num}</li>
        ))}
      </ul>
    </div>
  );
}
