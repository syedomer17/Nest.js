//Define a Mongoose Schema (Model) in NestJS
import { Prop ,SchemaFactory ,Schema } from "@nestjs/mongoose";
import { Document } from "mongoose";

// Extending Document to get mongoose document type with TS support
export type UserDocument = User & Document;

@Schema()
export class User{
    @Prop({required : true})
    name : string

    @Prop({required : true,unique : true})
    email : string

    @Prop({required : true})
    age : number
}

export const UserSchema = SchemaFactory.createForClass(User);