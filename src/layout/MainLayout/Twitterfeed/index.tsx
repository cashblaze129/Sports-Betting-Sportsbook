import {
    Typography,
    Card,
} from '@mui/material';
import useConfig from 'hooks/useConfig';

export default function Twitterfeed() {

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
                Twitter Feed
            </Typography>
        </Card>
    )
}
