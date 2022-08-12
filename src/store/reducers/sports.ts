import { createSlice } from '@reduxjs/toolkit';
import { SportsProps } from 'types/sports';

const initialState: SportsProps = {
    betslipData: [],
    betAmount: 0,
    betslipOpen: false,
    search: ''
};

const sports = createSlice({
    name: 'sports',
    initialState,
    reducers: {
        setBetslip(state, action) {
            const innerWidth = window.innerWidth;
            if (innerWidth > 767 && action.payload.length > state.betslipData.length) {
                state.betslipOpen = true;
            }
            state.betslipData = [...action.payload];
        },

        clearAll(state) {
            state.betslipData = [];
        },

        setBetAmount(state, action) {
            state.betAmount = action.payload;
        },

        openBetslip(state, action) {
            state.betslipOpen = action.payload;
        },

        updateSearch(state, action) {
            state.search = action.payload;
        }
    }
});

export default sports.reducer;

export const { setBetslip, setBetAmount, clearAll, openBetslip, updateSearch } = sports.actions;
