import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Card, CardContent, CardHeader, Divider, Grid, IconButton, Skeleton, Stack, Typography } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import CopyToClipboard from 'react-copy-to-clipboard';
import { FormattedMessage, useIntl } from 'react-intl';

import moment from 'moment';

import { BASE_URL } from 'config';

import useApi from 'hooks/useApi';
import useConfig from 'hooks/useConfig';

import snackbar from 'utils/snackbar';
import { toNumber } from 'utils/number';

import { StatusBadge } from 'ui-component';
import { MultibetIcon, StatusIcon } from 'ui-component/SvgIcon';
import Transitions from 'ui-component/extended/Transitions';

import OddNum from 'views/sports/component/OddNum';

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
        </Card>
    )
}
