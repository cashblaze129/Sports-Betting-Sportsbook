import { ConfigProps, ModeTypes } from 'types/config';

export const mode = ModeTypes.dev;

const urls = {
    pro: `https://boibook.io`,
    _dev: `http://185.231.222.151`,
    dev: `http://localhost:5000`
};

const url = urls[mode];

export const BASE_URL = url;
export const BASE_PATH = '';
export const HOME_PATH = '/sports';

const config: ConfigProps = {
    fontFamily: `'Roboto', sans-serif`,
    borderRadius: 8,
    boxShadow: 'rgba(0, 0, 0, 0.2) 0px 1px 3px 0px, rgba(0, 0, 0, 0.12) 0px 1px 2px 0px, rgba(255, 255, 255, 0.04) 0px 1px 0px 0px inset',
    outlinedFilled: true,
    navType: 'dark',
    presetColor: 'default',
    locale: 'en',
    rtlLayout: false,
    timer1: 5000,
    timer2: 900000,
    RECAPTCHA_SITE_KEY: '6LeRhsIeAAAAADY6KUkpQaIqPTKsXy2sa7u4JBAb'
};

export default config;
