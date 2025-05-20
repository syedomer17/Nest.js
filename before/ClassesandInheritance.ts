class Animal {
  move() {
    console.log("Animal moves");
  }
}

class Dog extends Animal {
  bark() {
    console.log("Dog barks");
  }
}

const dog = new Dog();
dog.bark(); 
dog.move(); 
