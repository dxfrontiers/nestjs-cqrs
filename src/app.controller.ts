import {Module} from '@nestjs/common'
import {StorageUnitController} from './api/storage.controller'
import {CommandBus} from '@nestjs/cqrs' // Angenommen, dieser Service ist erforderlich

@Module({
  controllers: [StorageUnitController],
  providers: [CommandBus], // und andere benötigte Services
})
export class StorageModule {}
