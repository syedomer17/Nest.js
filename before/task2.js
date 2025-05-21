var Car = /** @class */ (function () {
    function Car(brand, model, year) {
        this.brand = brand;
        this.model = model;
        this.year = year;
    }
    Car.prototype.displayInfo = function () {
        console.log("Car: ".concat(this.brand, " ").concat(this.model, " (").concat(this.year, ")"));
    };
    Car.prototype.getYear = function () {
        return this.year;
    };
    return Car;
}());
var car2 = new Car("Tesla", "Model 3", 2023);
car2.displayInfo(); // Car: Tesla Model 3 (2023)
console.log(car2.getYear());
