import { useEffect, useState } from 'react';
import { Divider, Grid, Typography } from '@mui/material';

import { FormattedMessage } from 'react-intl';

import useApi from 'hooks/useApi';
import { gridSpacing } from 'store/constant';
import { TransactionsProps } from 'types/payment';

import Balances from './Balances';
import Transaction from './Transaction';
// import axios from 'axios';
// import { web3 as solWeb3 } from '@project-serum/anchor';
// import ConnectSolana from './ConnectSolana';

const Wallet = () => {
    const Api = useApi();
    const [transactions, setTransactions] = useState<TransactionsProps[]>([]);

    const getTransactions = () => {
        Api.getTransactions()
            .then(({ data }) => {
                setTransactions(data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    // const testSOLTx = async () => {
    //     const param = process.env.MODE === 'dev' ? 'testnet' : 'mainnet-beta';
    //     const URL = solWeb3.clusterApiUrl(param);
    //     const signature = '32PWHDw99h37qznjDTY99ymVHprxuiwuQDSQAd1TgwC7PS3V7RvwmB8CGEeD3MGH1DNWZfU4TUA5zGfeHQ3KjdFW';
    //     const res = await axios(URL, {
    //         method: 'POST',
    //         headers: { 'content-type': 'application/json' },
    //         data: {
    //             jsonrpc: '2.0',
    //             id: 'get-transaction',
    //             method: 'getTransaction',
    //             params: [signature]
    //         }
    //     });
    //     const tResult = res.data.result;
    //     const sendAmount =
    //         Math.abs(
    //             Number(tResult.meta.preTokenBalances[0].uiTokenAmount.amount) -
    //                 Number(tResult.meta.postTokenBalances[0].uiTokenAmount.amount)
    //         ) /
    //         10 ** tResult.meta.preTokenBalances[0].uiTokenAmount.decimals;
    //     console.log(tResult);
    //     console.log('from ', tResult.meta.preTokenBalances[0].owner.toLowerCase());
    //     console.log('address', tResult.meta.preTokenBalances[0].mint.toLowerCase());
    //     console.log('receiver ', tResult.meta.preTokenBalances[1].owner.toLowerCase());
    //     console.log(sendAmount);
    // };

    useEffect(() => {
        // testSOLTx();
        getTransactions();
        // eslint-disable-next-line
    }, []);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Typography variant="h3">
                    <FormattedMessage id="Wallet" />
                </Typography>
                <Divider sx={{ mt: 2 }} />
            </Grid>
            <Grid item xs={12}>
                <Balances getTransactions={getTransactions} />
            </Grid>
            {/* <Grid item xs={12}>
                <ConnectSolana />
            </Grid> */}
            <Grid item xs={12}>
                <Transaction transactions={transactions} getTransactions={getTransactions} />
            </Grid>
        </Grid>
    );
};

export default Wallet;
