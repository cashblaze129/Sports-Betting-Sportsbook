import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Card,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    IconButton,
    Stack,
    Typography,
    Zoom,
    Tooltip,
} from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useNavigate } from 'react-router-dom';

import config, { BASE_URL } from 'config';

import { StatusIcon } from 'ui-component/SvgIcon';

import useConfig from 'hooks/useConfig';
import Transitions from 'ui-component/extended/Transitions';

import { TeamAvatar } from 'ui-component';

export default function LiveMatches() {

    const navigate = useNavigate();
    const { boxShadow } = useConfig();
    const allLiveMatches: any = useSelector((state: any) => state.sports.liveMatches);

    const [activeSports, setActiveSports] = useState<number[]>([]);
    const [activeLeague, setActiveLeague] = useState<number[]>([]);

    const onActive = (id: number) => {
        const findIndex = activeSports.indexOf(id);
        if (findIndex === -1) {
            setActiveSports([...activeSports, id]);
        } else {
            const data = [...activeSports];
            data.splice(findIndex, 1);
            setActiveSports([...data]);
        }
    };

    const colorEffect = (num: any) => {
        const color = Number(num) >= 3 ? Number(num) >= 10 ? "#70bf3d" : "#ffab00" : "#fff";
        return color;
    }

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
                Live Matches
            </Typography>
            <Grid item>
                {allLiveMatches?.map((sport: any, key: number) => {
                    return (
                        <Transitions key={key} in direction="left" type="slide">
                            <Card
                                sx={{
                                    background: config.dark1,
                                    mb: 1,
                                    boxShadow
                                }}
                                style={{ borderRadius: '4px' }}
                            >
                                <CardHeader
                                    sx={{
                                        background: config.dark2,
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
                                                <i
                                                    className={`sportsicons sportsicon-${sport.SportId}`}
                                                    style={{ fontSize: '20px' }}
                                                />
                                            </Stack>
                                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                                <Typography variant="body2" color="primary">
                                                    {sport.SportName}
                                                </Typography>
                                                <IconButton onClick={() => onActive(sport?.SportId || '')} size="small">
                                                    {activeSports.indexOf(sport?.SportId || '') !== -1 ? (
                                                        <KeyboardArrowDownIcon />
                                                    ) : (
                                                        <KeyboardArrowLeftIcon />
                                                    )}
                                                </IconButton>
                                            </Stack>
                                        </Stack>
                                    }
                                />
                                <CardContent sx={{ p: 1.5 }} style={{ paddingBottom: '12px' }}>
                                    {activeSports.indexOf(sport?.SportId || '') !== -1 && (
                                        <Transitions in direction="left" type="slide">
                                            {(sport.leagues as any[]).map((league, index) => (
                                                <Stack key={index}>
                                                    <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
                                                        <Typography variant="body2">
                                                            {league.LeagueName}
                                                        </Typography>
                                                    </Stack>
                                                    {league.events.map((event: any, eventIndex: any) => {
                                                        return (
                                                            <Stack
                                                                direction="row"
                                                                justifyContent="space-around"
                                                                alignItems="center"
                                                                spacing={1}
                                                                onClick={() => navigate(`/events/${event.id}`)}
                                                                key={eventIndex}
                                                                m={1}
                                                            >
                                                                <Tooltip TransitionComponent={Zoom} title={event.home?.name} placement="top">
                                                                    <TeamAvatar
                                                                        alt={event.home?.name}
                                                                        src={`${BASE_URL}/${event.home?.image_id}.png`}
                                                                    />
                                                                </Tooltip>
                                                                <Typography
                                                                    sx={{ pt: 0.5, cursor: 'pointer' }}
                                                                >
                                                                    vs
                                                                </Typography>
                                                                <Tooltip TransitionComponent={Zoom} title={event.away?.name} placement="top">
                                                                    <TeamAvatar
                                                                        alt={event.away?.name}
                                                                        src={`${BASE_URL}/${event.away?.image_id}.png`}
                                                                    />
                                                                </Tooltip>
                                                            </Stack>
                                                        )
                                                    })}
                                                    <Divider sx={{ my: 1 }} />
                                                </Stack>
                                            ))}
                                        </Transitions>
                                    )}
                                </CardContent>
                            </Card>
                        </Transitions>
                    )
                })}
            </Grid>
        </Card>
    )
}
