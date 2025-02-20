{
  class TimeoutError extends Error {  
    constructor(message: string) {
      super(message);
    }
  }

  class OfflineError extends Error {
    constructor(message: string) {
      super(message);
    }
  }

  function readFile(fileName: string): string {
    if (fileName === 'not exist') {
      throw new Error('not exist');
    }
    return 'file contents';
  }

  function closeFile(fileName: string) {
    // ...
  }

  const fileName = 'not exist';

  function run() {
    try {
      const file = readFile(fileName);
      closeFile(fileName);
    } catch (error) {
      console.error('파일 읽기 오류:', error);
    } finally {
      // catch에서 return하는 경우도 있으니 finally를 사용하는 것이 권장됨
      closeFile(fileName);
      console.log('파일 처리 완료');
    }
  }
  run();

  //
  type NetworkErrorState = {
    result: 'fail';
    reason: 'offline' | 'timeout';
  }

  type SuccessState = {
    result: 'success';
  }

  type ResultState = SuccessState | NetworkErrorState;

  class NetworkClient {
    tryConnect(): ResultState {
      throw new Error('no network!');
    }
  }

  class UserService {
    constructor(private client: NetworkClient) { }

    login() {
      this.client.tryConnect();
    }
  }

  class App {
    constructor(private userService: UserService) { }

    run() {
      // 어플리케이션 레벨에서 catch를 하는 것이 좋다. 의미있는 처리가 되지 않는 에러핸들링은 불필요하다. -> UserService에서 처리할 필요는 없음 
      try {
        this.userService.login();
      } catch (error) {
        console.log('error is catched');
      }
    }
  }

  const client = new NetworkClient();
  const service = new UserService(client);
  const app = new App(service);
  app.run();
}

