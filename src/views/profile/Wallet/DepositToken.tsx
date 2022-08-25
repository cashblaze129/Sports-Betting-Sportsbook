import { forwardRef, useEffect, useState } from 'react';
import {
    Alert,
    Button,
    CardContent,
    CardProps,
    CircularProgress,
    Grid,
    IconButton,
    Stack,
    TextField,
    Typography,
    useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { web3 as solWeb3, Wallet } from '@project-serum/anchor';

// import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
// import { createMint, getOrCreateAssociatedTokenAccount, mintTo, transfer } from '@solana/spl-token';

import { FormattedMessage, useIntl } from 'react-intl';
import { useWallet } from '@solana/wallet-adapter-react';

import Web3 from 'web3';
import { BigNumber } from '@ethersproject/bignumber';
import { formatUnits, parseUnits } from '@ethersproject/units';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';

import useApi from 'hooks/useApi';

import snackbar from 'utils/snackbar';
import { toNumberTag } from 'utils/number';
import { injected, switchNetwork } from 'utils/connectors';

import { useDispatch, useSelector } from 'store';
import { UpdateInfo } from 'store/reducers/auth';

import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import SolanaIcon from 'assets/images/icons/SOL.png';

const ethereum = 'ether';

interface Props extends CardProps {
    modalStyle: React.CSSProperties;
    functions: any;
}

const DepositToken = forwardRef(({ modalStyle, functions }: Props, ref: React.Ref<HTMLDivElement>) => {
    const Api = useApi();
    const theme = useTheme();
    const dispatch = useDispatch();
    const { formatMessage } = useIntl();
    const { user, currency } = useSelector((state) => state.auth);
    const { account, activate, active, library } = useWeb3React();
    const [balance, setBalance] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [amount, setAmount] = useState<number | string>('');

    const { publicKey, wallet, connected, sendTransaction } = useWallet();

    const handleClick = async () => {
        await switchNetwork();
        if (!active) {
            activate(injected, undefined, true).catch((error) => {
                if (error instanceof UnsupportedChainIdError) {
                    activate(injected);
                }
            });
        }
    };

    const depositToken = (txn_id: string, amounti: BigNumber) => {
        Api.depositToken({
            amounti: amounti.toString(),
            amount,
            from: account,
            address: currency.contractAddress,
            receiver: currency.adminAddress,
            txn_id
        })
            .then(({ data }) => {
                console.log(data);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    const handleTransfer = async (
        tokenMintAddress: string,
        solWallet: Wallet,
        to: string,
        connection: solWeb3.Connection,
        tAmount: number
    ) => {
        const mintPublicKey = new solWeb3.PublicKey(tokenMintAddress);
        const mintToken = new Token(
            connection,
            mintPublicKey,
            TOKEN_PROGRAM_ID,
            solWallet.payer // the wallet owner will pay to transfer and to create recipients associated token account if it does not yet exist.
        );

        const fromTokenAccount = await mintToken.getOrCreateAssociatedAccountInfo(solWallet.publicKey);

        const destPublicKey = new solWeb3.PublicKey(to);

        // Get the derived address of the destination wallet which will hold the custom token
        const associatedDestinationTokenAddr = await Token.getAssociatedTokenAddress(
            mintToken.associatedProgramId,
            mintToken.programId,
            mintPublicKey,
            destPublicKey
        );

        const receiverAccount = await connection.getAccountInfo(associatedDestinationTokenAddr);

        const instructions: solWeb3.TransactionInstruction[] = [];

        if (receiverAccount === null) {
            instructions.push(
                Token.createAssociatedTokenAccountInstruction(
                    mintToken.associatedProgramId,
                    mintToken.programId,
                    mintPublicKey,
                    associatedDestinationTokenAddr,
                    destPublicKey,
                    solWallet.publicKey
                )
            );
        }

        instructions.push(
            Token.createTransferInstruction(
                TOKEN_PROGRAM_ID,
                fromTokenAccount.address,
                associatedDestinationTokenAddr,
                solWallet.publicKey,
                [],
                tAmount
            )
        );

        const transaction = new solWeb3.Transaction().add(...instructions);
        transaction.feePayer = solWallet.publicKey;
        transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;

        const transactionSignature = await connection.sendRawTransaction(transaction.serialize(), { skipPreflight: true });

        await connection.confirmTransaction(transactionSignature);
    };

    const onDepositToken = async () => {
        if (!connected) {
            snackbar(formatMessage({ id: 'Please connect wallet.' }), 'error');
        } else if (amount === '' || Number(amount) === 0 || Number(amount) < Number(currency.minDeposit)) {
            snackbar(formatMessage({ id: 'Please input valid amount.' }), 'error');
        } else {
            console.log(wallet);
            // const web3 = new Web3(library.provider);
            // if (currency.contractAddress === ethereum) {
            //     console.log('over here');
            //     // const decimals = 18;
            //     if (balance < Number(amount)) {
            //         snackbar(formatMessage({ id: 'Balances not enough.' }), 'error');
            //     } else {
            //         console.log('else 1');
            //         // setLoading(true);
            //         // const amounti = parseUnits(amount.toString(), decimals) as BigNumber;
            //         // web3.eth.sendTransaction({ from: account, to: currency.adminAddress, value: amounti.toString() }, (error, txn_id) => {
            //         //     if (error) {
            //         //         setLoading(false);
            //         //     } else {
            //         //         depositToken(txn_id, amounti);
            //         //     }
            //         // });
            //     }
            // } else {
            //     console.log('else 2');
            //     // const contract = new web3.eth.Contract(currency.abi, currency.contractAddress);
            //     // if (balance < Number(amount)) {
            //     //     snackbar(formatMessage({ id: 'Balances not enough.' }), 'error');
            //     // } else {
            //     //     setLoading(true);
            //     //     const decimals = await contract.methods.decimals().call();
            //     //     const amounti = parseUnits(amount.toString(), decimals);
            //     //     const gasLimit = await contract.methods.transfer(currency.adminAddress, amounti).estimateGas({ from: account });
            //     //     const gasPrice = await web3.eth.getGasPrice();
            //     //     contract.methods
            //     //         .transfer(currency.adminAddress, amounti)
            //     //         .send({ from: account, gasLimit, gasPrice }, (error: any, txn_id: string) => {
            //     //             if (error) {
            //     //                 setLoading(false);
            //     //             } else {
            //     //                 depositToken(txn_id, amounti);
            //     //             }
            //     //         });
            //     // }
            // }
        }
    };

    const getBalance = async () => {
        if (account !== user?.cryptoAccount) {
            Api.updateUserInfo({ cryptoAccount: account, update: false }).then(({ data }) => {
                dispatch(UpdateInfo(data));
            });
        }
        if (account && currency.abi) {
            try {
                const web3 = new Web3(library.provider);
                if (currency.contractAddress === ethereum) {
                    const balances = await web3.eth.getBalance(account);
                    const amounti = formatUnits(balances, 18);
                    setBalance(Number(amounti));
                } else {
                    const contract = new web3.eth.Contract(currency.abi, currency.contractAddress);
                    const balances = await contract.methods.balanceOf(account).call();
                    const decimals = await contract.methods.decimals().call();
                    const amounti = formatUnits(balances, decimals);
                    setBalance(Number(amounti));
                }
            } catch (error) {
                window.location.reload();
                console.log(error);
            }
        }
    };

    useEffect(() => {
        if (active) {
            getBalance();
        }
        // eslint-disable-next-line
    }, [active, currency]);

    useEffect(() => {
        if (user?.cryptoAccount) handleClick();
        // eslint-disable-next-line
    }, [user]);

    return (
        <div ref={ref} tabIndex={-1}>
            <MainCard
                style={modalStyle}
                sx={{
                    position: 'absolute',
                    width: { xs: 280, lg: 450 },
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
                divider={false}
                title={`${formatMessage({ id: 'Deposit' })} ${currency.name}`}
                content={false}
                secondary={
                    <IconButton onClick={functions.onDepositMVisible}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                }
            >
                <CardContent sx={{ mb: 2, pt: 0 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12}>
                            <Stack
                                spacing={1}
                                direction="row"
                                alignItems="center"
                                sx={{ cursor: 'pointer' }}
                                onClick={() => setAmount(balance)}
                            >
                                <img src={currency.icon} alt="solana icon" width={20} height={20} />
                                <Typography className="h6">
                                    {toNumberTag(balance)} {currency.symbol} <FormattedMessage id="Available" />
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                            <TextField
                                type="number"
                                fullWidth
                                label={formatMessage({ id: 'Deposit amount' })}
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Alert variant="outlined" severity="warning" sx={{ borderColor: theme.palette.warning.main }}>
                                <FormattedMessage id="Minimum Deposit" />: {currency.minDeposit} {currency.symbol}
                            </Alert>
                        </Grid>
                        <Grid item xs={12}>
                            <AnimateButton>
                                <Button
                                    disabled={loading || amount === '' || Number(amount) === 0}
                                    disableElevation
                                    fullWidth
                                    onClick={onDepositToken}
                                    size="large"
                                    variant="outlined"
                                    sx={{
                                        color: 'grey.700',
                                        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[50],
                                        borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.light + 20 : theme.palette.grey[100]
                                    }}
                                >
                                    {loading && <CircularProgress size={20} sx={{ mr: 1 }} />}
                                    <FormattedMessage id="Deposit" />
                                </Button>
                            </AnimateButton>
                        </Grid>
                    </Grid>
                </CardContent>
            </MainCard>
        </div>
    );
});

export default DepositToken;
