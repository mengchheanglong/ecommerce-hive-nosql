import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend clients
  app.enableCors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  });

  // Global Request Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Swagger OpenAPI Documentation Setup
  const config = new DocumentBuilder()
    .setTitle("Marketplace Polyglot Microservices API")
    .setDescription(
      "Enterprise NestJS backend documentation for Catalog (MongoDB), Orders (MongoDB), Telemetry (Cassandra), Referrals (Neo4j), and Analytics (Apache Hive).",
    )
    .setVersion("1.0.0")
    .addTag("Catalog Microservice (MongoDB)")
    .addTag("Orders Microservice (MongoDB)")
    .addTag("Telemetry Microservice (Apache Cassandra)")
    .addTag("Referral Microservice (Neo4j Graph DB)")
    .addTag("Warehouse Microservice (Apache Hive on HDFS)")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document, {
    customSiteTitle: "Marketplace API Swagger Docs",
  });

  const PORT = process.env.PORT || 4000;
  await app.listen(PORT);
  console.log(`\n========================================================`);
  console.log(`🚀 NestJS Backend running at: http://localhost:${PORT}`);
  console.log(`📚 Swagger OpenAPI Docs at:   http://localhost:${PORT}/api/docs`);
  console.log(`========================================================\n`);
}

bootstrap();
