import { UserRoles } from '../entities/abstract/user'

type PermissionActions =
  | 'create_courier'
  | 'read_courier'
  | 'update_courier'
  | 'delete_courier'
  | 'create_order'
  | 'read_order'
  | 'update_order'
  | 'delete_order'
  | 'deliver_order'
  | 'accept_order'
  | 'reject_order'
  | 'create_recipient'
  | 'read_recipient'
  | 'update_recipient'
  | 'delete_recipient'

type PermissionOptions = Record<PermissionActions, UserRoles>

export class Permissions {
  static permissions: PermissionOptions = {
    //   courier
    create_courier: 'adm',
    read_courier: 'adm',
    update_courier: 'adm',
    delete_courier: 'adm',

    //   order
    create_order: 'adm',
    read_order: 'adm',
    update_order: 'adm',
    delete_order: 'adm',
    deliver_order: 'courier',
    accept_order: 'courier',
    reject_order: 'courier',

    //   recipient
    create_recipient: 'adm',
    read_recipient: 'adm',
    update_recipient: 'adm',
    delete_recipient: 'adm',
  }

  static hasPermission(action: PermissionActions, role: UserRoles) {
    const data = this.permissions[action]

    return data === role
  }
}
