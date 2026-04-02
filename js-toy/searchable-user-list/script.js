const users = [];

const init = async () => {
  await fetchUser();
  render(users);

  const input = document.getElementById('searchInput');
  input.addEventListener('input', (event) => filterUser(event.target.value));

  addClickEvent();
};

const fetchUser = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  const data = await response.json(); // response json 처리에도 await이 필요하다
  users.push(...data);
};

const render = (newList) => {
  const userList = document.getElementById('userList');
  userList.innerHTML = newList
    .map(
      (user) =>
        `<li><div class="user-card" style="padding: 10px; border: 1px solid black"'>[${user.id}] ${user.name}</div></li>`
    )
    .join('');
};

const addClickEvent = () => {
  const userCards = document.getElementsByClassName('user-card');
  for (const card of userCards) {
    const clickEvent = () => toggle(card);
    card.addEventListener('click', clickEvent);
  }
};

const filterUser = (string) => {
  const filtered = users.filter((user) => user.name.includes(string));
  render(filtered);
  addClickEvent();
};

const toggleStyle = (element) => {
  element.classList.toggle('selected');
};
const toggle = (card) => {
  toggleStyle(card);
  const countElement = document.getElementById('selectedCount');
  countElement.innerText = `선택된 유저 : ${document.getElementsByClassName('selected').length} 명`;
};

init();
