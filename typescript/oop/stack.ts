// ** stack을 단일 연결 리스트 자료구조로 객체지향을 얹어서 만들어보기 
{
  interface Stack<T> {
    readonly size: number;
    push(value: T): void;
    pop(): T;
  }

  type StackNode<T> = {
    // 불변성 보장
    readonly value: T
    readonly next?: StackNode<T>;
  }

  class StackImpl<T> implements Stack<T> {
    #size: number = 0;
    #head?: StackNode<T>;

    constructor(private capacity: number) {}

    get size() { 
      return this.#size;
    }

    push(value: T): void {
      if (this.#size === this.capacity) {
        throw new Error('Stack is full!');
      }
      const node = { value, next: this.#head };
      this.#head = node;
      this.#size++;
    }

    pop(): T {
      // null, undefined 모두 잡기 위해 느슨한 비교를 함
      if (this.#head == null) {
        throw new Error('Stack is empty!');
      }
      const node = this.#head;
      this.#head = node.next;
      console.log('head: ', this.#head);
      this.#size--;
      return node.value;
    }      
  }

  const stack = new StackImpl(10); // 3보다 작게 넣으면 에러
  stack.push('jay');
  stack.push(1);
  stack.push('lee');
  stack.push('developer');
  while (stack.size > 0) {
    console.log(stack.pop());
  }
}