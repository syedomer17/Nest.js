function wrapInArray(value) {
    return [value];
}
var numberArray = wrapInArray(42);
var stringArray = wrapInArray("hello");
var objectArray = wrapInArray({ name: "Alice" });
console.log(numberArray); // [42]
console.log(stringArray); // ["hello"]
console.log(objectArray); // [{ name: "Alice" }]
