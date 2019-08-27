// API/src/Models/Settings.ts
import { ObjectType, InputType, Field } from 'type-graphql';
import { Typegoose, prop } from 'typegoose';

@ObjectType()
export class Setting extends Typegoose {
  @prop({ unique: true, min: 1, max: 1 })
  public id: number;

  @Field({ defaultValue: 'SSR PWA API' })
  @prop({ default: 'SSR PWA API' })
  public appName: string;
}

export const Settings = new Setting().getModelForClass(Setting);

export const setupCompleted = async (): Promise<boolean> => {
  const count = await Settings.countDocuments({ id: 1 });
  if (count > 0) return true;
  else return false;
};

@InputType()
export class InitialSettingsInput {
  @Field()
  public appName: string;

  @Field()
  public username: string;

  @Field()
  public password: string;
}
