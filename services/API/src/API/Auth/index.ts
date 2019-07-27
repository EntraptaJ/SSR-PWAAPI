import { Resolver, Query, Mutation, Arg, Authorized, Ctx, ObjectType, Field } from 'type-graphql';
import { ApolloError } from 'apollo-server-koa';
import { UserModel, User, NewUserInput } from '../../Models/User';
import { Context } from '../Context';
import { MutationResponse } from '../Mutations';

@ObjectType({ implements: MutationResponse })
class LoginUserMutationResponse implements MutationResponse {
  public success: boolean;

  @Field(type => String)
  public token: Promise<string>;
}

@Resolver(of => User)
export default class AuthResolver {
  @Query(returns => Boolean)
  public async isAuthed(@Ctx() { user }: Context): Promise<boolean> {
    if (!user) return false;
    else return true;
  }

  @Query(returns => String, { description: 'Decrypts the Users secret' })
  @Authorized()
  public async getSecret(@Arg('password') plainText: string, @Ctx() { user }: Context): Promise<string> {
    return user.decryptSecret(plainText);
  }

  @Query(returns => User)
  public async User(@Arg('id') userID: string): Promise<User> {
    const User = await UserModel.findOne({ _id: userID });
    if (!User) throw new ApolloError('User not found', 'INVALID_USER');
    else return User;
  }

  @Query(returns => [User])
  public async users(@Arg('username', { nullable: true, defaultValue: '' }) username?: string): Promise<User[]> {
    const Users = await UserModel.find();
    return Users.filter(user => user.username.toLowerCase().includes(username.toLowerCase()));
  }

  @Mutation(returns => User)
  public async registerUser(@Arg('user', type => NewUserInput) user: NewUserInput): Promise<User> {
    const userExists = await UserModel.findOne({ username: user.username });
    if (userExists) throw new ApolloError('User already exists', 'USER_EXISTS');
    const User = await UserModel.create({ ...user });
    return User;
  }

  @Mutation(type => LoginUserMutationResponse, { description: 'Log User into API' })
  public async loginUser(
    @Arg('username') username: string,
    @Arg('password') password: string
  ): Promise<LoginUserMutationResponse> {
    const user = await UserModel.findOne({ username });
    if (!user) throw new ApolloError('User not found', 'INVALID_USER');
    return { success: true, token: user.generateToken(password) };
  }
}
