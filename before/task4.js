var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ElectricCar = /** @class */ (function (_super) {
    __extends(ElectricCar, _super);
    function ElectricCar(brand, model, year, batteryRange) {
        var _this = _super.call(this, brand, model, year) || this; // Call parent constructor
        _this.batteryRange = batteryRange;
        return _this;
    }
    ElectricCar.prototype.displayInfo = function () {
        _super.prototype.displayInfo.call(this); // Optional: call parent method
        console.log("Battery Range: ".concat(this.batteryRange, " km"));
    };
    return ElectricCar;
}(Car));
var tesla = new ElectricCar("Tesla", "Model S", 2024, 600);
tesla.displayInfo();
