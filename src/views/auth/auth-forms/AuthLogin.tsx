import React, { useEffect, useRef, useState } from 'react';

import {
    Box,
    Button,
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
    Typography,
    useTheme
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import ReCAPTCHA from 'react-google-recaptcha';
import { FormattedMessage, useIntl } from 'react-intl';

import * as Yup from 'yup';
import { Formik } from 'formik';
import Web3 from 'web3';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';

import config from 'config';

import useApi from 'hooks/useApi';
import useConfig from 'hooks/useConfig';
import useScriptRef from 'hooks/useScriptRef';

import { useDispatch } from 'store';
import { Login } from 'store/reducers/auth';
import { ChangePage } from 'store/reducers/menu';

import snackbar from 'utils/snackbar';
import { CoinbaseWallet, injected, switchNetwork, WalletConnect } from 'utils/connectors';

import Wallet from 'assets/images/icons/wallet.svg';
import Metamask from 'assets/images/icons/metamask.svg';
import Coinbase from 'assets/images/icons/coinbase.svg';
import AnimateButton from 'ui-component/extended/AnimateButton';

const AuthLogin = ({ loginProp, ...others }: { loginProp?: number }) => {
    const theme = useTheme();
    const scriptedRef = useScriptRef();
    const { formatMessage } = useIntl();
    const recaptchaInputRef = useRef({}) as any;
    const { borderRadius, locale } = useConfig();
    const dispatch = useDispatch();
    const { account, activate, library, active } = useWeb3React();
    const { signInAddress, checkAddress, login } = useApi();
    const [checked, setChecked] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [recaptcha, setRecaptcha] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

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

    const handleAuthenticate = (publicAddress: string, signature: string) => {
        signInAddress(publicAddress, signature)
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
            const web3 = new Web3(library.provider);
            const signature = await web3.eth.personal.sign(`boibook: ${nonce}`, publicAddress, '');
            handleAuthenticate(publicAddress, signature);
        } catch (error) {
            setLoading(false);
        }
    };

    const handleSignup = () => {
        dispatch(ChangePage('regiser'));
    };

    const metamaskLogin = async () => {
        setIsLogin(false);
        setLoading(true);
        checkAddress(account as string)
            .then(({ data }: any) => {
                if (data.status) {
                    handleSignMessage(data.user);
                } else {
                    handleSignup();
                }
            })
            .catch((error) => {
                setLoading(false);
            });
    };

    const handleClick = async (params: any) => {
        setIsLogin(true);
        await switchNetwork();
        if (!active) {
            activate(params, undefined, true).catch((error) => {
                if (error instanceof UnsupportedChainIdError) {
                    activate(params);
                }
            });
        }
    };

    useEffect(() => {
        if (active && isLogin) metamaskLogin();
        // eslint-disable-next-line
    }, [active, isLogin]);

    return (
        <>
            <Grid container direction="column" justifyContent="center" spacing={2}>
                <Grid item xs={12}>
                    <Stack direction="row" justifyContent="space-around">
                        <AnimateButton>
                            <Button
                                disabled={loading}
                                disableElevation
                                fullWidth
                                onClick={() => handleClick(injected)}
                                size="large"
                                variant="outlined"
                                sx={{
                                    color: 'grey.700',
                                    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[50],
                                    borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.light + 20 : theme.palette.grey[100]
                                }}
                            >
                                <Box sx={{ position: 'relative', width: '36px', height: '36px', mx: 2 }}>
                                    {loading && <CircularProgress size={36} />}
                                    <img
                                        src={Metamask}
                                        alt="metamask"
                                        width={26}
                                        height={26}
                                        style={{
                                            position: 'absolute',
                                            transform: 'translate(-50%, -50%)',
                                            top: '50%',
                                            left: '50%'
                                        }}
                                    />
                                </Box>
                            </Button>
                        </AnimateButton>
                        <AnimateButton>
                            <Button
                                disabled={loading}
                                disableElevation
                                fullWidth
                                onClick={() => handleClick(CoinbaseWallet)}
                                size="large"
                                variant="outlined"
                                sx={{
                                    color: 'grey.700',
                                    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[50],
                                    borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.light + 20 : theme.palette.grey[100]
                                }}
                            >
                                <Box sx={{ position: 'relative', width: '36px', height: '36px', mx: 2 }}>
                                    {loading && <CircularProgress size={36} />}
                                    <img
                                        src={Coinbase}
                                        alt="coinbase"
                                        width={26}
                                        height={26}
                                        style={{
                                            position: 'absolute',
                                            transform: 'translate(-50%, -50%)',
                                            top: '50%',
                                            left: '50%'
                                        }}
                                    />
                                </Box>
                            </Button>
                        </AnimateButton>
                        <AnimateButton>
                            <Button
                                disabled={loading}
                                disableElevation
                                fullWidth
                                onClick={() => handleClick(WalletConnect)}
                                size="large"
                                variant="outlined"
                                sx={{
                                    color: 'grey.700',
                                    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[50],
                                    borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.light + 20 : theme.palette.grey[100]
                                }}
                            >
                                <Box sx={{ position: 'relative', width: '36px', height: '36px', mx: 2 }}>
                                    {loading && <CircularProgress size={36} />}
                                    <img
                                        src={Wallet}
                                        alt="wallet"
                                        width={26}
                                        height={26}
                                        style={{
                                            position: 'absolute',
                                            transform: 'translate(-50%, -50%)',
                                            top: '50%',
                                            left: '50%'
                                        }}
                                    />
                                </Box>
                            </Button>
                        </AnimateButton>
                    </Stack>
                </Grid>
                <Grid item xs={12}>
                    <Box
                        sx={{
                            alignItems: 'center',
                            display: 'flex'
                        }}
                    >
                        <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />

                        <Button
                            variant="outlined"
                            sx={{
                                cursor: 'unset',
                                m: 2,
                                py: 0.5,
                                px: 7,
                                borderColor:
                                    theme.palette.mode === 'dark'
                                        ? `${theme.palette.dark.light + 20} !important`
                                        : `${theme.palette.grey[100]} !important`,
                                color: `${theme.palette.grey[900]}!important`,
                                fontWeight: 500,
                                borderRadius: `${borderRadius}px`
                            }}
                            disableRipple
                            disabled
                        >
                            <FormattedMessage id="OR" />
                        </Button>
                        <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
                    </Box>
                </Grid>
                <Grid item xs={12} container alignItems="center" justifyContent="center">
                    <Box sx={{ mb: 2 }}>
                        <Typography className="h6">
                            <FormattedMessage id="Sign in with Email address" />
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
            <Formik
                initialValues={{
                    email: '',
                    password: '',
                    submit: null
                }}
                validationSchema={Yup.object().shape({
                    email: Yup.string()
                        .max(255)
                        .required(formatMessage({ id: 'Email is required' })),
                    password: Yup.string()
                        .max(255)
                        .required(formatMessage({ id: 'Password is required' }))
                })}
                onSubmit={loginHandler}
            >
                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit} {...others}>
                        <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
                            <InputLabel htmlFor="outlined-adornment-email-login">
                                <FormattedMessage id="Email Address / Username" />
                            </InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-email-login"
                                type="email"
                                value={values.email}
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                label={formatMessage({ id: 'Email Address / Username' })}
                                inputProps={{}}
                            />
                            {touched.email && errors.email && (
                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                    {errors.email}
                                </FormHelperText>
                            )}
                        </FormControl>

                        <FormControl
                            fullWidth
                            error={Boolean(touched.password && errors.password)}
                            sx={{ ...theme.typography.customInput }}
                        >
                            <InputLabel htmlFor="outlined-adornment-password-login">
                                <FormattedMessage id="Password" />
                            </InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password-login"
                                type={showPassword ? 'text' : 'password'}
                                value={values.password}
                                name="password"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            size="large"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label={formatMessage({ id: 'Password' })}
                                inputProps={{}}
                            />
                            {touched.password && errors.password && (
                                <FormHelperText error id="standard-weight-helper-text-password-login">
                                    {errors.password}
                                </FormHelperText>
                            )}
                        </FormControl>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={checked}
                                        onChange={(event) => setChecked(event.target.checked)}
                                        name="checked"
                                        color="primary"
                                    />
                                }
                                label={formatMessage({ id: 'Remember me' })}
                            />
                            <Typography
                                onClick={() => dispatch(ChangePage('forgot'))}
                                className="h6"
                                color="secondary"
                                sx={{ cursor: 'pointer' }}
                            >
                                <FormattedMessage id="Forgot Password?" />
                            </Typography>
                        </Stack>
                        {errors.submit && (
                            <Box sx={{ mt: 3 }}>
                                <FormHelperText error>{errors.submit}</FormHelperText>
                            </Box>
                        )}

                        <Box sx={{ mt: 2 }}>
                            <AnimateButton>
                                <Button
                                    disableElevation
                                    disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                >
                                    {isSubmitting && <CircularProgress size={20} sx={{ mr: 1 }} />}
                                    <FormattedMessage id="Sign in" />
                                </Button>
                            </AnimateButton>
                        </Box>
                        <Box sx={{ alignItems: 'center', justifyContent: 'center', display: 'flex', mt: 2, width: '100%' }}>
                            <ReCAPTCHA
                                size="normal"
                                sitekey={config.RECAPTCHA_SITE_KEY}
                                ref={recaptchaInputRef}
                                onChange={setRecaptcha}
                                onExpired={() => setRecaptcha(null)}
                                hl={locale}
                            />
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default AuthLogin;
