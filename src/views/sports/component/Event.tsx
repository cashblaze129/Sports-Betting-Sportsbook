import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Divider, IconButton, Stack, Typography, useMediaQuery } from '@mui/material';
import { FormattedMessage } from 'react-intl';

import moment from 'moment';

import { BASE_URL } from 'config';
import useConfig from 'hooks/useConfig';
import { EventProps, OddTypes } from 'types/sports';
import { addRemoveBetslip, checkActive, convertBetslipData, getIsLock, getMarkets, getName } from 'utils/sports';

import { useDispatch, useSelector } from 'store';
import { setBetslip } from 'store/reducers/sports';

import { Lock, OddWarraper, TeamAvatar, TeamName } from 'ui-component';
import OddNum from './OddNum';

const Event = ({ event, activeSports, isLive }: EventProps) => {
    const { locale } = useConfig();
    moment.locale(locale);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { drawerOpen } = useSelector((state) => state.menu);
    const isMobile = useMediaQuery(`(max-width:${drawerOpen ? 1024 : 767}px)`);
    const { betslipData } = useSelector((state) => state.sports);
    const { marketOne } = getMarkets(event, activeSports);
    const name = getName(activeSports);

    const eventsHandler = () => {
        navigate(`/events/${event.id}`, { state: { prevPath: location.pathname } });
    };

    const betHandler = (odd: any, oddType: OddTypes) => {
        if (!activeSports) return;
        const betslip = convertBetslipData({ event, odd, oddType, sports: activeSports });
        dispatch(setBetslip(addRemoveBetslip(betslipData, betslip)));
    };

    const MarketOne = () => {
        if (getIsLock({ isLive, item: marketOne, sports: activeSports, event })) {
            return <Lock />;
        }
        if (marketOne && marketOne.home_od !== '-' && marketOne.draw_od) {
            return (
                <>
                    <OddWarraper
                        gridColumn="span 4"
                        update={marketOne?.update1}
                        sx={{ justifyContent: 'center' }}
                        onClick={() => betHandler(marketOne, OddTypes.Home)}
                        active={checkActive(betslipData, marketOne.id, OddTypes.Home)}
                    >
                        <OddNum odd={marketOne.home_od} />
                    </OddWarraper>
                    <OddWarraper
                        gridColumn="span 4"
                        update={marketOne?.update3}
                        sx={{ justifyContent: 'center' }}
                        onClick={() => betHandler(marketOne, OddTypes.Draw)}
                        active={checkActive(betslipData, marketOne.id, OddTypes.Draw)}
                    >
                        <OddNum odd={marketOne.draw_od} />
                    </OddWarraper>
                    <OddWarraper
                        gridColumn="span 4"
                        update={marketOne?.update2}
                        sx={{ justifyContent: 'center' }}
                        onClick={() => betHandler(marketOne, OddTypes.Away)}
                        active={checkActive(betslipData, marketOne.id, OddTypes.Away)}
                    >
                        <OddNum odd={marketOne.away_od} />
                    </OddWarraper>
                </>
            );
        }
        if (marketOne && marketOne.home_od !== '-' && !marketOne.draw_od) {
            return (
                <>
                    <OddWarraper
                        gridColumn="span 6"
                        update={marketOne?.update1}
                        sx={{ justifyContent: 'center' }}
                        onClick={() => betHandler(marketOne, OddTypes.Home)}
                        active={checkActive(betslipData, marketOne.id, OddTypes.Home)}
                    >
                        <OddNum odd={marketOne.home_od} />
                    </OddWarraper>
                    <OddWarraper
                        gridColumn="span 6"
                        update={marketOne?.update2}
                        sx={{ justifyContent: 'center' }}
                        onClick={() => betHandler(marketOne, OddTypes.Away)}
                        active={checkActive(betslipData, marketOne.id, OddTypes.Away)}
                    >
                        <OddNum odd={marketOne.away_od} />
                    </OddWarraper>
                </>
            );
        }
        return <Lock />;
    };

    if (isMobile) {
        return (
            <Stack my={1} px={1}>
                <Divider sx={{ py: 1 }} />
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography
                        sx={{
                            px: 1,
                            fontWeight: '700',
                            fontSize: '12px',
                            lineHeight: '100%',
                            color: '#84868a'
                        }}
                    >
                        {moment(event.time * 1000).format('ddd, MMM YY, h:mm A')}
                    </Typography>
                    <IconButton onClick={eventsHandler}>
                        <Typography
                            sx={{
                                fontWeight: '700',
                                fontSize: '12px',
                                lineHeight: '100%',
                                color: '#76C841'
                            }}
                        >
                            +{event?.odds && Object.keys(event.odds).length}
                        </Typography>
                    </IconButton>
                </Stack>
                <Stack direction="row" alignItems="center" justifyContent="space-evenly" spacing={1}>
                    <Stack spacing={0.5} alignItems="center">
                        <TeamAvatar onClick={eventsHandler} alt={event.home?.name} src={`${BASE_URL}/${event.home?.image_id}.png`} />
                        <TeamName onClick={eventsHandler} sx={{ textAlign: 'center' }}>
                            {event.home?.name}
                        </TeamName>
                    </Stack>
                    <Stack spacing={0.5} alignItems="center">
                        <TeamAvatar onClick={eventsHandler} alt={event.away?.name} src={`${BASE_URL}/${event.away?.image_id}.png`} />
                        <TeamName onClick={eventsHandler} sx={{ textAlign: 'center' }}>
                            {event.away?.name}
                        </TeamName>
                    </Stack>
                </Stack>
                <Typography
                    sx={{
                        textAlign: 'center',
                        fontWeight: '700',
                        fontSize: '12px',
                        lineHeight: '100%',
                        color: '#84868a'
                    }}
                >
                    {name.name1 && <FormattedMessage id={name.name1} />}
                </Typography>
                <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={1} sx={{ height: '100%', my: 1 }}>
                    <MarketOne />
                </Box>
            </Stack>
        );
    }
    return (
        <>
            <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" sx={{ mt: 1.5, mb: 2 }}>
                <Box gridColumn="span 5">
                    <Box
                        sx={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            display: 'flex'
                        }}
                    >
                        <Typography
                            sx={{
                                pl: { xs: 0, sm: 1 },
                                pr: { xs: 0.5, sm: 2 },
                                fontWeight: '700',
                                fontSize: '12px',
                                lineHeight: '100%',
                                color: '#84868a'
                            }}
                        >
                            {moment(event.time * 1000).format('ddd, MMM YY, h:mm A')}
                        </Typography>
                        <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
                    </Box>
                </Box>
                <Box gridColumn="span 6">
                    <Box
                        sx={{
                            alignItems: 'center',
                            display: 'flex'
                        }}
                    >
                        <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
                        <Typography
                            sx={{
                                px: { xs: 0.5, sm: 5 },
                                fontWeight: '700',
                                fontSize: '12px',
                                lineHeight: '100%',
                                color: '#84868a'
                            }}
                        >
                            {name.name1 && <FormattedMessage id={name.name1} />}
                        </Typography>
                        <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
                    </Box>
                </Box>
                <Box gridColumn="span 1">
                    <Divider sx={{ flexGrow: 1, mt: 0.7 }} orientation="horizontal" />
                </Box>
            </Box>
            <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={1}>
                <Box gridColumn="span 5">
                    <Box gridColumn="span 14">
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Stack direction="row" spacing={-1}>
                                <TeamAvatar
                                    onClick={eventsHandler}
                                    alt={event.home?.name}
                                    src={`${BASE_URL}/${event.home?.image_id}.png`}
                                />
                                <TeamAvatar
                                    onClick={eventsHandler}
                                    alt={event.away?.name}
                                    src={`${BASE_URL}/${event.away?.image_id}.png`}
                                />
                            </Stack>
                            <Stack spacing={0.5}>
                                <TeamName onClick={eventsHandler}>{event.home?.name}</TeamName>
                                <TeamName onClick={eventsHandler}>{event.away?.name}</TeamName>
                            </Stack>
                        </Stack>
                    </Box>
                </Box>
                <Box gridColumn="span 6" sx={{ height: '100%' }}>
                    <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={1} sx={{ height: '100%' }}>
                        <MarketOne />
                    </Box>
                </Box>
                <Box gridColumn="span 1" sx={{ height: '100%' }}>
                    <Stack justifyContent="center" alignItems="center" sx={{ height: '100%' }}>
                        <IconButton onClick={eventsHandler}>
                            <Typography
                                sx={{
                                    fontWeight: '700',
                                    fontSize: '12px',
                                    lineHeight: '100%',
                                    color: '#76C841'
                                }}
                            >
                                +{event?.odds && Object.keys(event.odds).length}
                            </Typography>
                        </IconButton>
                    </Stack>
                </Box>
            </Box>
        </>
    );
};

export default Event;
