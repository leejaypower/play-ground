import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

export default function UserList() {
  const [state, setState] = useState<{
    users: User[];
    loading: boolean;
    error: string | null;
  }>({
    users: [],
    loading: false,
    error: null,
  });
  const [searchText, setSearchText] = useState("");

  const filteredUsers = state.users.filter((user: User) => {
    const text = searchText.toLowerCase().trim();
    return (
      user.name.toLowerCase().includes(text) ||
      user.email.toLowerCase().includes(text)
    );
  });

  useEffect(() => {
    const fetchUsers = async () => {
      setState((prev) => ({ ...prev, loading: true }));

      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!res.ok) throw new Error("네트워크 오류");

        const data = await res.json();
        setState({ users: data, loading: false, error: null });
      } catch (err: unknown) {
        if (err instanceof Error) {
          setState({
            users: [],
            loading: false,
            error: err.message ? err.message : "에러 발생",
          });
        }
      }
    };

    fetchUsers();
  }, []);

  if (state.loading) return <p>로딩 중...</p>;
  if (state.error) return <p>에러: {state.error}</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
      <input
        type="text"
        placeholder="이름/username/이메일로 검색"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{
          width: "100%",
          padding: "0.5rem",
          marginBottom: "1rem",
          boxSizing: "border-box",
        }}
      />
      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredUsers.map((user: User) => (
          <li
            key={user.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "4px",
              padding: "0.75rem",
              marginBottom: "0.75rem",
            }}
          >
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
          </li>
        ))}
        {filteredUsers.length === 0 && <p>검색 결과가 없습니다.</p>}
      </ul>
    </div>
  );
}
