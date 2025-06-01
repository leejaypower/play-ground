import { useState } from "react";

const users = [
  { id: 1, name: "Alice", active: true },
  { id: 2, name: "Bob", active: false },
  { id: 3, name: "Charlie", active: true },
  { id: 4, name: "Diana", active: false },
];

const tabs = ["전체", "활성", "비활성"] as const; // 그냥 union type으로 해도됨

interface User {
  id: number;
  name: string;
  active: boolean;
}

export default function Filter2() {
  const [visibleUsers, setVisibleUsers] = useState<User[]>(users);
  const [activeTab, setActiveTab] = useState("전체");

  const handleFilteredUsers = (tab: (typeof tabs)[number]) => {
    switch (tab) {
      case "전체":
        setVisibleUsers(users);
        break;

      case "활성":
        setVisibleUsers(users.filter((user) => user.active));
        break;

      case "비활성":
        setVisibleUsers(users.filter((user) => !user.active));
        break;

      default:
        setVisibleUsers(users);
    }
  };

  return (
    <>
      <section>
        <h5>사용자 목록 필터</h5>
        {tabs.map((item) => (
          <button
            key="item"
            onClick={() => {
              setActiveTab(item);
              handleFilteredUsers(item);
            }}
            style={{
              margin: "0 5px",
              color: item === activeTab ? "red" : "white",
            }}
          >
            {item} 사용자
          </button>
        ))}
      </section>

      <section>
        <h5>사용자 목록</h5>
        <ul>
          {visibleUsers.map((user) => (
            <li>
              {user.name} <span>{user.active ? "활성" : "비활성"}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
