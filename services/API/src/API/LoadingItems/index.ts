// API/src/API/LoadingItems/index.ts
import { Resolver, Query, ObjectType, Field } from 'type-graphql';

@ObjectType()
class Item {
  @Field()
  public name: string;
}

const Items: Item[] = [
  { name: 'Adi Linden' },
  { name: 'Don Jones' },
  { name: 'Kristian Jones' },
  { name: 'Keith Hutton' },
  { name: 'Shawn Song' },
  { name: 'Eloi' }
];

const timeout = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

@Resolver()
export default class ItemsResolvers {
  @Query(returns => [Item])
  public async getItems(): Promise<Item[]> {
    await timeout(1500);
    return Items;
  }
}
