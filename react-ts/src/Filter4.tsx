import { useState } from "react";

const users = [
  { id: 1, name: "Alice", active: true },
  { id: 2, name: "Bob", active: false },
  { id: 3, name: "Charlie", active: true },
];

const tabs = ["전체", "활성", "비활성"];

export default function Filter4() {
  const [filteredUsers, setFilteredUsers] =
    useState<{ id: number; name: string; active: boolean }[]>(users);

  const clickButton = (tab: string) => {
    const filtered = users.filter((user) => {
      switch (tab) {
        case "전체":
          return true;

        case "활성":
          return user.active;

        case "비활성":
          return !user.active;
      }
    });

    setFilteredUsers(filtered);
  };

  return (
    <>
      <FilterButtons clickButton={clickButton}></FilterButtons>
      <ul>
        {filteredUsers.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </>
  );
}

function FilterButtons({
  clickButton,
}: {
  clickButton: (tab: (typeof tabs)[number]) => void;
}) {
  return (
    <>
      {tabs.map((tab) => (
        <button key={tab} onClick={() => clickButton(tab)}>
          {tab}
        </button>
      ))}
    </>
  );
}

// // 탭 이름 배열
// const tabs = ["전체", "활성", "비활성"] as const;
// type Tab = (typeof tabs)[number];

// export default function Filter4() {
//   // 1) 현재 활성 탭 상태 관리 ("전체"가 기본)
//   const [activeTab, setActiveTab] = useState<Tab>("전체");

//   // 2) 렌더 시점에 파생된 필터 결과 계산
//   const filteredUsers = users.filter((user) => {
//     if (activeTab === "전체") return true;
//     if (activeTab === "활성") return user.active;
//     if (activeTab === "비활성") return !user.active;
//     return true;
//   });

//   return (
//     <div style={{ padding: "1rem" }}>
//       {/* 탭 버튼 컴포넌트 */}
//       <FilterButtons
//         tabs={tabs}
//         activeTab={activeTab}
//         onClickTab={(tab) => setActiveTab(tab)}
//       />

//       {/* 사용자 목록 */}
//       <ul style={{ marginTop: "1rem" }}>
//         {filteredUsers.map((user) => (
//           <li key={user.id}>
//             {user.name} {user.active ? "(활성)" : "(비활성)"}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// // 하위 컴포넌트: 탭 버튼만 렌더링
// interface FilterButtonsProps {
//   tabs: readonly Tab[];
//   activeTab: Tab;
//   onClickTab: (tab: Tab) => void;
// }

// function FilterButtons({ tabs, activeTab, onClickTab }: FilterButtonsProps) {
//   return (
//     <div>
//       {tabs.map((tab) => (
//         <button
//           key={tab}
//           onClick={() => onClickTab(tab)}
//           style={{
//             marginRight: "0.5rem",
//             padding: "0.5rem 1rem",
//             fontWeight: tab === activeTab ? "bold" : "normal",
//           }}
//         >
//           {tab}
//         </button>
//       ))}
//     </div>
//   );
// }
