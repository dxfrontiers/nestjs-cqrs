import {Module} from '@nestjs/common'
import {StorageModule} from './api/storage.module'

@Module({
  imports: [StorageModule],
})
export class AppModule {}
