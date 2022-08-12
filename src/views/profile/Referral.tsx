import { useEffect, useState } from 'react';
import { Divider, Grid, IconButton, InputAdornment, Skeleton, Stack, TextField, Tooltip, Typography } from '@mui/material';
import ContentCopyTwoToneIcon from '@mui/icons-material/ContentCopyTwoTone';

import { FormattedMessage, useIntl } from 'react-intl';
import CopyToClipboard from 'react-copy-to-clipboard';

import { BASE_URL } from 'config';

import useApi from 'hooks/useApi';
import useConfig from 'hooks/useConfig';

import { useSelector } from 'store';
import { gridSpacing } from 'store/constant';

import snackbar from 'utils/snackbar';
import { toNumberTag } from 'utils/number';

import SubCard from 'ui-component/cards/SubCard';

const initReferral = { rewards: 0, invited: 0 };

interface ReferralProps {
    rewards: number;
    invited: number;
}

const Referral = () => {
    const Api = useApi();
    const { boxShadow } = useConfig();
    const { formatMessage } = useIntl();
    const { user } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState<boolean>(false);
    const [referral, setReferral] = useState<ReferralProps>(initReferral);

    const getReferral = () => {
        setLoading(true);
        Api.getReferral()
            .then(({ data }) => {
                setLoading(false);
                setReferral(data);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        getReferral();
        // eslint-disable-next-line
    }, []);

    if (loading) return <Skeleton variant="rectangular" height={300} sx={{ borderRadius: '18px', boxShadow }} />;

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Typography variant="h3">
                    <FormattedMessage id="Referral" />
                </Typography>
                <Divider sx={{ mt: 2 }} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <SubCard>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <Typography variant="h4">
                                <FormattedMessage id="Total Rewards" />
                            </Typography>
                        </Grid>
                        <Grid item xs={12} style={{ paddingTop: '1rem' }}>
                            <Typography variant="h4">{toNumberTag(referral.rewards, 2)} USD</Typography>
                            <Divider sx={{ mt: 2 }} />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h4">
                                <FormattedMessage id="Inviter Rewards" />
                            </Typography>
                            <Stack direction="row" justifyContent="space-between" mt={2}>
                                <Typography variant="subtitle2">
                                    <FormattedMessage id="You're earning 5 % of the winning bets your referrals play." />
                                </Typography>
                                <Typography className="h6">{toNumberTag(referral.rewards, 2)} USD</Typography>
                            </Stack>
                            <Divider sx={{ mt: 2 }} />
                        </Grid>
                        <Grid item xs={12}>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="h4">
                                    <FormattedMessage id="Total Invited" />
                                </Typography>
                                <Typography variant="h4">{referral.invited}</Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </SubCard>
            </Grid>
            <Grid item xs={12} sm={6}>
                <SubCard title={formatMessage({ id: 'Invite your friends to boibook and earn 5 % of their winning bets.' })}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={formatMessage({ id: 'Your Referral Link' })}
                                type="text"
                                value={`${BASE_URL}?c=${user.iReferral}`}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <CopyToClipboard
                                                text={`${BASE_URL}?c=${user.iReferral}`}
                                                onCopy={() => snackbar(formatMessage({ id: 'Copied' }))}
                                            >
                                                <Tooltip title="Copy">
                                                    <IconButton aria-label="Copy from another element" edge="end" size="large">
                                                        <ContentCopyTwoToneIcon sx={{ fontSize: '1.1rem' }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </CopyToClipboard>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label={formatMessage({ id: 'Your Referral Code' })}
                                type="text"
                                value={user.iReferral}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <CopyToClipboard text={user.iReferral} onCopy={() => snackbar(formatMessage({ id: 'Copied' }))}>
                                                <Tooltip title="Copy">
                                                    <IconButton aria-label="Copy from another element" edge="end" size="large">
                                                        <ContentCopyTwoToneIcon sx={{ fontSize: '1.1rem' }} />
                                                    </IconButton>
                                                </Tooltip>
                                            </CopyToClipboard>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Grid>
                    </Grid>
                </SubCard>
            </Grid>
        </Grid>
    );
};

export default Referral;
