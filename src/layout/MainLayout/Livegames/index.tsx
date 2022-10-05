import {
    Typography,
    Card,
    Grid,
} from '@mui/material';
import useConfig from 'hooks/useConfig';

export default function Livegames() {

    const { boxShadow } = useConfig();

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
            <Grid>

            </Grid>
        </Card>
    )
}
