class User {
    name: string;
    age:Number;

    constructor(name : string,age: Number){
        this.name = name
        this.age = age
    }
    greet(){
        console.log(`Hello my name is ${this.name},and my age is ${this.age}`)
    }
}
const User1 = new User("Omer",18);
User1.greet()