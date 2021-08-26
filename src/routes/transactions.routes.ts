import { Router } from 'express';
import multer from 'multer';

import unloadConfig from '../config/upload';
import GetTransactionsService from '../services/GetTransactionsService';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const upload = multer(unloadConfig);

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const getTransactionsService = new GetTransactionsService();

  const getTransactions = await getTransactionsService.execute();

  return response.json(getTransactions);
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransactionService = new DeleteTransactionService();

  await deleteTransactionService.execute({ id });

  return response.status(204).send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const fileName = request.file.filename;

    const importTransactionsService = new ImportTransactionsService();

    const transaction = await importTransactionsService.execute({ fileName });

    return response.json(transaction);
  },
);

export default transactionsRouter;
