import {Module} from '@nestjs/common'
import {CqrsModule} from '@nestjs/cqrs'
import {StorageUnitRepository} from './repositories'
import {StorageUnitCreatedEventHandler} from './event-handler'
import {StorageUnitController} from './storage-unit.controller'
import {StorageUnitService} from './storage-unit.service'
import {AddStorageUnitHandler} from './command-handler'
import {CapacityReadModelService} from './capacity-read-model.service'
import {TypeOrmModule} from '@nestjs/typeorm'
import {CapacityReadModel} from './model'

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([CapacityReadModel])],
  controllers: [StorageUnitController],
  providers: [
    StorageUnitService,
    StorageUnitRepository,
    AddStorageUnitHandler,
    StorageUnitCreatedEventHandler,
    CapacityReadModelService,
  ],
  exports: [StorageUnitService],
})
export class StorageUnitModule {}
