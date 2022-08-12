export interface CurrencyProps {
    _id: string;
    symbol: string;
    name?: string;
    payment?: string;
    adminAddress?: string;
    contractAddress?: string;
    abi?: any;
    betLimit?: number;
    price: number;
    maxBet?: number;
    minBet?: number;
    minDeposit?: number;
    minWithdraw?: number;
    icon?: string;
    buyUrl?: string;
    type?: number;
    status?: boolean;
    deposit?: boolean;
    withdrawal?: boolean;
}

export interface BalanceProps {
    _id: string;
    balance: number;
    currency: CurrencyProps;
    disabled: boolean;
    status: boolean;
    userId: string;
}

export interface TransactionsProps {
    _id: string;
    amount: number;
    currencyId: CurrencyProps;
    ipn_type: string;
    status_text: string;
    status: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface GameProps {
    icon: string;
    name: string;
}

export interface HistoryProps {
    _id: string;
    amount: number;
    currency: string;
    game: GameProps;
    profit: number;
    status: string;
    username: string;
    createdAt: Date;
}
