import { Provider } from '@nestjs/common'

const admRepositories: Provider[] = []

const courierRepositories: Provider[] = []

const orderRepositories: Provider[] = []

const recipientRepositories: Provider[] = []

const attachmentRepositories: Provider[] = []

export const repositories: Provider[] = [
  ...admRepositories,
  ...courierRepositories,
  ...orderRepositories,
  ...recipientRepositories,
  ...attachmentRepositories,
]
