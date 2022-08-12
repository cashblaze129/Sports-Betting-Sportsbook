import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Routes from 'routes';
import io from 'socket.io-client';

import { BASE_URL } from 'config';
import ThemeCustomization from 'themes';
import { APIProvider } from 'contexts/ApiContext';

import { useDispatch, useSelector } from 'store';
import { ChangePage } from 'store/reducers/menu';
import { Logout, SetBetsId, SetCode, UpdateBalance } from 'store/reducers/auth';

import Locales from 'ui-component/Locales';
import Snackbar from 'ui-component/extended/Snackbar';
import NavigationScroll from 'layout/NavigationScroll';

const App = () => {
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const { isLoggedIn, balance, token } = useSelector((state) => state.auth);

    useEffect(() => {
        let socket = io(BASE_URL);
        if (isLoggedIn) {
            socket = io(BASE_URL, { query: { auth: token } });
            socket.on('logout', () => {
                dispatch(Logout({}));
            });
            socket.on('reload', () => {
                window.location.reload();
            });
            socket.on('balance', (data) => {
                if (!isLoggedIn) return;
                if (data.balance !== balance) {
                    dispatch(UpdateBalance(data.balance));
                }
            });
        }
        return () => {
            if (socket) {
                socket.off('logout');
                socket.off('reload');
                socket.off('balance');
            }
        };
    }, [token, balance, isLoggedIn, dispatch]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const c = params.get('c');
        if (c) {
            dispatch(SetCode(c));
            dispatch(ChangePage('register'));
        }
        const b = params.get('b');
        if (b) {
            dispatch(SetBetsId(b));
            dispatch(ChangePage('bets'));
        }
    }, [pathname, dispatch]);

    return (
        <ThemeCustomization>
            <Locales>
                <NavigationScroll>
                    <APIProvider>
                        <>
                            <Routes />
                            <Snackbar />
                        </>
                    </APIProvider>
                </NavigationScroll>
            </Locales>
        </ThemeCustomization>
    );
};

export default App;
