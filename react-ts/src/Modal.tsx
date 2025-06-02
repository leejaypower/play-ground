import { useEffect, useState, useRef } from "react";

// export default function MirrorParent() {
//   const [isDialogOpen, setIsDialogOpen] = useState(false);

//   return (
//     <>
//       <ControlledModal
//         isDialogOpen={isDialogOpen}
//         onDialogOpen={() => setIsDialogOpen(true)}
//         onDialogclose={() => setIsDialogOpen(false)}
//       />
//     </>
//   );
// }

// export function ControlledModal({
//   isDialogOpen,
//   onDialogOpen,
//   onDialogclose,
// }: {
//   isDialogOpen: boolean;
//   onDialogOpen: () => void;
//   onDialogclose: () => void;
// }) {
//   const dialogRef = useRef<HTMLDialogElement | null>(null);
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     const dialog = dialogRef.current;
//     if (!dialog) {
//       return;
//     }

//     const closeDialog = () => {
//       dialogRef.current?.close("closed-by-button");
//       setIsVisible(false);

//       setTimeout(() => onDialogclose(), 300);
//     };

//     dialog.addEventListener("close", closeDialog);
//     return () => dialog.removeEventListener("close", closeDialog);
//   }, [onDialogclose]);

//   useEffect(() => {
//     if (isVisible) {
//       dialogRef.current?.showModal();
//       return;
//     }
//     dialogRef.current?.close();
//   }, [isVisible]);

//   useEffect(() => {
//     console.log(isDialogOpen);
//     setIsVisible(isDialogOpen);
//   }, [isDialogOpen]);

//   return (
//     <div>
//       <button onClick={onDialogOpen}>모달 열기</button>
//       <dialog ref={dialogRef}>
//         <p>안녕하세요! Native Dialog입니다.</p>
//         <button onClick={() => dialogRef.current?.close()}>닫기</button>
//       </dialog>
//     </div>
//   );
// }

// ──────────────────────────────────────────────────────────────────────────
// 부모 컴포넌트: isDialogOpen 상태만 관리, 열기/닫기 요청을 자식에 전달
// ──────────────────────────────────────────────────────────────────────────
export default function MirrorParent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsDialogOpen(true)}>모달 열기</button>
      {isDialogOpen && (
        <ControlledModal
          isDialogOpen={isDialogOpen}
          onDialogClose={() => setIsDialogOpen(false)}
        />
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// 자식 컴포넌트: 내부 isVisible 상태로 애니메이션 처리 후 부모 콜백 호출
// ──────────────────────────────────────────────────────────────────────────
interface ControlledModalProps {
  isDialogOpen: boolean;
  onDialogClose: () => void;
}

export function ControlledModal({
  isDialogOpen,
  onDialogClose,
}: ControlledModalProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // 1) 부모가 isDialogOpen=true 로 바꾸면 이 useEffect가 실행되어 showModal() 호출
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isDialogOpen) {
      // 다이얼로그를 모달로 표시
      dialog.showModal();
      setIsVisible(true);
    }
    // 부모가 isDialogOpen=false로 바꾸지는 않음 -> 실제 닫힘은 자식이 담당
  }, [isDialogOpen]);

  // 2) “닫기 버튼” 클릭 시 내부 isVisible을 false로 바꾸고 300ms 뒤에 부모 콜백 호출
  const handleCloseClick = () => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    // ① 내부 isVisible → false (CSS 애니메이션에서 닫힘 클래스 토글 시점)
    setIsVisible(false);

    // ② 약간의 지연 후 부모에게 “완전히 닫았습니다” 알림
    setTimeout(() => {
      // native close()를 호출 → dialog의 open 속성이 제거됨
      dialog.close("closed-by-child");
      // 부모 onDialogClose 콜백 실행 → 부모는 isDialogOpen=false로 상태 변경
      onDialogClose();
    }, 300); // 300ms는 애니메이션 시간(예: fade-out)과 일치해야 함
  };

  // 3) 모달이 닫혔을 때(native close 이벤트)가 발생하면, 혹시 남은 Cleanup이 필요하다면 여기서 처리
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const onNativeClose = () => {
      // 만약 애니메이션 없이 바로 native close()가 호출되는 경우,
      // 추가 로직(예: 로그, 상태 초기화 등)을 여기에 작성할 수 있음
      console.log("네이티브 dialog close 이벤트 발생");
    };

    dialog.addEventListener("close", onNativeClose);
    return () => void dialog.removeEventListener("close", onNativeClose);
  }, []);

  // 4) 실제 렌더링
  return (
    <dialog ref={dialogRef} style={dialogStyles(isVisible)}>
      <div>
        <p>안녕하세요! Native Dialog입니다.</p>
        <button onClick={handleCloseClick}>닫기</button>
      </div>
    </dialog>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// 다이얼로그의 보이기/숨기기 애니메이션을 위해 간단한 스타일 반환
// ──────────────────────────────────────────────────────────────────────────
function dialogStyles(isVisible: boolean): React.CSSProperties {
  return {
    opacity: isVisible ? 1 : 0,
    transition: "opacity 300ms ease-in-out",
    padding: "1rem",
    borderRadius: "4px",
    border: "1px solid #aaa",
  };
}
