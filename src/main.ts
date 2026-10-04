import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import 'dotenv/config'
import { ApiExceptionFilter } from './common/exceptions/exception.filter.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  //enable CORS
  app.enableCors({
    // origin: ['http://lcoalhost:3000',
    //   'http://lcoalhost:4200',
    //   'http://localhost:5174',
    //   'http:/127.0.0.1:3000',]
    origin: '*',
    methods: 'GET, PUT, POST, DELETE',
    credentials: true
  })

  app.useGlobalFilters(new ApiExceptionFilter())

  app.setGlobalPrefix('api')

  await app.listen(process.env.PORT ?? 8083);
}
await bootstrap();
