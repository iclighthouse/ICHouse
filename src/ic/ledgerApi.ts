import { ICPTransaction, ICPTransactions } from '@/ic/common/transaction';
import axios from 'axios';

export const getTransactionsByAccount = async (
  accountAddress: string,
  maxBlock = 0,
  limit = 10,
  offset = 0
): Promise<ICPTransactions> => {
  try {
    const res = await axios.get(
      `https://ledger-api.internetcomputer.org/accounts/${accountAddress}/transactions?limit=${limit}&offset=${offset}&max_block_index=${maxBlock}&transfer_type=`
    );
    if (res && res.status === 200) {
      return res.data;
    }
    return null;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getTransactionByHash = async (
  hash: string
): Promise<ICPTransaction> => {
  try {
    const res = await axios.get(
      `https://ledger-api.internetcomputer.org/transactions?sort_by=-block_height&transaction_hash=${hash}`
    );
    if (
      res &&
      res.status === 200 &&
      res.data &&
      res.data.blocks &&
      res.data.blocks.length
    ) {
      return res.data.blocks[0];
    }
    return null;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getTransactions = async (
  maxBlock = 0,
  limit = 10,
  offset = 0
): Promise<ICPTransactions> => {
  try {
    const res = await axios.get(
      `https://ledger-api.internetcomputer.org/transactions?limit=${limit}&offset=${offset}&max_block_index=${maxBlock}&transfer_type=`
    );
    if (res && res.status === 200) {
      return res.data;
    }
    return null;
  } catch (e) {
    console.log(e);
    return null;
  }
};
