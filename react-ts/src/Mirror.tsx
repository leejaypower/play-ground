import { useEffect, useState } from "react";

export default function MirrorParent() {
  const [inputValue, setInputValue] = useState("");

  return (
    <>
      <input
        type="text"
        onChange={(event) => setInputValue(event.target.value)}
      />
      {inputValue}
      <MirrorChild inputValue={inputValue}></MirrorChild>
    </>
  );
}

export function MirrorChild({ inputValue }: { inputValue: string }) {
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(inputValue);
  }, [inputValue]);

  return <p>{value}</p>;
}
