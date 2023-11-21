import {Module} from '@nestjs/common'
import {CqrsModule} from '@nestjs/cqrs'
import {StorageUnitRepository} from './repositories'
import {StorageUnitCreatedEventHandler} from './eventHandler'
import {StorageUnitController} from './storageUnit.controller'
import {StorageUnitService} from './storageUnit.service'
import {AddStorageUnitHandler} from './commandHandler'
import {CapacityReadModelService} from './readModel.service'
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
