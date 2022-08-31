import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useTheme, Box, Button, ButtonGroup, useMediaQuery, Stack, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { IconWallet } from '@tabler/icons';
import { FormattedMessage } from 'react-intl';
import bs58 from 'bs58';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

import useApi from 'hooks/useApi';
import { Login } from 'store/reducers/auth';

import snackbar from 'utils/snackbar';

import config from 'config';
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
    const { logout, signInAddress, checkAddress, signUpAddress } = useApi();
    const [loading, setLoading] = useState(false);

    const [publicKeyAsString, setPublicKeyAsString] = useState('');
    // const { connection } = useConnection();
    const { publicKey, connected } = useWallet();

    const onLogin = (userInfo: any) => {
        dispatch(Login(userInfo));
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
        signInAddress(publicAddress.toBase58(), bs58.encode(signature))
            .then(({ data }) => {
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
        let pubString = '';
        if (publicKeyAsString) {
            pubString = publicKeyAsString || '';
        } else if (connected) {
            pubString = publicKey?.toString() || '';
        }
        if (pubString) {
            setLoading(true);
            checkAddress(pubString as string)
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
        if (publicKeyAsString) {
            signUpAddress(publicKeyAsString as string)
                .then(({ data }: any) => {
                    snackbar(data);
                })
                .catch((error) => {
                    setLoading(false);
                });
        }
    };

    const logoutFunc = () => {
        logout();
        localStorage.clear();
        if (window) {
            // @ts-ignore
            window?.location.reload();
        }
    };

    useEffect(() => {
        if (publicKeyAsString) {
            if (publicKey?.toString() !== publicKeyAsString) {
                logoutFunc();
            }
        }
        if (publicKey && !isLoggedIn) {
            setPublicKeyAsString(publicKey.toString());
        }
        // eslint-disable-next-line
    }, [publicKey]);

    useEffect(() => {
        if (isLoggedIn && !connected) {
            logout();
        }
        // eslint-disable-next-line
    }, [isLoggedIn]);

    useEffect(() => {
        if (publicKeyAsString) {
            solanaLogin();
        }
        // eslint-disable-next-line
    }, [publicKeyAsString]);

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
                    <Box
                        component="button"
                        sx={{ display: 'flex', bgcolor: 'transparent', cursor: 'pointer', boxShadow: 'none', border: 0 }}
                        onClick={() => {
                            navigate('/sports/1');
                        }}
                    >
                        <img
                            alt="Logo"
                            draggable={false}
                            src={isMobile ? Logo2Img : Logo1Img}
                            style={{ height: '79px', userSelect: 'none', padding: isMobile ? '20px 0' : '0px' }}
                        />
                    </Box>
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
                        <Button sx={{ background: '#373636' }}>
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
                <WalletModalProvider>
                    <Box
                        sx={{
                            '& button': {
                                backgroundColor: config.dark2,
                                color: 'white',
                                border: `1px solid ${config.grey2}`
                            }
                        }}
                    >
                        {publicKeyAsString || connected ? (
                            <LoadingButton
                                loading={loading}
                                sx={{ backgroundColor: config.dark2, color: 'white', border: `1px solid ${config.grey2}` }}
                                variant="outlined"
                                onClick={() => solanaLogin()}
                            >
                                <img src={PhantomLogo} alt="" style={{ marginRight: '0.5rem', width: '20px' }} />
                                <FormattedMessage id="Sign Wallet" />
                            </LoadingButton>
                        ) : (
                            <Box
                                sx={{
                                    '& button': { height: '40px', fontSize: '0.875rem' },
                                    '& img': { width: '20px !important', height: '20px !important' }
                                }}
                            >
                                <WalletMultiButton />
                            </Box>
                        )}
                    </Box>
                </WalletModalProvider>
                // <LoadingButton
                //     loading={loading}
                //     sx={{ backgroundColor: config.dark2, color: 'white', border: `1px solid ${config.grey2}` }}
                //     variant="outlined"
                //     onClick={() => handleLogin()}
                // >
                //     <img src={PhantomLogo} alt="" style={{ marginRight: '0.5rem', width: '20px' }} />
                //     <FormattedMessage id="Select Wallet" />
                // </LoadingButton>
            )}
        </>
    );
};

export default Header;
