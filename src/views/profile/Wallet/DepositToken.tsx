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

import { web3 as solWeb3 } from '@project-serum/anchor';
import * as splToken from '@solana/spl-token';

import { FormattedMessage, useIntl } from 'react-intl';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import useApi from 'hooks/useApi';

import snackbar from 'utils/snackbar';
import { toNumberTag } from 'utils/number';

import { useDispatch, useSelector } from 'store';
import { UpdateInfo } from 'store/reducers/auth';

import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import config from 'config';

interface Props extends CardProps {
    modalStyle: React.CSSProperties;
    functions: any;
}

const DepositToken = forwardRef(({ modalStyle, functions }: Props, ref: React.Ref<HTMLDivElement>) => {
    const Api = useApi();
    const theme = useTheme();
    const dispatch = useDispatch();
    const { formatMessage } = useIntl();
    const { currency } = useSelector((state) => state.auth);
    const balance: number = 0;
    const [loading, setLoading] = useState<boolean>(false);
    const [amount, setAmount] = useState<number | string>('');

    const { publicKey, wallet, connected }: any = useWallet();
    const { connection } = useConnection();

    const depositToken = (signature: string, amounti: Number) => {
        Api.depositToken({
            amounti: amounti.toString(),
            amount,
            from: publicKey?.toString(),
            address: currency.tokenMintAccount,
            receiver: config.adminWallet,
            signature
        })
            .then(({ data }) => {
                snackbar(formatMessage({ id: 'Success! Please wait for a minute.' }), 'success');
                setLoading(false);
                functions.onDepositMVisible();
            })
            .catch(() => {
                setLoading(false);
            });
    };

    const handleTransferToken = async (tokenMintAddress: any) => {
        console.log('1');
        const toWalletPubKey = new solWeb3.PublicKey(config.adminWallet);
        console.log('2');
        // Construct my token class
        const myMint = new solWeb3.PublicKey(tokenMintAddress);
        console.log('3');
        const myToken = new splToken.Token(connection, myMint, splToken.TOKEN_PROGRAM_ID, wallet);
        console.log('4');
        // Create associated token accounts for my token if they don't exist yet
        const fromTokenAccount = await myToken.getOrCreateAssociatedAccountInfo(publicKey);
        console.log('5');
        const toTokenAccount = await myToken.getOrCreateAssociatedAccountInfo(toWalletPubKey);
        console.log('6');
        // Add token transfer instructions to transaction
        const transaction = new solWeb3.Transaction().add(
            splToken.Token.createTransferInstruction(
                splToken.TOKEN_PROGRAM_ID,
                fromTokenAccount.address,
                toTokenAccount.address,
                publicKey,
                [],
                0
            )
        );
        console.log('7');
        // Sign transaction, broadcast, and confirm
        const signature = await solWeb3.sendAndConfirmTransaction(connection, transaction, [wallet]);
        console.log('8');
        return signature;
    };

    // Sol transfer
    const transferSOL = async () => {
        const txWallet: any = wallet?.adapter;

        // Detecing and storing the phantom wallet of the user (creator in this case)
        const provider = window?.solana;

        // I have hardcoded my secondary wallet address here. You can take this address either from user input or your DB or wherever
        const recieverWallet = new solWeb3.PublicKey(config.adminWallet);

        // Investing 1 SOL. Remember 1 Lamport = 10^-9 SOL.
        const transaction = new solWeb3.Transaction().add(
            solWeb3.SystemProgram.transfer({
                fromPubkey: txWallet.publicKey,
                toPubkey: recieverWallet,
                lamports: Number(amount) * solWeb3.LAMPORTS_PER_SOL
            })
        );

        // Setting the variables for the transaction
        transaction.feePayer = await txWallet.publicKey;
        const blockhashObj = await connection.getRecentBlockhash();
        transaction.recentBlockhash = await blockhashObj.blockhash;

        // Transaction constructor initialized successfully
        if (transaction) {
            console.log('Txn created successfully');
        }

        // Request creator to sign the transaction (allow the transaction)
        const signed = await provider.signTransaction(transaction);

        // The signature is generated
        const signature = await connection.sendRawTransaction(signed.serialize());
        // Confirm whether the transaction went through or not
        await connection.confirmTransaction(signature);

        // Signature chhap diya idhar
        return signature;
    };

    const onDepositToken = async () => {
        if (!connected) {
            snackbar(formatMessage({ id: 'Please connect wallet.' }), 'error');
        } else if (amount === '' || Number(amount) === 0 || Number(amount) < Number(currency.minDeposit)) {
            snackbar(formatMessage({ id: 'Please input valid amount.' }), 'error');
        } else {
            setLoading(true);
            let signature: any;
            if (currency.symbol === 'SOL') {
                signature = await transferSOL();
            } else {
                signature = await handleTransferToken(currency.tokenMintAccount);
                setLoading(false);
            }
            if (signature) {
                depositToken(signature, Number(amount));
            }
        }
    };

    const getBalance = async () => {
        Api.updateUserInfo({ cryptoAccount: publicKey.toString(), update: false }).then(({ data }) => {
            dispatch(UpdateInfo(data));
        });
    };

    useEffect(() => {
        if (connected) {
            getBalance();
        }
        // eslint-disable-next-line
    }, [connected, currency]);

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
