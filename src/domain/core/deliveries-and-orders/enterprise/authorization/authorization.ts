import { UserRoles } from '../entities/abstract/user'

type PermissionActions =
  // courier
  | 'create_courier'
  | 'read_courier'
  | 'update_courier'
  | 'delete_courier'
  | 'change_courier_password'
  // order
  | 'create_order'
  | 'read_order'
  | 'update_order'
  | 'delete_order'
  | 'deliver_order'
  | 'accept_order'
  | 'reject_order'
  | 'set_awaiting_fot_pickup_order'
  | 'collect_order'
  | 'return_order'
  | 'list_nearby_orders'
  | 'list_courier_orders'
  | 'list_recipient_orders'
  // recipient
  | 'create_recipient'
  | 'read_recipient'
  | 'update_recipient'
  | 'delete_recipient'
  | 'change_recipient_password'

type PermissionOptions = Record<PermissionActions, UserRoles[]>

export class Permissions {
  static permissions: PermissionOptions = {
    //   courier
    create_courier: ['adm'],
    read_courier: ['adm'],
    update_courier: ['adm'],
    delete_courier: ['adm'],
    change_courier_password: ['adm'],

    //   order
    create_order: ['adm'],
    read_order: ['adm'],
    update_order: ['adm'],
    set_awaiting_fot_pickup_order: ['adm'],
    collect_order: ['adm'],
    delete_order: ['adm'],
    return_order: ['adm'],
    deliver_order: ['courier'],
    accept_order: ['courier'],
    reject_order: ['courier'],
    list_nearby_orders: ['courier', 'adm'],
    list_courier_orders: ['courier', 'adm'],
    list_recipient_orders: ['recipient', 'adm'],

    //   recipient
    create_recipient: ['adm'],
    read_recipient: ['adm'],
    update_recipient: ['adm'],
    delete_recipient: ['adm'],
    change_recipient_password: ['adm'],
  }

  static hasPermission(action: PermissionActions, role: UserRoles) {
    const data = this.permissions[action]

    return data.includes(role)
  }
}
