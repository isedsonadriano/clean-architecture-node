import { AccountModel } from '../../domain/models/account';
import {AddAccountModel} from '../../domain/usecases/add_account'

export interface LogErrorRepository {
     log(stack:string): Promise<void>
}
