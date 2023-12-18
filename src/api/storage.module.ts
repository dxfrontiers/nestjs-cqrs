import {Module} from '@nestjs/common';
import {CqrsModule} from '@nestjs/cqrs';
import {StorageUnitController} from './storage.controller';
import {
  DisableStorageUnitHandler,
  RegisterStorageUnitHandler,
  StorageDisabledEventHandler,
  StorageRegisteredEventHandler
} from '../storage/storage.aggregate';
import {StorageCapacityProjection} from "../capacity/storage-capacity.projection";

@Module({
  imports: [CqrsModule],
  controllers: [StorageUnitController],
  providers: [
    RegisterStorageUnitHandler,
    DisableStorageUnitHandler,
    StorageRegisteredEventHandler,
    StorageDisabledEventHandler,
    StorageCapacityProjection,
  ],
})
export class StorageModule {}
