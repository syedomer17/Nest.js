class Car {
    brand : string;
    model : string;
    year : number;

    constructor(brand : string,model : string,year : number) {
        this.brand = brand;
        this.model = model;
        this.year = year;
    }
    displayInfo(){
        console.log(`Car: ${this.brand} ${this.model} (${this.year})`)
    }
}

const car1 = new Car("Toyota", "Corolla",2024);
car1.displayInfo();


