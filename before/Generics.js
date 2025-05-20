var Box = /** @class */ (function () {
    function Box(content) {
        this.content = content;
    }
    Box.prototype.getContent = function () {
        return this.content;
    };
    return Box;
}());
var numberBox = new Box(123);
var stringBox = new Box("TypeScript");
console.log(numberBox, stringBox);
