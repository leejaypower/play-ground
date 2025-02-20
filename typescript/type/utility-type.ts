{
  // * keyof *
  type Animal = {
    name: string;
    age: number;
    gender: 'male' | 'female';
  }
  type AnimalKeys = keyof Animal; // 'name' | 'age' | 'gender'


  // * custom mapped type *
  type Video = {
    title: string;
    author: string;
  }
  type Optional<T> = {
    // T가 가지고 있는 키를 P라고 했을 때, T의 키인 P들을 순회하면서 그 키들의 타입을 옵셔널로 만든다. P의 값은 T의 키인 P. 즉 그대로 가져온다.
    // == Partial<T>
    [P in keyof T]?: T[P];
  }
  type VideoOptional = Optional<Video>;
  const video: VideoOptional = {}
  // type VideoOptional = {
  // title ?: string | undefined;
  // author ?: string | undefined;
  // }

  type ReadOnly<T> = {
    readonly [P in keyof T]: T[P];
  }
  type AnimalReadOnly = ReadOnly<Animal>;


  // * conditional type *
  // 조건에 따라 타입을 선택하는 방식
  type Check<T> = T extends string ? boolean : number;
  type Type = Check<string>; // boolean
  type Type2 = Check<number>; // number

  // 극단적으로는 이렇게도 사용가능ㅋㅋ
  type TypeName<T> = T extends string
    ? 'string'
    : T extends number
    ? 'number'
    : T extends boolean
    ? 'boolean'
    : T extends undefined
    ? 'undefined'
    : T extends Function
    ? 'function'
    : 'object';
  // ts에서 삼항 연산자를 많이 사용하는 것은 타입 시스템의 특성상 조건부 타입을 표현하는 "유일한" 방법이기 때문

  // * readonly *
  type Personal = {
    name: string;
    age: number;
  }
  type ReadOnlyPersonal = Readonly<Personal>;
  

  // * Partial *  
  type Todo = {
    title: string;
    description: string;
    label: string;
    priority: 'high' | 'low';
  }

  // 이럴 때 활용하면 좋음: 부분적 업데이트에서 타입을 명시할 때
  function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>):Todo {
    return { ...todo, ...fieldsToUpdate };
  }   
  const todo: Todo = {
    title: 'learn typescript',
    description: 'study hard',
    label: 'study',
    priority: 'high',
  }
  const updated = updateTodo(todo, { priority: 'low' });
  console.log(updated);

  
  // * Pick *
  type VideoData = {
    id: string;
    title: string;
    data: string;
  }
  function getVideo(id: string) {
    return {
      id,
      title: 'video',
      data: 'data:video/mp4;base64,AAAA...',
    }
  }   

  type VideoMetadata1 = Pick<VideoData, 'id' | 'title'>; // id와 title만 갖구왕
  function getVideoMetadata(id: string): VideoMetadata1 {
    return {
      id,
      title: 'video',
    }
  }
  // * Omit *
  type VideoMetadata2 = Omit<VideoData, 'data'>; // data 제외 

  // * Record *
  type PageInfo = {
    title: string;
  }
  type Page = 'home' | 'about' | 'contact';
  // 한 타입과 다른 타입을 묶고 싶을 때 첫번째 인자로 주는 타입을 키로 사용하고, 두번째 인자로 주는 타입을 값으로 사용
  const nav: Record<Page, PageInfo> = {
    home: { title: 'home' },
    about: { title: 'about' },
    contact: { title: 'contact' },
  } 
}


