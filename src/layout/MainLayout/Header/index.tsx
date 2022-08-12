import { useNavigate } from 'react-router-dom';
import { useTheme, Box, useMediaQuery } from '@mui/material';

import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import { HOME_PATH } from 'config';

import { useDispatch, useSelector } from 'store';

import Logo1Img from 'assets/images/logo/logo.png';
import Logo2Img from 'assets/images/logo/200xlogo.png';

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
            <WalletModalProvider>
                <WalletMultiButton className="btn btn-primary" />
            </WalletModalProvider>
            {/* {isLoggedIn ? (
                <WalletModalProvider>
                    <WalletMultiButton className="btn btn-primary" />
                </WalletModalProvider>
            ) : (
                <WalletModalProvider>
                    <WalletMultiButton className="btn btn-primary" />
                </WalletModalProvider>
            )} */}
        </>
    );
};

export default Header;
