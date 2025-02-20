
{ // 일종의 규격서 같은 느낌 - 규격을 정의하고, 이 규격을 통한 여러 구현이 필요하다면 interface?
  interface PositionInterface {
    x: number;
    y: number;
  }
  // 데이터의 모습을 결정하는 느낌 
  type PositionType = {
    x: number;
    y: number;
  }

  // interface는 오버라이딩 가능
  interface PositionInterface {
    z: number;
  }
  // 에러 - type은 오버라이딩 불가
  type PositionType = {
    x: number;
    y: number;
  }

  // object
  const obj1: PositionType = {
    x: 1,
    y: 2,
  }
  // 에러 
  const obj2: PositionInterface = {
    x: 1,
    y: 2,
  }

  // class
  class Pos1 implements PositionType {
    constructor(public x: number, public y: number) { }
  }
  class Pos2 implements PositionInterface {
    constructor(public x: number, public y: number, public z: number) { }
  }

  // 확장: extends & intersection
  interface ZPosition extends PositionInterface {
    z: number;
  }
  type ZPositionType = PositionType & { z: number };
}