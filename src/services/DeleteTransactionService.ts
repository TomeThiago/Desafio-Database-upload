import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import AppError from '../errors/AppError';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionRepository = getRepository(Transaction);

    const deleted = await transactionRepository.delete({ id });

    if (deleted.affected === 0) {
      throw new AppError('Not possible to delete item', 400);
    }
  }
}

export default DeleteTransactionService;