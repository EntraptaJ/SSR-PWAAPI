import { prop, Typegoose, pre, instanceMethod } from 'typegoose';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { ForbiddenError, ObjectType, Field, InputType } from 'type-graphql';

export enum IPermissionENUM {
  READ,
  WRITE,
  ADMIN
}

export type IPermission = 'READ' | 'WRITE' | 'ADMIN' | IPermissionENUM;

export type Role = 'User' | 'Admin';

@pre<User>('save', async function(next): Promise<void> {
  if (!this.isModified('password')) return next();
  if (this.isModified('password')) this.password = await hash(this.password, 10);
})
@ObjectType()
export class User extends Typegoose {
  @Field(type => String)
  public _id: string;

  @prop({ unique: true })
  @Field(type => String)
  public username: string;

  @prop()
  public password: string;

  @prop({ default: ['User'] })
  public role: Role[];

  @instanceMethod
  public async generateToken(this: User, plainText: string): Promise<string> {
    const valid = await compare(plainText, this.password);
    if (!valid) throw new ForbiddenError();
    return sign({ id: this._id }, 'SECRET', {
      expiresIn: '60d'
    });
  }
}

@InputType()
export class NewUserInput {
  @Field()
  public username: string;

  @Field()
  public password: string;
}

export const UserModel = new User().getModelForClass(User);
