import { NestFactory } from "@nestjs/core"
import { ApplicationModule } from "./app.module"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"
import { ValidationPipe } from "./shared/pipes/validation.pipe"
async function bootstrap(): Promise<void> {
    const appOptions = { cors: true }
    const app = await NestFactory.create(ApplicationModule, appOptions)
    app.setGlobalPrefix("api")

    const options = new DocumentBuilder()
        .setTitle("form-clay REST API")
        .setDescription("The form-clay API description")
        .setVersion("1.0")
        .setBasePath("api")
        .addBearerAuth()
        .build()

    const document = SwaggerModule.createDocument(app, options)
    app.useGlobalPipes(new ValidationPipe())
    SwaggerModule.setup("/docs", app, document)
    await app.listen(3000)
}
bootstrap()
