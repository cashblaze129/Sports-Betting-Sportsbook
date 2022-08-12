import { Fragment, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge, Box, Card, CircularProgress, IconButton, Stack, Typography, useTheme } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { FormattedMessage } from 'react-intl';
import PerfectScrollbar from 'react-perfect-scrollbar';

import useConfig from 'hooks/useConfig';
import config from 'config';
import { inintSportsData, SportsListProps, SportsMatchProps, SportsParamsProps } from 'types/sports';

import Axios from 'utils/axios';
import { checkUpdate } from 'utils/sports';

import Loader from 'ui-component/Loader';
import { useSelector } from 'store';
import { SportsItem } from 'ui-component';
import Transitions from 'ui-component/extended/Transitions';
import Event from './component/Event';
import UseIcons from 'utils/Icons';

const SportsPage = () => {
    const theme = useTheme();
    const { boxShadow } = useConfig();
    const params: SportsParamsProps = useParams();
    const navigate = useNavigate();
    const { search } = useSelector((store) => store.sports);
    const [activeSports, setActiveSports] = useState<number>(Number(params?.sportsId) || 0);
    const [activeSportsData, setActiveSportsData] = useState<SportsListProps>(inintSportsData);
    const [sportsLists, setSportsLists] = useState<SportsListProps[]>([]);
    const [sportsMatchs, setSportsMatchs] = useState<SportsMatchProps[]>([]);
    const [activeLeague, setActiveLeague] = useState<number[]>([]);
    const [pageLoading, setPageLoading] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);

    const updateMatchs = useCallback(checkUpdate, [sportsMatchs, activeSports]);

    const initActiveSport = (data: SportsListProps[]) => {
        if (!activeSports) {
            setActiveSports(data[0].SportId);
            setActiveSportsData(data[0]);
            navigate(`/sports/${data[0].SportId}`, { replace: true });
        } else {
            setActiveSportsData(data.find((e) => e.SportId === activeSports) || inintSportsData);
        }
    };

    const activeSportsHandler = (SportId: number) => {
        setActiveSports(SportId);
        setActiveSportsData(sportsLists.find((e) => e.SportId === SportId) || inintSportsData);
        setSportsMatchs([]);
        navigate(`/sports/${SportId}`, { replace: true });
    };

    const activeLeagueHandler = (LeagueId: number) => {
        const isOpen = activeLeague.indexOf(LeagueId) > -1;
        if (isOpen) {
            setActiveLeague(activeLeague.filter((id: number) => id !== LeagueId));
        } else {
            setActiveLeague([...activeLeague, LeagueId]);
        }
    };

    const getSportsList = () => {
        setPageLoading(true);
        Axios.post('api/v1/sports/lists', {})
            .then(({ data }: { data: SportsListProps[] }) => {
                setSportsLists(data);
                setPageLoading(false);
                initActiveSport(data);
            })
            .catch(() => {
                setPageLoading(false);
            });
    };

    const getSportMatchs = () => {
        setLoading(true);
        Axios.post('api/v1/sports/matchs', {
            SportId: activeSports,
            EventStatus: 'PRE'
        })
            .then(({ data }) => {
                updateMatchs(data, sportsMatchs, activeSports, setSportsMatchs);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    const getSportsListsTimer = () => {
        Axios.post('api/v1/sports/lists', {}).then(({ data }) => {
            setSportsLists(data);
        });
    };

    const getSportMatchsTimer = useCallback(() => {
        Axios.post('api/v1/sports/matchs', {
            SportId: activeSports,
            EventStatus: 'PRE'
        }).then(({ data }) => {
            updateMatchs(data, sportsMatchs, activeSports, setSportsMatchs);
        });
    }, [activeSports, sportsMatchs, updateMatchs]);

    useEffect(() => {
        let unmounted = false;
        if (!unmounted) {
            getSportsList();
        }
        return () => {
            unmounted = true;
        };
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        let unmounted = false;
        if (!unmounted) {
            getSportMatchs();
        }
        return () => {
            unmounted = true;
        };
        // eslint-disable-next-line
    }, [activeSports]);

    useEffect(() => {
        let unmounted = false;
        const timer = setInterval(() => {
            if (!unmounted) {
                getSportMatchsTimer();
                getSportsListsTimer();
            }
        }, config.timer1);
        return () => {
            clearInterval(timer);
            unmounted = true;
        };
    }, [getSportMatchsTimer]);

    const renderMatchs = () => {
        if (loading) {
            return (
                <Stack alignItems="center" justifyContent="center">
                    <CircularProgress color="inherit" />
                </Stack>
            );
        }
        if (!sportsMatchs.length) {
            return (
                <Typography
                    sx={{
                        textAlign: 'center',
                        fontWeight: '700',
                        fontSize: '16px',
                        lineHeight: '100%',
                        color: '#fff'
                    }}
                >
                    <FormattedMessage id="Events are currently not available" />
                </Typography>
            );
        }
        return sportsMatchs.map((item, key) => {
            const events = item.events.filter(
                (e) =>
                    e.home.name.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
                    e.away.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
            );
            if (!events.length) return <Fragment key={key} />;
            return (
                <Card
                    key={key}
                    sx={{
                        background: '#212637',
                        borderRadius: '13px',
                        py: 2,
                        px: { xs: 1, sm: 2 },
                        boxShadow
                    }}
                >
                    <Stack
                        onClick={() => activeLeagueHandler(item.LeagueId)}
                        pl={1}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ overflow: 'hidden', borderRadius: 1, cursor: 'pointer' }}
                    >
                        <Typography
                            sx={{
                                fontWeight: '700',
                                fontSize: '16px',
                                lineHeight: '100%',
                                color: '#fff'
                            }}
                        >
                            {item.LeagueName}
                        </Typography>
                        <Stack direction="row" alignItems="center">
                            <Badge
                                badgeContent={item.events?.length || 0}
                                color="secondary"
                                sx={{
                                    mr: 3,
                                    '& .MuiBadge-badge': {
                                        background: 'linear-gradient(228.67deg, #7CD044 5.65%, #6AB739 100%), #D9D9D9'
                                    }
                                }}
                            />
                            <IconButton size="small">
                                {activeLeague.indexOf(item.LeagueId) !== -1 ? <KeyboardArrowDownIcon /> : <KeyboardArrowLeftIcon />}
                            </IconButton>
                        </Stack>
                    </Stack>
                    {activeLeague.indexOf(item.LeagueId) !== -1 && (
                        <Transitions in direction="up" type="slide">
                            {events.map((event, index) => (
                                <Event key={index} event={event} activeSports={activeSportsData} isLive={false} />
                            ))}
                        </Transitions>
                    )}
                </Card>
            );
        });
    };

    if (pageLoading) return <Loader />;
    if (!sportsLists.length) return <Typography>Events are currently not available</Typography>;

    return (
        <Transitions in direction="up" type="slide">
            <Box className="sports-items">
                <PerfectScrollbar aria-setsize={1}>
                    <Stack direction="row" spacing={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                        {sportsLists.map((item, key) => (
                            <SportsItem
                                key={key}
                                index={key % 5}
                                theme={theme}
                                active={activeSports === item.SportId}
                                bgcolor={item.color}
                                onClick={() => activeSportsHandler(item.SportId)}
                            >
                                <Box className="warraper">
                                    <Box className="cover">
                                        <Box className="back" />
                                        {UseIcons(item.icon)}
                                        {/* <i className={`sportsicons sportsicon-${item.SportId}`} /> */}
                                    </Box>
                                </Box>
                                {/* <Typography>
                                    <FormattedMessage id={item.SportName} />
                                </Typography> */}
                            </SportsItem>
                        ))}
                    </Stack>
                </PerfectScrollbar>
            </Box>
            <Card
                sx={{
                    p: { xs: 1, sm: 3 },
                    borderRadius: '18px',
                    background: '#181D2D',
                    boxShadow
                }}
            >
                <Stack spacing={{ xs: 1, sm: 2 }}>{renderMatchs()}</Stack>
            </Card>
        </Transitions>
    );
};

export default SportsPage;
