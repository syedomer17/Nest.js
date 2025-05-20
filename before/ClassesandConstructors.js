var User = /** @class */ (function () {
    function User(name, age) {
        this.name = name;
        this.age = age;
    }
    User.prototype.greet = function () {
        console.log("Hello my name is ".concat(this.name, ",and my age is ").concat(this.age));
    };
    return User;
}());
var User1 = new User("Omer", 18);
User1.greet();
