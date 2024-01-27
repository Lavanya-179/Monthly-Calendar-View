import { configureStore } from "@reduxjs/toolkit";
import calendarReducer from "../components/calendar/calendar.slice";

export const store = configureStore({
    reducer: {
        calendar: calendarReducer,
    },
});
