import { useSelector } from 'react-redux';
import { Card, CardHeader, Grid, Stack, Typography } from '@mui/material';

import useConfig from 'hooks/useConfig';

import { toNumber } from 'utils/number';

import { MultibetIcon } from 'ui-component/SvgIcon';
import Transitions from 'ui-component/extended/Transitions';


export default function RecentBets() {

    const { boxShadow } = useConfig();
    const recentBets: any = useSelector((state: any) => state.sports.recentBets);

    return (
        <Card
            sx={{
                p: 1,
                borderRadius: '8px',
                boxShadow
            }}
        >
            <Typography
                sx={{
                    fontWeight: '500',
                    fontSize: '0.9rem',
                    marginBottom: '8px',
                    textAlign: 'center',
                    color: '#fff'
                }}
            >
                Recent Bets
            </Typography>
            <Grid item>
                {recentBets.map((rBet: any, key: number) => {
                    return (
                        <Transitions key={key} in direction="left" type="slide">
                            <Card
                                sx={{
                                    mb: 1,
                                    boxShadow
                                }}
                                style={{ borderRadius: '4px' }}
                            >
                                <CardHeader
                                    sx={{
                                        background: '#3F4357',
                                        p: 1.5,
                                        '& .MuiCardHeader-title': {
                                            fontSize: '14px'
                                        },
                                        '& svg': {
                                            fontSize: '16px'
                                        },
                                        boxShadow
                                    }}
                                    title={
                                        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                {rBet.type === 'multi' ? (
                                                    <MultibetIcon />
                                                ) : (
                                                    <i
                                                        className={`sportsicons sportsicon-${rBet.sport[0].SportId}`}
                                                        style={{ fontSize: '20px' }}
                                                    />
                                                )}
                                            </Stack>
                                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                                <Typography variant="body2" color="primary">
                                                    Bet:&nbsp;
                                                </Typography>
                                                <Typography variant="body2" className="text-ellipse" color="#fff" sx={{ maxWidth: '100px' }}>
                                                    {toNumber(rBet.stake)}
                                                </Typography>
                                                <img width="16px" src={rBet.currency.icon} alt="icon" />
                                            </Stack>
                                            <Stack direction="row">
                                                <Typography variant="body2" color="primary">
                                                    Odd:&nbsp;
                                                </Typography>
                                                <Typography variant="body2" color="#fff">
                                                    {toNumber(rBet.odds)}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    }
                                />
                            </Card>
                        </Transitions>
                    )
                })}
            </Grid>
        </Card>
    )
}
