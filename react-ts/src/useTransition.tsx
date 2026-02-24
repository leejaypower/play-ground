import { useState, useTransition, type ChangeEvent } from "react";

const ITEMS: string[] = Array.from({ length: 30000 }, (_, i) => `item-${i}`);

const MODE_DESC = {
  blocking: "input과 리스트 업데이트가 같은 우선순위. 리스트 렌더링이 끝날 때까지 input 반영이 블로킹됨.",
  transition: "리스트 업데이트를 낮은 우선순위로 분리. input은 즉시 반영되고 리스트는 여유 있을 때 업데이트됨.",
};

export default function App() {
  const [isPending, startTransition] = useTransition(); // <- 이 실험의 핵심개념!!!!!
  const [query, setQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState(ITEMS);
  const [mode, setMode] = useState<"blocking" | "transition">("blocking");

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setQuery(value); // <- input 업데이트

    const next = ITEMS.filter(item => item.includes(value));

    if (mode === "blocking") {
      setFilteredItems(next); // <- 리스트 필터링
    } else {
      startTransition(() => {
        setFilteredItems(next); // <- 리스트 필터링 (transition 레벨: 나중에 처리됨)  
      });
    }
  }

  return (
    <div>
      <div>
        {(["blocking", "transition"] as const).map(m => (
          <label key={m} style={{ marginRight: 16 }}>
            <input
              type="radio"
              value={m}
              checked={mode === m}
              onChange={() => { setMode(m); setQuery(""); setFilteredItems(ITEMS); }}
            />
            {" "}{m}
          </label>
        ))}
      </div>

      <p style={{ color: "gray", fontSize: 13 }}>{MODE_DESC[mode]}</p>

      <input
        value={query}
        onChange={handleChange}
        placeholder="검색어 입력"
      />

      <p>필터링 상태: {isPending ? "처리 중..." : "완료"}</p>
      <p>결과: {filteredItems.length.toLocaleString()} / {ITEMS.length.toLocaleString()}</p>

      <ul>
        {filteredItems.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}