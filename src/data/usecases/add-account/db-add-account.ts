import { AccountModel } from "../../../domain/models/account";
import { AddAccount, AddAccountModel} from "../../../domain/usecases/add_account"
import { Encryper } from "../../../presentation/protocols/encrypter";

export class DbAddAccount implements AddAccount {
 
  private readonly encrypter: Encryper

  constructor(encrypter: Encryper) {
      this.encrypter = encrypter
  }

  async add(account: AddAccountModel): Promise<AccountModel> {
    this.encrypter.encrypt(account.password)
    return new Promise(resolve => resolve(null))
  }
}
