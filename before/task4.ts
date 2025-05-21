class ElectricCar extends Car {
  batteryRange: number;

  constructor(brand: string, model: string, year: number, batteryRange: number) {
    super(brand, model, year); // Call parent constructor
    this.batteryRange = batteryRange;
  }

  displayInfo() {
    super.displayInfo(); // Optional: call parent method
    console.log(`Battery Range: ${this.batteryRange} km`);
  }
}

const tesla = new ElectricCar("Tesla", "Model S", 2024, 600);
tesla.displayInfo();