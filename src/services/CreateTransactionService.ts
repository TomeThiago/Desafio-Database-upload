import { getRepository, getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface ReturnTransaction {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category_id: string | undefined;
  created_at: Date | undefined;
  updated_at: Date | undefined;
}

interface Request {
  title: string;

  type: 'income' | 'outcome';

  value: number;

  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);
    const getBalance = await transactionsRepository.getBalance();

    if (getBalance.total < value && type === 'outcome') {
      throw new AppError(
        'Should not be able to create outcome transaction without a valid balance',
        400,
      );
    }

    const categoryExists = await categoryRepository.findOne({
      where: {
        title: category,
      },
    });

    let category_id = categoryExists?.id;

    if (!categoryExists) {
      const newCategory = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(newCategory);

      category_id = newCategory.id;
    }

    const createTransaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id,
    });

    await transactionsRepository.save(createTransaction);

    return createTransaction;
  }
}

export default CreateTransactionService;