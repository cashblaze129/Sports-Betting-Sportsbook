import { PaletteMode } from '@mui/material';

export type ConfigProps = {
    fontFamily: string;
    borderRadius: number;
    outlinedFilled: boolean;
    navType: PaletteMode;
    presetColor: string;
    fontColor: string;
    boxShadow: string;
    locale: string;
    rtlLayout: boolean;
    timer1: number;
    timer2: number;
    RECAPTCHA_SITE_KEY: string;
};

export type CustomizationProps = {
    fontFamily: string;
    borderRadius: number;
    outlinedFilled: boolean;
    navType: PaletteMode;
    presetColor: string;
    boxShadow: string;
    locale: string;
    rtlLayout: boolean;
    onChangeLocale: (locale: string) => void;
};

export enum ModeTypes {
    pro = 'pro',
    _dev = '_dev',
    dev = 'dev'
}
