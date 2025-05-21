var Car = /** @class */ (function () {
    function Car(brand, model, year) {
        this.brand = brand;
        this.model = model;
        this.year = year;
    }
    Car.prototype.displayInfo = function () {
        console.log("Car: ".concat(this.brand, " ").concat(this.model, " (").concat(this.year, ")"));
    };
    return Car;
}());
var car1 = new Car("Toyota", "Corolla", 2024);
car1.displayInfo();
