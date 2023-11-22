import {Module} from '@nestjs/common'
import {TypeOrmModule} from '@nestjs/typeorm'
import {AppController} from './app.controller'
import {AppService} from './app.service'
import {ProducerModule} from './participants/producer.module'
import {StorageUnitModule} from './participants/storage-unit.module'
import {ConfigModule, ConfigService} from '@nestjs/config'
import {CapacityReadModel} from './participants/model'
import {ReadModelService} from './participants/read-model.service'

@Module({
  imports: [
    ProducerModule,
    StorageUnitModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService): Promise<any> => ({
        type: configService.get('DB_DIALECT'),
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PW'),
        database: configService.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
        entities: [CapacityReadModel],
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([CapacityReadModel]),
  ],
  controllers: [AppController],
  providers: [AppService, ReadModelService],
})
export class AppModule {}
