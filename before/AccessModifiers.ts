class Product {
    public name : string;
    private price : number;
    readonly id : string;

    constructor(name :string,price:number,id : string){
        this.name = name;
        this.price = price;
        this.id = id;
    }
    display(){
        console.log(`Product: ${this.name}, Price: $${this.price}, ID: ${this.id}`)
    }
}
const p = new Product("omer",1000,"omerali");
p.display();