{
  // type UnpackPromise<T> = T extends Promise<infer K>[] ? K : any;
  type UnpackPromise<T> = T extends Promise<infer K>[] ? K : never;
  // unpack 이라는 네이밍은 실제로 들어오는 타입에 따라 타입이 추론되기 때문 -> 직관적이라 사용하기 좋을듯?

  const promises = [Promise.resolve('jay'), Promise.resolve(1)];
  type ResultType = UnpackPromise<typeof promises>; // string | number

  // ** 더 복잡한 infer 사용은 언제하지? - 만약 infer를 사용하지 않는다면 **

  interface RouteBase {
    name: string;
    path: string;
    component: string; // 예제 작성의 편의를 위해 그냥 string - 실제로는 component type
  }

  interface RouteItem extends RouteBase {
    pages?: RouteBase[];
  }

  const routes: RouteItem[] = [
    {
      name: '주문 관리',
      path: '/orders',
      component: 'ordersComponent',
    },
    {
      name: '상점 관리',
      path: '/stores',
      component: 'storesComponent',
    },
  ];

  interface SubMenu {
    name: string;
    path: string;
  }

  interface MainMenu {
    name: string; // name 필드 추가
    path?: string;
    subMenus?: SubMenu[];
  }

  type MenuItem = MainMenu | SubMenu;
  const menuList: MenuItem[] = [
    {
      name: '주문 관리', // subMenu가 없을 때 권한 검사 용도, 있을 때는 그냥 이름의 역할만 한다고 가정
      subMenus: [
        {
          name: '전체 주문 보기', // 페이지 권한 검사 용도
          path: '/orders/list',
        },
        {
          name: '주문 접수하기',
          path: '/orders/new',
        },
      ],
    },
  ];

  // 메뉴의 name과 route의 name이 동일해야, 메뉴 클릭 시 올바른 라우트로 이동하거나,
  // 현재 라우트에 따라 메뉴를 활성화할 때 name을 기준으로 비교하기 쉽다.
  // 하지만 그저 string으로 정의되어있기 때문에 다른 값이 입력되어도 컴파일 단계에서 에러가 나지 않는다. (mainMenu에 "전체 주문 보기" 등이 들어간 경우처럼 잘못된 상황)
  // 이런 경우 런타임에서도 존재하지 않는 권한에 대한 문제로 잘못 인지될 수 있다.
  // 이를 개선하기 위해서는 infer를 사용하여 타입을 추론하는 것이 좋다.
}
{
  interface SubMenu {
    name: string;
    path: string;
  }

  interface MainMenu {
    SubMenus?: ReadonlyArray<SubMenu>;
  }

  type MenuItem = MainMenu | SubMenu;

  const menuList = [
    {
      name: '주문 관리',
      subMenus: [
        {
          name: '전체 주문 보기',
          path: '/orders/list',
        },
        {
          name: '주문 접수하기',
          path: '/orders/new',
        },
      ],
    },
    {
      name: '유저 승인',
      path: '/admin-user/list',
    },
  ] as const;

  // type RouteItem =
  //   | {
  //       name: string;
  //       path: string;
  //       component?: string;
  //       pages: RouteBase[]; // mainMenu
  //     }
  //   | { name: PermissionNames; path: string; component?: string }; // subMenu

  // 기존 RouteItem의 name들
  // - MainMenu: string (아무 문자열이나 가능)
  // - SubMenu: PermissionNames ("전체 주문 보기" | "주문 접수하기" | "유저 승인")

  interface RouteBase {
    name: UnpackMenuNames<typeof menuList>; // 메뉴에서 추론된 name 타입 사용
    path: string;
    component: string; // 예제 작성의 편의를 위해 그냥 string - 실제로는 component type
  }

  // menu에 따라 타입을 알맞게 추론하기 위해 infer 사용
  type UnpackMenuNames<T extends readonly any[]> =
    // 1. T가 배열인지 확인
    T extends readonly (infer U)[]
      ? U extends { name: string; subMenus?: readonly any[] }
        ? U['subMenus'] extends readonly any[]
          ? UnpackMenuNames<U['subMenus']> // 2. subMenus가 있으면 재귀적으로 처리
          : U['name'] // 3. subMenus가 없으면 name 반환
        : U extends { name: string }
        ? U['name'] // 4. 단순 객체면 name 반환
        : never
      : never;

  type RouteItem =
    | {
        name: UnpackMenuNames<typeof menuList>; // 메뉴에 정의된 name만 허용
        path: string;
        component?: string;
        pages: RouteBase[];
      }
    | {
        name: UnpackMenuNames<typeof menuList>; // 메뉴에 정의된 name만 허용
        path: string;
        component?: string;
      };
}
