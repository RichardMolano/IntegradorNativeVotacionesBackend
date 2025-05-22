import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ConexionModule } from './config/conexion/conexion.module';
import { PublicModule } from './modules/public/public.module';
import { PrivateModule } from './modules/private/private.module';
import { Security } from './middleware/security/security';



@Module({
  imports: [ConfigModule.forRoot({envFilePath:'.env', isGlobal: true}), ConexionModule, PublicModule, PrivateModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
 public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(Security)
      .forRoutes('private');
  }
}
