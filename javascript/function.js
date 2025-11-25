const add = (a, b) => a + b;

function calculator(func) {
  return function (a, b) {
    return func(a, b);
  };
}

const addCalculator = calculator(add);
console.log(addCalculator(1, 2)); // 3

// event가 어느 매개변수로 들어갈까? 별거 아니지만 헷갈림.. 함수 호출을 보고 함수 리턴값으로 대체해서 생각해보면 헷갈리지 않는다.
const onClick = () => (event) => {
  console.log('button clicked');
};

document.querySelector('#button').addEventListener('click', onClick());

const App = () => {
  // 같은 맥락
  const onClick = useCallback((event) => {
    console.log('button clicked');
  }, []);

  return (
    <div>
      <button id="button" onClick={onClick()}>
        Click me
      </button>
    </div>
  );
};
