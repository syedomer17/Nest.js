class Box<T>{
    content : T

    constructor(content : T) {
        this.content =content;
    }
    getContent(): T {
    return this.content;
  }
}

const numberBox = new Box<number>(123);
const stringBox = new Box<string>("TypeScript");
console.log(numberBox,stringBox)