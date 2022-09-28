import {
    Typography,
    Card,
    Grid,
    Stack,
    IconButton,
    Avatar,
} from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import useConfig from 'hooks/useConfig';
import TaboiLogo from 'assets/images/logo/200xlogo.png'

export default function RecentBets() {

    const { boxShadow } = useConfig();

    return (
        <Card
            sx={{
                p: 1,
                // width: '20%',
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
                Current Bets
            </Typography>
            <Stack spacing={1}>
                <Card
                    key={1}
                    sx={{
                        // background: '#373636',
                        borderRadius: '8px',
                        p: 1,
                        boxShadow
                    }}
                >
                    <Stack
                        onClick={() => {
                            console.log('active')
                            // activeLeagueHandler(item.LeagueId)
                        }}
                        pl={1}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ overflow: 'hidden', borderRadius: 1, cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                        <Avatar alt="Remy Sharp" sx={{ width: 24, height: 24 }} src={TaboiLogo} />
                        <Grid sx={{ color: '#fff' }}>user</Grid>
                        <Grid sx={{ display: 'flex', color: '#fff' }}>
                            <Grid sx={{ color: 'green' }}>5</Grid>
                            <Grid>&nbsp;&nbsp;Sol</Grid>
                        </Grid>
                        <Stack direction="row" alignItems="center">
                            <IconButton size="small">
                                {/* {activeLeague.indexOf(item.LeagueId) !== -1 ? <KeyboardArrowDownIcon /> : <KeyboardArrowLeftIcon />} */}
                                <KeyboardArrowLeftIcon />
                            </IconButton>
                        </Stack>
                    </Stack>
                    {/* {activeLeague.indexOf(item.LeagueId) !== -1 && (
                        <Transitions in direction="up" type="slide">
                            {events.map((event, index) => (
                                <Event key={index} event={event} activeSports={activeSportsData} isLive={false} />
                            ))}
                        </Transitions>
                    )} */}
                </Card>
            </Stack>
        </Card>
    )
}
