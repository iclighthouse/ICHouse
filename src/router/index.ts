import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';
import Transactions from '@/views/Transactions/Index.vue';
import Transaction from '@/views/Transactions/Details.vue';
import Token from '@/views/Token/Index.vue';
import Address from '@/views/Address/Index.vue';

// ICP
import ICP from '@/views/ICP/Index.vue';
import ICPTransactions from '@/views/ICP/Transactions.vue';
import ICPTransaction from '@/views/ICP/Transaction.vue';
import ICPAddress from '@/views/ICP/Address.vue';

// Canisters
import Canisters from '@/views/Canisters/Index.vue';
import CanistersAddress from '@/views/Canisters/Address.vue';

// Swaps
import Swaps from '@/views/Swaps/Index.vue';
import Swap from '@/views/Swaps/Details.vue';
import SwapTransaction from '@/views/Swaps/Transaction.vue';
import SwapAddress from '@/views/Swaps/Address.vue';
import SwapTransactions from '@/views/Swaps/Transactions.vue';
import SwapPairs from '@/views/Swaps/Pairs.vue';

import Tools from '@/views/Tools/Index.vue';

// Cross-chain
import IntegrationCkBTC from '@/views/Integration/ckBTC.vue';
import IntegrationIcBTC from '@/views/Integration/icBTC.vue';
import IcEthereum from '@/views/Integration/icEthereum.vue';
import ckEthereum from '@/views/Integration/ckEthereum.vue';

