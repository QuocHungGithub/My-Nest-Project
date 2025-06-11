import * as bodyParser from 'body-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cấu hình CORS nếu cần (tuỳ theo frontend)
  app.enableCors({
    origin: true, // Hoặc cụ thể domain: ['https://yourdomain.com']
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // Pipe kiểm tra dữ liệu đầu vào toàn cục
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Chỉ cho phép những thuộc tính có trong DTO
      forbidNonWhitelisted: true, // Báo lỗi nếu có thêm thuộc tính lạ
      transform: true, // Tự động transform type (ví dụ: string => number)
    }),
  );

  // Swagger UI setup
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('Swagger UI cho hệ thống')
    .setVersion('1.0')
    .addBearerAuth() // Nếu có JWT token auth
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Truy cập tại /api

  // Tăng giới hạn request body lên 10MB
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  const port = process.env.PORT || 3000;
  await app.listen(port);

  Logger.log(`Application is running on: http://localhost:${port}`);
  Logger.log(`Swagger UI available at: http://localhost:${port}/api`);
  // Logger.log(
  //   `Socket test client available at: http://localhost:${port}/socket-client.html`,
  // );
  Logger.log('Default admin account has been seeded if not already exists');
}

// Thêm xử lý lỗi cho bootstrap() để sửa lỗi ESLint no-floating-promises
bootstrap().catch((err) => {
  Logger.error(`Error starting server: ${err}`, 'Bootstrap');
  process.exit(1);
});
