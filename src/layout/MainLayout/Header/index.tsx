import React, { useEffect, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import {
    useTheme,
    Box,
    Button,
    ButtonGroup,
    useMediaQuery,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    CircularProgress,
    OutlinedInput,
    Stack,
    Typography
} from '@mui/material';

import { IconWallet } from '@tabler/icons';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import ReCAPTCHA from 'react-google-recaptcha';
import { FormattedMessage, useIntl } from 'react-intl';

import * as Yup from 'yup';
import { Formik } from 'formik';
import Web3 from 'web3';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import bs58 from 'bs58';

import useApi from 'hooks/useApi';
import useConfig from 'hooks/useConfig';
import useScriptRef from 'hooks/useScriptRef';

import { Login } from 'store/reducers/auth';

import snackbar from 'utils/snackbar';
import { CoinbaseWallet, injected, switchNetwork, WalletConnect } from 'utils/connectors';

import Metamask from 'assets/images/icons/metamask.svg';
import AnimateButton from 'ui-component/extended/AnimateButton';

import { HOME_PATH } from 'config';
import { toNumber } from 'utils/number';

import { useDispatch, useSelector } from 'store';
import { ChangePage } from 'store/reducers/menu';

import Logo1Img from 'assets/images/logo/logo.png';
import Logo2Img from 'assets/images/logo/200xlogo.png';
import PhantomLogo from 'assets/images/icons/phantom-logo.png';

import SearchSection from './SearchSection';
import ProfileSection from './ProfileSection';
import BetslipSection from './BetslipSection';
import { PublicKey } from '@solana/web3.js';

declare global {
    interface Window {
        solana?: any;
    }
}

const Header = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isMobile = useMediaQuery('(max-width:767px)');
    const { currency, balance, isLoggedIn } = useSelector((state) => state.auth);

    const scriptedRef = useScriptRef();
    const { formatMessage } = useIntl();
    const recaptchaInputRef = useRef({}) as any;
    const { borderRadius, locale } = useConfig();
    const { account, activate, library, active } = useWeb3React();
    const { signInAddress, checkAddress, login, signUpAddress } = useApi();
    const [checked, setChecked] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [recaptcha, setRecaptcha] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    // const { connection } = useConnection();
    // const { publicKey, signTransaction } = useWallet();

    const [publicKey, setPublicKey] = useState();

    const loginHandler = async (values: { email: string; password: string }, { setErrors, setStatus, setSubmitting }: any) => {
        try {
            await login(values.email, values.password, recaptcha)
                .then(
                    ({ data }) => {
                        console.log(data);
                        onLogin(data);
                    },
                    (err: any) => {
                        if (scriptedRef.current) {
                            setStatus({ success: false });
                            setErrors({ submit: err.message });
                            setSubmitting(false);
                        }
                    }
                )
                .catch((error) => {
                    if (recaptchaInputRef.current) {
                        recaptchaInputRef.current.reset();
                    }
                });
        } catch (err: any) {
            if (scriptedRef.current) {
                setStatus({ success: false });
                setErrors({ submit: err.message });
                setSubmitting(false);
            }
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event: React.SyntheticEvent) => {
        event.preventDefault();
    };

    const onLogin = (user: any) => {
        dispatch(Login(user));
        dispatch(ChangePage(''));
        snackbar(
            <>
                You have successfully logged in as a user to boibook.
                <br />
                Now you can start to play. Enjoy!
            </>
        );
        if (
            window.location.pathname.toString().indexOf('blackjack') !== -1 ||
            window.location.pathname.toString().indexOf('roulette') !== -1
        ) {
            window.location.reload();
        }
    };

    const handleAuthenticate = (publicAddress: PublicKey, signature: []) => {
        console.log('over here');
        signInAddress(publicAddress.toBase58(), bs58.encode(signature))
            .then(({ data }) => {
                console.log(data);
                setLoading(false);
                onLogin(data);
            })
            .catch((error) => {
                setLoading(false);
            });
    };

    const handleSignMessage = async ({ publicAddress, nonce }: any) => {
        try {
            const provider = window.solana; // see "Detecting the Provider"
            const encodedMessage = new TextEncoder().encode(`boibook: ${nonce}`);
            const signRequestResult = await provider.signMessage(encodedMessage, 'utf8');
            const pubKey = signRequestResult.publicKey;
            const signature = signRequestResult.signature;
            handleAuthenticate(pubKey, signature);
        } catch (error) {
            setLoading(false);
        }
    };

    const solanaLogin = async () => {
        if (publicKey) {
            setIsLogin(false);
            setLoading(true);
            checkAddress(publicKey as string)
                .then(({ data }: any) => {
                    if (data.status) {
                        handleSignMessage(data.user);
                    } else {
                        setTimeout(() => {
                            solanaRegister();
                        }, 2000);
                    }
                })
                .catch((error) => {
                    setTimeout(() => {
                        solanaRegister();
                    }, 2000);
                    setLoading(false);
                });
        }
    };

    const solanaRegister = () => {
        if (publicKey) {
            signUpAddress(publicKey as string)
                .then(({ data }: any) => {
                    snackbar(data);
                })
                .catch((error) => {
                    setLoading(false);
                    setIsLogin(false);
                });
        }
    };

    const handleLogin = async () => {
        setIsLogin(true);
        if (!publicKey) {
            // @ts-ignore
            const { solana } = window;

            if (solana) {
                try {
                    const response = await solana.connect();
                    setPublicKey(response.publicKey.toString());
                } catch (err) {
                    // { code: 4001, message: 'User rejected the request.' }
                }
            }
        }
    };

    useEffect(() => {
        if (publicKey && isLogin) solanaLogin();
        // eslint-disable-next-line
    }, [publicKey, isLogin]);

    return (
        <>
            <Box
                sx={{
                    width: 228,
                    display: 'flex',
                    [theme.breakpoints.down('md')]: {
                        width: 'auto'
                    }
                }}
            >
                <Box component="span" sx={{ display: 'block', flexGrow: 1 }}>
                    <a href={HOME_PATH} style={{ display: 'flex' }}>
                        <img
                            alt="Logo"
                            draggable={false}
                            src={isMobile ? Logo2Img : Logo1Img}
                            style={{ height: '79px', userSelect: 'none', padding: isMobile ? '20px 0' : '0px' }}
                        />
                    </a>
                </Box>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            {isLoggedIn ? (
                <>
                    <ButtonGroup
                        disableElevation
                        variant="contained"
                        sx={{
                            boxShadow:
                                'rgba(0, 0, 0, 0.2) 0px -1px 3px 0px, rgba(0, 0, 0, 0.12) 0px -1px 2px 0px, rgba(255, 255, 255, 0.04) 0px -1px 0px 0px inset'
                        }}
                    >
                        <Button sx={{ background: '#212637' }}>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                <Typography
                                    className="text-ellipse"
                                    sx={{
                                        lineHeight: '100%',
                                        maxWidth: '100px',
                                        '@media (max-width: 319px)': {
                                            maxWidth: '75px'
                                        }
                                    }}
                                >
                                    {toNumber(balance, 8, true)}
                                </Typography>
                                <img width="16px" src={currency.icon} alt="icon" />
                            </Stack>
                        </Button>
                        <Button
                            onClick={() => navigate('/user/wallet')}
                            sx={{
                                '@media (max-width: 767px)': {
                                    paddingLeft: 0,
                                    paddingRight: 0
                                }
                            }}
                        >
                            {isMobile ? <IconWallet stroke={1.5} size="20px" /> : <FormattedMessage id="Wallet" />}
                        </Button>
                    </ButtonGroup>
                    <Box sx={{ flexGrow: 1 }} />
                    <SearchSection />
                    {!isMobile && <BetslipSection />}
                    <ProfileSection />
                </>
            ) : (
                <AnimateButton>
                    <Button
                        onClick={() => handleLogin()}
                        variant="outlined"
                        color="secondary"
                        sx={{
                            mr: 2,
                            ':hover': {
                                boxShadow: 'none'
                            }
                        }}
                    >
                        <img src={PhantomLogo} alt="" style={{ marginRight: '0.5rem', width: '20px' }} />
                        <FormattedMessage id="Select Wallet" />
                    </Button>
                </AnimateButton>
            )}
        </>
    );
};

export default Header;
