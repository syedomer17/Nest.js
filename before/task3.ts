function wrapInArray<T>(value: T): T[] {
  return [value];
}

const numberArray = wrapInArray<number>(42);
const stringArray = wrapInArray<string>("hello");
const objectArray = wrapInArray<{ name: string }>({ name: "Alice" });

console.log(numberArray); // [42]
console.log(stringArray); // ["hello"]
console.log(objectArray); // [{ name: "Alice" }]
