import {Module, OnModuleInit} from '@nestjs/common';
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
import {client as eventStore} from '../eventstore'
import {streamNameFilter} from "@eventstore/db-client";

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
export class StorageModule implements OnModuleInit {
  async onModuleInit() {
    this.startBackgroundSubscription();
  }

  private startBackgroundSubscription() {
    (async (): Promise<void> => {
      await this.subscribeToAllStorageEvents();
    })();
  }

  private async subscribeToAllStorageEvents() {
    const subscription = eventStore.subscribeToAll({
      filter: streamNameFilter({ prefixes: ["storage-unit-stream-"] }),
    });

    for await (const resolvedEvent of subscription) {
      console.log(
          `Received event ${resolvedEvent.event?.revision}@${resolvedEvent.event?.streamId}`
      );
      const data: any = resolvedEvent.event.data;
      console.log("data:", data);
    }
  }
}
