import { useState } from "react";

const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
  { id: 4, name: "David" },
  { id: 5, name: "Eve" },
];

function Filter() {
  const [filteredUsers, setFilteredUsers] = useState<
    | {
        id: number;
        name: string;
      }[]
    | undefined
  >(undefined);

  const handleFilterUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    if (!value) {
      setFilteredUsers(undefined);
      return;
    }

    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredUsers(filtered);
  };

  return (
    <div>
      <input
        placeholder="유저 이름을 입력하세요"
        onChange={handleFilterUser}
      ></input>
      <section>
        <h3>전체 유저</h3>
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3>검색 결과</h3>
        {!filteredUsers?.length ? (
          <h4>유저가 없습니다.</h4>
        ) : (
          <div>
            <ul>
              {filteredUsers?.map((user) => (
                <li key={user.id}>{user.name}</li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}

export default Filter;

// function Filter() {
//   const [search, setSearch] = useState("");

//   const filtered = users.filter((user) =>
//     user.name.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div>
//       <input
//         placeholder="유저 이름을 입력하세요"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//       />
//       <ul>
//         {(search.trim() ? filtered : users).map((user) => (
//           <li key={user.id}>{user.name}</li>
//         ))}
//       </ul>
//       {search.trim() && filtered.length === 0 && <p>유저가 없습니다.</p>}
//     </div>
//   );
// }
