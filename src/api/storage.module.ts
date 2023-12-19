import {Module} from '@nestjs/common';
import {CqrsModule} from '@nestjs/cqrs';
import {StorageUnitController} from './storage.controller';
import {
  DisableStorageUnitHandler,
  EnableStorageUnitHandler,
  RegisterStorageUnitHandler,
  StorageDisabledEventHandler,
  StorageEnabledEventHandler,
  StorageRegisteredEventHandler
} from '../storage/storage.aggregate';
import {StorageCapacityProjection} from "../capacity/storage-capacity.projection";

@Module({
  imports: [CqrsModule],
  controllers: [StorageUnitController],
  providers: [
    RegisterStorageUnitHandler,
    EnableStorageUnitHandler,
    DisableStorageUnitHandler,
    StorageRegisteredEventHandler,
    StorageEnabledEventHandler,
    StorageDisabledEventHandler,
    StorageCapacityProjection,
  ],
})
export class StorageModule {}
