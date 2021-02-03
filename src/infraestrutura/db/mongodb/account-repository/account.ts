import { AddAccountRepository } from "../../../../data/usecases/add-account/db-add-account-protocols";
import { AddAccountModel } from '../../../../domain/usecases/add_account'
import { AccountModel } from '../../../../domain/models/account'
import { MongoHelper } from "../../helpers/mongo-helper";


export class AccountMongoRepository implements AddAccountRepository{
    async add(accountData: AddAccountModel): Promise<AccountModel> {
        const accountCollection = MongoHelper.getCollection('accounts')
        const result = await accountCollection.insertOne(accountData)
        const account = result.ops[0]
        const {_id, ...accountWithouId} = account
        return Object.assign({}, accountWithouId, {id: _id});
    }

}