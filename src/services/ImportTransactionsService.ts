  
import path from 'path';
import fs from 'fs';
import csv from 'csvtojson';
import uploadConfig from '../config/upload';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

interface Request {
  fileName: string;
}

class ImportTransactionsService {
  async execute({ fileName }: Request): Promise<Transaction[]> {
    const filePath = path.join(uploadConfig.directory, fileName);

    const transactionJson = await csv().fromFile(filePath);

    await fs.promises.unlink(filePath);

    const createTransactionService = new CreateTransactionService();

    const transactionArray: Transaction[] | void = [];

    for (const transaction of transactionJson) {
      const intertransaction = await createTransactionService.execute(
        transaction,
      );

      transactionArray.push(intertransaction);
    }

    return transactionArray;
  }
}

export default ImportTransactionsService;