import {
  UploadParams,
  Uploader,
} from '@/domain/core/deliveries-and-orders/application/storage/uploader'
import { randomUUID } from 'crypto'

export interface Upload {
  fileName: string
  url: string
}

export class FakeUploader implements Uploader {
  public uploads: Upload[] = []

  async upload({ fileName }: UploadParams): Promise<{ url: string }> {
    const url = randomUUID()

    this.uploads.push({
      fileName,
      url,
    })

    return { url }
  }
}
