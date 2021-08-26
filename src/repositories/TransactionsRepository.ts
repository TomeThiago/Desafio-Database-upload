import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const getTotalIncome = await this.find({ where: { type: 'income' } });

    const getSumIncome = getTotalIncome.reduce((acc, val) => {
      return acc + val.value;
    }, 0);

    const getTotalOutcome = await this.find({ where: { type: 'outcome' } });

    const getSumOutcome = getTotalOutcome.reduce((acc, val) => {
      return acc + val.value;
    }, 0);

    return {
      income: getSumIncome,
      outcome: getSumOutcome,
      total: getSumIncome - getSumOutcome,
    };
  }
}

export default TransactionsRepository;
