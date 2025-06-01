import { useState } from "react";

interface TodoItem {
  id: string;
  value: string;
}

// export default function TodoList() {
//   const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
//   const [searchValue, setSearchValue] = useState<string>("");

//   const addTodoItem = () => {
//     setTodoItems((prev) => [
//       ...prev,
//       {
//         id: todoItems.length + 1,
//         value: searchValue,
//       },
//     ]);
//   };

//   const removeTodoItem = (id: number) => {
//     const updatedTodoItems = todoItems.filter((item) => item.id !== id);
//     setTodoItems(updatedTodoItems);
//   };
//   return (
//     <section>
//       <h1>Todo List</h1>
//       <input
//         type="text" !!!value props 빼먹음
//         placeholder="오늘은 무엇을 해야하나요?"
//         onChange={(event) => setSearchValue(event.target.value)}
//         // onKeyUp과 onClick에서 같은 함수를 호출하면, 엔터 입력 시 두 번 실행될 수 있다.
//         // onKeyUp={(event) => {
//         //   if (event.key === "Enter") {
//         //     addTodoItem();
//         //   }
//         // }}
//       />
//       <button onClick={addTodoItem}>추가</button>
//       {todoItems.length === 0 ? (
//         <p>오늘 할 일이 없어요.</p>
//       ) : (
//         <ul> // ul 아래에는 무조건 li가 와야한다. 시맨틱하게~ 이거 에러 안잡네
//           {todoItems.map((item: TodoItem) => (
//             <div key={item.id}>
//               <li>{item.value}</li>
//               <button onClick={() => removeTodoItem(item.id)}>삭제</button>
//             </div>
//           ))}
//         </ul>
//       )}
//     </section>
//   );
// }

export default function TodoList() {
  const [todoItems, setTodoItems] = useState<TodoItem[]>([]);
  const [inputValue, setInputValue] = useState("");

  const addTodoItem = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      return;
    }

    setTodoItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(), // type이 string 이다.
        value: trimmed,
      },
    ]);
    setInputValue("");
  };

  const removeTodoItem = (id: string) => {
    setTodoItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <section>
      <h1>Todo List</h1>
      <input
        type="text"
        placeholder="오늘은 무엇을 해야하나요?"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyUp={(e) => {
          if (e.key === "Enter") addTodoItem();
        }}
      />
      <button onClick={addTodoItem}>추가</button>

      {todoItems.length === 0 ? (
        <p>오늘 할 일이 없어요.</p>
      ) : (
        <ul>
          {todoItems.map((item) => (
            <li key={item.id}>
              {item.value}{" "}
              <button onClick={() => removeTodoItem(item.id)}>삭제</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
