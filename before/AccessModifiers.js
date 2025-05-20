var Product = /** @class */ (function () {
    function Product(name, price, id) {
        this.name = name;
        this.price = price;
        this.id = id;
    }
    Product.prototype.display = function () {
        console.log("Product: ".concat(this.name, ", Price: $").concat(this.price, ", ID: ").concat(this.id));
    };
    return Product;
}());
var p = new Product("omer", 1000, "omerali");
p.display();