// Competitions
import Competitions from '@/views/Competitions/Index.vue';
import CompetitionsRound from '@/views/Competitions/Round.vue';
import CombinedComp from '@/views/Competitions/CombinedComp.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/ICP',
    meta: {
      type: 'ICP'
    }
  },
  {
    path: '/tokens',
    name: 'Home',
    component: Home,
    meta: {
      type: 'Tokens'
    }
  },
  {
    path: '/tokensTest',
    name: 'Home',
    component: Home,
    meta: {
      type: 'Test',
      menu: 'TokensTest'
    }
  },
  {
    path: '/txs',
    name: 'Transactions',
    component: Transactions,
    meta: {
      type: 'Tokens',
      keepAlive: true
    }
  },
  {
    path: '/tokensTest/txs',
    name: 'Transactions',
    component: Transactions,
    meta: {
      type: 'Test',
      menu: 'TokensTest',
      keepAlive: true
    }
  },
  {
    path: '/tx/:tokenId/:id',
    name: 'Transaction',
    component: Transaction,
    meta: {
      type: 'Tokens'
    }
  },
  {
    path: '/tokensTest/tx/:tokenId/:id',
    name: 'Transaction',
    component: Transaction,
    meta: {
      type: 'Test',
      menu: 'TokensTest'
    }
  },
  {
    path: '/token/:tokenId',
    name: 'Token',
    component: Token,
    meta: {
      type: 'Tokens',
      keepAlive: true
    }
  },
  {
    path: '/tokensTest/token/:tokenId',
    name: 'Token',
    component: Token,
    meta: {
      type: 'Test',
      menu: 'TokensTest',
      keepAlive: true
    }
  },
  {
    path: '/address/:tokenId/:id',
    name: 'Address',
    component: Address,
    meta: {
      type: 'Tokens',
      keepAlive: true
    }
  },
  {
    path: '/tokensTest/address/:tokenId/:id',
    name: 'Address',
    component: Address,
    meta: {
      type: 'Test',
      menu: 'TokensTest',
      keepAlive: true
    }
  },
  {
    path: '/ICP',
    name: 'ICP',
    component: ICP,
    meta: {
      type: 'ICP'
    }
  },
  {
    path: '/ICP/txs',
    name: 'ICPTransactions',
    component: ICPTransactions,
    meta: {
      type: 'ICP'
    }
  },
  {
    path: '/ICP/tx/:hash',
    name: 'ICPTransaction',
    component: ICPTransaction,
    meta: {
      type: 'ICP'
    }
  },
  {
    path: '/ICP/address/:id',
    name: 'ICPAddress',
    component: ICPAddress,
    meta: {
      type: 'ICP'
    }
  },
  {
    path: '/canisters',
    name: 'Canisters',
    component: Canisters,
    meta: {
      type: 'Canisters'
    }
  },
  {
    path: '/canister/:id',
    name: 'CanistersAddress',
    component: CanistersAddress,
    meta: {
      type: 'Canister'
    }
  },
  {
    path: '/swaps',
    name: 'Swaps',
    component: Swaps,
    meta: {
      type: 'Swaps'
    }
  },
  {
    path: '/swapsTest',
    name: 'Swaps',
    component: Swaps,
    meta: {
      type: 'Test',
      menu: 'SwapsTest'
    }
  },
  {
    path: '/swap/:swapId',
    name: 'Swap',
    component: Swap,
    meta: {
      type: 'Swaps',
      keepAlive: true
    }
  },
  {
    path: '/swapsTest/swap/:swapId',
    name: 'Swap',
    component: Swap,
    meta: {
      type: 'Test',
      menu: 'SwapsTest',
      keepAlive: true
    }
  },
  {
    path: '/swap/:swapId/:id',
    name: 'SwapTransaction',
    component: SwapTransaction,
    meta: {
      type: 'Swaps'
    }
  },
  {
    path: '/swapsTest/swap/:swapId/:id',
    name: 'SwapTransaction',
    component: SwapTransaction,
    meta: {
      type: 'Test',
      menu: 'SwapsTest'
    }
  },
  {
    path: '/swap/address/:swapId/:id',
    name: 'SwapAddress',
    component: SwapAddress,
    meta: {
      type: 'Swaps',
      keepAlive: true
    }
  },
  {
    path: '/swaps/pairs',
    name: 'Swap',
    component: SwapPairs,
    meta: {
      type: 'pairs'
    }
  },
  {
    path: '/swapsTest/swap/address/:swapId/:id',
    name: 'SwapAddress',
    component: SwapAddress,
    meta: {
      type: 'Test',
      menu: 'SwapsTest',
      keepAlive: true
    }
  },
  {
    path: '/swaps/txs',
    name: 'SwapTransactions',
    component: SwapTransactions,
    meta: {
      type: 'Swaps',
      keepAlive: true
    }
  },
  {
    path: '/swapsTest/swaps/txs',
    name: 'SwapTransactions',
    component: SwapTransactions,
    meta: {
      type: 'Test',
      menu: 'SwapsTest',
      keepAlive: true
    }
  },
  {
    path: '/swapsTest/swaps/pairs',
    name: 'Swap',
    component: SwapPairs,
    meta: {
      type: 'Test',
      menu: 'pairsTest'
    }
  },
  {
    path: '/tools',
    name: 'Tools',
    component: Tools,
    meta: {
      type: 'Tools'
    }
  },
  {
    path: '/crossChain/ckBTC',
    name: 'ckBTC',
    component: IntegrationCkBTC,
    meta: {
      type: 'Integration',
      menu: 'ckBTC'
    }
  },
  {
    path: '/crossChain/icBTC',
    name: 'icBTC',
    component: IntegrationIcBTC,
    meta: {
      type: 'Integration',
      menu: 'icBTC'
    }
  },
  {
    path: '/crossChain/ethereum_iclight',
    name: 'icETH',
    component: IcEthereum,
    meta: {
      type: 'Integration',
      menu: 'icETH'
    }
  },
  {
    path: '/crossChain/ckEthereum',
    name: 'ckEthereum',
    component: ckEthereum,
    meta: {
      type: 'Integration',
      menu: 'ckEthereum'
    }
  },
  {
    path: '/competitions/tradingComp',
    name: 'Competitions',
    component: Competitions,
    meta: {
      type: 'tradingComp'
    }
  },
  {
    path: '/competitions/tradingComp/:id/:round',
    name: 'CompetitionsRound',
    component: CompetitionsRound,
    meta: {
      type: 'tradingComp'
    }
  },
  {
    path: '/competitions/combinedComp/:round?',
    name: 'Competitions',
    component: CombinedComp,
    meta: {
      type: 'combinedComp'
    }
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
