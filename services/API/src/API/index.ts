// API/src/API/index.ts
// Kristian Jones <me@kristianjones.xyz>
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { GraphQLSchema } from 'graphql';
import { getResolvers } from './loader';
import { authChecker } from './Middleware/AuthChecker';
import { TypegooseMiddleware } from './Middleware/Typegoose';
import { ObjectId } from 'mongodb';
import { ObjectIdScalar } from './Scalar/ObjectID';

export const buildAPISchema = async (): Promise<GraphQLSchema> =>
  buildSchema({
    resolvers: await getResolvers(),
    emitSchemaFile: '../../API.graphql',
    globalMiddlewares: [TypegooseMiddleware],
    scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }],
    authChecker
  });
