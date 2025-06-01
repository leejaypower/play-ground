import React, { useState, useEffect } from "react";

interface Form {
  name?: string;
  email?: string;
}

// type Fileds = "name" | "email"; => keyof Form으로 하는게 더 낫다

export default function SignUpForm() {
  const [formValue, setFormValue] = useState<Form | undefined>(undefined);
  const [isValidForm, setIsValidForm] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleFormInput = (
    event: React.ChangeEvent<HTMLInputElement>,
    // field: Fileds
    field: keyof Form
  ) => {
    const inputValue = event.target?.value || "";

    setFormValue((prev) => ({ ...prev, [field]: inputValue }));

    // const isValidEmailValue = (value: string) => !!value.includes("@");
    // setIsValidForm(() => isValidEmailValue(formValue?.email || ""));

    // if (!isValidForm) {
    //   setErrorMessage("이메일 형식이 올바르지 않습니다.");
    // } else {
    //   setErrorMessage("");
    // }

    // email 필드일 때만 검사 => 만약 useEffect를 쓸 수 없다고 한다면
    if (field === "email") {
      const isValid = inputValue.includes("@");
      setIsValidForm(isValid);
      setErrorMessage(isValid ? "" : "이메일 형식이 올바르지 않습니다.");
    }
  };

  const submit = () => {
    const alertText = `회원가입 완료: \n
    이름: ${formValue?.name} \n
    이메일: ${formValue?.email}`;

    alert(alertText);

    setFormValue(undefined);
    setIsValidForm(false);
  };

  useEffect(() => {
    const email = formValue?.email || "";
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setIsValidForm(valid);
    setErrorMessage(!email || valid ? "" : "이메일 형식이 올바르지 않습니다.");
  }, [formValue?.email]);

  return (
    <form onSubmit={submit}>
      <input
        type="text"
        placeholder={"이름"}
        value={formValue?.name}
        onChange={(event) => handleFormInput(event, "name")}
      />
      <input
        type="email"
        placeholder={"이메일"}
        value={formValue?.email}
        onChange={(event) => handleFormInput(event, "email")}
      />
      {errorMessage && <p>{errorMessage}</p>}
      <button
        disabled={
          !formValue ||
          Object.values(formValue).some((value) => !value) ||
          !isValidForm
        }
      >
        제출
      </button>
    </form>
  );
}
