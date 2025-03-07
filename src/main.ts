import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import * as bodyParser from 'body-parser';
import 'reflect-metadata';

async function bootstrap() {
  const MongoStore = require('connect-mongo');
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.use(bodyParser.json({ limit: '10mb' }));

  app.use(
    session({
      secret: process.env.COOKIE_SECRET!,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 3600000 * 24,
        httpOnly: true,
      },
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_CONNECTION,
      }),
    }),
  )

  app.enableCors({
    origin: ['http://localhost:3000','ron.findurjob.uk'],
    credentials: true,
  });

  app.use(
    passport.initialize()
  );
  app.use(
    passport.session()
  );

  try {
    await app.listen(process.env.PORT!);
    console.log(`Server is running on: ${process.env.PORT}`);
    console.log(`Server is running on: ${process.env.REACT_APP_URL}`);
  }
  catch (error) {
    console.log(error);
  }
}
bootstrap();
