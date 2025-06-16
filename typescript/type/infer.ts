{
  // type UnpackPromise<T> = T extends Promise<infer K>[] ? K : any;
  type UnpackPromise<T> = T extends Promise<infer K>[] ? K : never;
  // unpack 이라는 네이밍은 실제로 들어오는 타입에 따라 타입이 추론되기 때문 -> 직관적이라 사용하기 좋을듯?

  const promises = [Promise.resolve("jay"), Promise.resolve(1)];
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
      name: "주문 관리",
      path: "/orders",
      component: "ordersComponent",
    },
    {
      name: "상점 관리",
      path: "/stores",
      component: "storesComponent",
    },
  ];

  interface SubMenu {
    name: string;
    path: string;
  }

  interface MainMenu {
    name: string;
    path?: string;
    subMenus?: SubMenu[];
  }

  type MenuItem = MainMenu | SubMenu;
  const menuList: MenuItem[] = [
    {
      name: "주문 관리", // subMenu가 없을 때 권한 검사 용도, 있을 때는 그냥 이름의 역할만 한다고 가정
      subMenus: [
        {
          name: "전체 주문 보기", // 페이지 권한 검사 용도
          path: "/orders/list",
        },
        {
          name: "주문 접수하기",
          path: "/orders/new",
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
  type PermissionNames = "전체 주문 보기" | "주문 접수하기" | "유저 승인";

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
      name: "주문 관리",
      subMenus: [
        {
          name: "전체 주문 보기",
          path: "/orders/list",
        },
        {
          name: "주문 접수하기",
          path: "/orders/new",
        },
      ],
    },
    {
      name: "유저 승인",
      path: "/admin-user/list",
    },
  ] as const;

  interface RouteBase {
    name: PermissionNames;
    path: string;
    component: string; // 예제 작성의 편의를 위해 그냥 string - 실제로는 component type
  }

  type RouteItem =
    | {
        name: string;
        path: string;
        component?: string;
        pages: RouteBase[]; // mainMenu
      }
    | { name: PermissionNames; path: string; component?: string }; // subMenu

  // menu에 따라 타입을 알맞게 추론하기 위해 infer 사용
  type UnpackMenuNames<T extends ReadonlyArray<MenuItem>> =
    // 1. T가 MenuItem의 배열인지 확인
    T extends ReadonlyArray<infer U>
      ? // 2. U가 MainMenu인지 확인
        U extends MainMenu
        ? // 3. MainMenu의 SubMenus 필드 타입을 V로 추론
          U["SubMenus"] extends infer V
          ? // 4. V가 SubMenu 배열인지 확인
            V extends ReadonlyArray<SubMenu>
            ? UnpackMenuNames<V> // 5. 맞으면 재귀적으로 UnpackMenuNames 호출
            : U extends { name: infer N }
            ? N
            : never // 6. SubMenus가 없으면 MainMenu의 name 반환
          : never // 7. SubMenus 필드가 없으면 never
        : // 8. U가 SubMenu인지 확인
        U extends SubMenu
        ? U extends { name: infer N }
          ? N
          : never // 9. SubMenu면 name 반환
        : never // 10. 둘 다 아니면 never
      : never; // 11. T가 배열이 아니면 never
}
