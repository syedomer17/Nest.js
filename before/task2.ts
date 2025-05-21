class Car {
  readonly brand: string;
  model: string;
  private year: number;

  constructor(brand: string, model: string, year: number) {
    this.brand = brand;
    this.model = model;
    this.year = year;
  }

  displayInfo() {
    console.log(`Car: ${this.brand} ${this.model} (${this.year})`);
  }

  getYear() {
    return this.year;
  }
}

const car2 = new Car("Tesla", "Model 3", 2023);
car2.displayInfo();               // Car: Tesla Model 3 (2023)
console.log(car2.getYear()); 