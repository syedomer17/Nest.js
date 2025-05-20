function Loggor(constrution : Function){
    console.log(`class ${constrution.name} created`)
}

@Loggor
class Cat {
    constructor(){
        console.log("A cat born")
    }
}

const kitty = new Cat();
