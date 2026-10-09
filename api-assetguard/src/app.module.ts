import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule'; //para as cron
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AssetsModule } from './assets/assets.module';
import { CollaboratorsModule } from './collaborators/collaborators.module';
import { MovementsModule } from './movements/movements.module';

@Module({
  imports: [
    // Inicia o leitor de .env globalmente
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true, //aqui ativa o log do banco de dados VERIFICAR NECESSIDADE
    }),
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    AssetsModule,
    CollaboratorsModule,
    MovementsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
