// API/src/index.ts
// Kristian Jones <me@kristianjones.xyz>
// Main startup of Docs Markdown API
import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-koa';
import Koa from 'koa';
import jwt from 'koa-jwt';
import KoaRouter from 'koa-router';
import mongoose from 'mongoose';
import { createRouteExplorer } from 'altair-koa-middleware';
import { buildAPISchema } from './API';
import { Context } from './API/Context';
import { UserModel } from './Models/User';

const port = 80;

const startWeb = async (): Promise<Koa> => {
  const schema = await buildAPISchema();
  const app = new Koa();
  const router = new KoaRouter();

  process.setMaxListeners(10000);

  app.use(jwt({ secret: 'SECRET', passthrough: true }));

  const apiServer = new ApolloServer({
    schema,
    introspection: true,
    context: async ({ ctx: { state } }): Promise<Context> => ({
      user: state.user ? await UserModel.findOne({ _id: state.user.id }) : undefined
    })
  });

  createRouteExplorer({
    url: '/altair',
    router,
    opts: {
      endpointURL: '/graphql'
    }
  });

  app.use(router.routes()).use(router.allowedMethods());

  apiServer.applyMiddleware({ app });
  return app;
};

const startAPI = async (): Promise<void> => {
  console.log('Starting API');
  await mongoose.connect(`mongodb://${process.env['DB_HOST']}:27017/ssrpwa`, { useNewUrlParser: true, useCreateIndex: true });

  const [app] = await Promise.all([startWeb()]);
  await app.listen(port);
  console.log(`Server listening on port ${port}`);
};

startAPI();
