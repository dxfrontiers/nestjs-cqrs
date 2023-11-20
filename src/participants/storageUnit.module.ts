import {Module} from '@nestjs/common'
import {CqrsModule} from '@nestjs/cqrs'
import {StorageUnitRepository} from './repositories'
import {StorageUnitCreatedEventHandler} from './eventHandler'
import {StorageUnitController} from './storageUnit.controller'
import {StorageUnitService} from './storageUnit.service'
import {AddStorageUnitHandler} from './commandHandler'

@Module({
  imports: [CqrsModule],
  controllers: [StorageUnitController],
  providers: [
    StorageUnitService,
    StorageUnitRepository,
    AddStorageUnitHandler,
    StorageUnitCreatedEventHandler,
  ],
  exports: [StorageUnitService],
})
export class StorageUnitModule {}
