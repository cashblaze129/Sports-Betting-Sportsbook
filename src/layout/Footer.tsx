import { useEffect, useState } from 'react';
import { Link as NavLink } from 'react-router-dom';

import { Box, Grid, Link, Stack, Typography } from '@mui/material';
import { IconBrandTwitter, IconBrandInstagram, IconBrandTelegram, IconBrandDiscord } from '@tabler/icons';

import { FormattedMessage } from 'react-intl';

import Axios from 'utils/axios';
import { useDispatch } from 'store';
import { ChangePage } from 'store/reducers/menu';
import LogoSection from './MainLayout/LogoSection';

interface Currency {
    name: string;
    icon: string;
    officialLink: string;
}

const Footer = () => {
    const dispatch = useDispatch();
    const [currencies, setCurrencies] = useState<Currency[]>([]);

    useEffect(() => {
        Axios.post('api/v1/payments/getPaymentMethod', {}).then(({ data }) => {
            setCurrencies(data);
        });
    }, []);

    return (
        <Box
            sx={{
                '@media (max-width:767px)': {
                    marginBottom: '70px'
                }
            }}
        >
            <Grid container columnSpacing={{ xs: 5, sm: 10, md: 20 }} sx={{ mb: 3 }} rowSpacing={2}>
                {/* <Grid item sm={12} md={12}>
                </Grid> */}
                <Grid item sm={12} md={5}>
                    <LogoSection />
                    {/* <Typography>
                        <FormattedMessage id="site-details" />
                    </Typography> */}
                </Grid>
                <Grid item sm={12} md={7}>
                    <Grid container columnSpacing={{ xs: 3, sm: 5, md: 10 }} rowSpacing={2}>
                        <Grid item sm={12} md={4}>
                            <Typography onClick={() => dispatch(ChangePage('login'))} className="h6" sx={{ cursor: 'pointer' }}>
                                <FormattedMessage id="Sign in" />
                            </Typography>
                            <Typography onClick={() => dispatch(ChangePage('register'))} className="h6" sx={{ cursor: 'pointer' }}>
                                <FormattedMessage id="Sign up" />
                            </Typography>
                            <Typography
                                to="/pages/terms"
                                component={NavLink}
                                className="h6"
                                style={{ textDecoration: 'none', display: 'block' }}
                            >
                                <FormattedMessage id="Terms" />
                            </Typography>
                            <Typography
                                to="/pages/contact-us"
                                component={NavLink}
                                className="h6"
                                style={{ textDecoration: 'none', display: 'block' }}
                            >
                                <FormattedMessage id="Contact us" />
                            </Typography>
                            <Typography
                                to="/pages/privacy-policy"
                                component={NavLink}
                                className="h6"
                                style={{ textDecoration: 'none', display: 'block' }}
                            >
                                <FormattedMessage id="Privacy Policy" />
                            </Typography>
                        </Grid>
                        <Grid item sm={12} md={8}>
                            <Typography variant="h5" mb={1.5}>
                                <FormattedMessage id="Get in touch" />
                            </Typography>
                            <Stack direction="row" spacing={2}>
                                <Link href="https://discord.gg/NCjZKTeW6J" target="_blank">
                                    <IconBrandDiscord size={30} />
                                </Link>
                                <Link href="https://t.me/boibookSupport" target="_blank">
                                    <IconBrandTelegram size={30} />
                                </Link>
                                <Link href="https://www.instagram.com/boibook/" target="_blank">
                                    <IconBrandInstagram size={30} />
                                </Link>
                                <Link href="https://twitter.com/boibook_" target="_blank">
                                    <IconBrandTwitter size={30} />
                                </Link>
                            </Stack>
                            <Typography variant="h5" mt={3}>
                                <FormattedMessage id="Accepted currencies" />
                            </Typography>
                            <Stack sx={{ display: 'flex', mt: 1.5, flexWrap: 'wrap', gap: 2 }} direction="row">
                                {currencies.map((item, key) => (
                                    <Link key={key} href={item.officialLink} target="_blank">
                                        <img style={{ width: '30px', height: '30px' }} src={item.icon} alt={item.name} />
                                    </Link>
                                ))}
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Footer;
