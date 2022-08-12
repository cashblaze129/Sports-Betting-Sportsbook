import { useNavigate } from 'react-router-dom';
import { useTheme, Box, Button, ButtonGroup, Stack, Typography, useMediaQuery } from '@mui/material';

import { IconWallet } from '@tabler/icons';
import { FormattedMessage } from 'react-intl';

import { HOME_PATH } from 'config';
import { toNumber } from 'utils/number';
import AnimateButton from 'ui-component/extended/AnimateButton';

import { useDispatch, useSelector } from 'store';
import { ChangePage } from 'store/reducers/menu';

import Logo1Img from 'assets/images/logo/logo.png';
import Logo2Img from 'assets/images/logo/200xlogo.png';
import MetamaskIcon from 'assets/images/icons/metamask.svg';

import SearchSection from './SearchSection';
import ProfileSection from './ProfileSection';
import BetslipSection from './BetslipSection';

const Header = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isMobile = useMediaQuery('(max-width:767px)');
    const { currency, balance, isLoggedIn } = useSelector((state) => state.auth);

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
                <>
                    <AnimateButton>
                        <Button
                            onClick={() => dispatch(ChangePage('login'))}
                            variant="text"
                            color="secondary"
                            sx={{
                                mr: 2,
                                ':hover': {
                                    boxShadow: 'none'
                                }
                            }}
                        >
                            <img src={MetamaskIcon} alt="" style={{ marginRight: '0.5rem' }} />
                            <FormattedMessage id="Sign in" />
                        </Button>
                    </AnimateButton>
                    <AnimateButton>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => dispatch(ChangePage('register'))}
                            sx={{
                                boxShadow: theme.customShadows.secondary,
                                ':hover': {
                                    boxShadow: 'none'
                                }
                            }}
                        >
                            <FormattedMessage id="Sign up" />
                        </Button>
                    </AnimateButton>
                </>
            )}
        </>
    );
};

export default Header;
