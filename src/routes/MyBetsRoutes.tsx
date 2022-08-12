import { lazy } from 'react';
import MainLayout from 'layout/MainLayout';
import MyBetsLayout from 'layout/MyBetsLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/AuthGuard';

const MybetsActive = Loadable(lazy(() => import('views/mybets')));
const MybetsSettled = Loadable(lazy(() => import('views/mybets/settled')));

const ProfileRoutes = {
    path: '/my-bets',
    element: (
        <MainLayout>
            <AuthGuard>
                <MyBetsLayout />
            </AuthGuard>
        </MainLayout>
    ),
    children: [
        {
            path: '/my-bets',
            element: <MybetsActive />
        },
        {
            path: '/my-bets/settled',
            element: <MybetsSettled />
        }
    ]
};

export default ProfileRoutes;
