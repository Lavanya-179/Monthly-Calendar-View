import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWrapper } from "../../_helpers";
import { baseUrl } from "../../environments";

export const fetchEvents = createAsyncThunk(
    "calendar/getAll",
    async () => await fetchWrapper.get(`${baseUrl}/events`)
);
export const updateEvent = createAsyncThunk(
    "calendar/update",
    async (payload) =>
        await fetchWrapper.post(`${baseUrl}/events/update`, payload)
);
export const deleteEvent = createAsyncThunk(
    "calendar/delete",
    async (payload) =>
        await fetchWrapper.delete(`${baseUrl}/events/delete`, payload)
);

export const createEvent = createAsyncThunk(
    "calendar/create",
    async (payload) =>
        await fetchWrapper.post(`${baseUrl}/events/create`, payload)
);

const initialState = {
    events: [],
    status: "idle",
    error: null,
    isLoading: false,
    updatedStatus: "",
};

const calendarSlice = createSlice({
    name: "calendar",
    initialState,
    reducers: {
        eventEdit: (state, action) => {
            state.selectedMonth = action.payload;
        },
        eventDelete: (state, action) => {
            state.selectedMonth = action.payload;
        },
        eventCreate: (state, action) => {
            state.selectedMonth = action.payload;
        },
        // Add more reducers for calendar-related actions
    },
    extraReducers: (builder) => {
        // Handle pending state
        builder.addCase(fetchEvents.pending, (state) => {
            state.status = "loading";
            state.isLoading = true;
        });
        // Handle fulfilled state
        builder.addCase(fetchEvents.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.events = [...action.payload];
            state.isLoading = false;
        });

        // Handle rejected state
        builder.addCase(fetchEvents.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
            state.isLoading = false;
        });

        builder.addCase(updateEvent.pending, (state) => {
            state.updatedStatus = "";
            state.isLoading = true;
        });
        // Handle fulfilled state
        builder.addCase(updateEvent.fulfilled, (state, action) => {
            state.updatedStatus = action.payload.status;
            state.isLoading = false;
        });

        // Handle rejected state
        builder.addCase(updateEvent.rejected, (state, action) => {
            state.updatedStatus = "";
            state.error = action.error.message;
            state.isLoading = false;
        });

        builder.addCase(deleteEvent.pending, (state) => {
            state.updatedStatus = "";
            state.isLoading = true;
        });
        // Handle fulfilled state
        builder.addCase(deleteEvent.fulfilled, (state, action) => {
            state.updatedStatus = action.payload.status;
            state.isLoading = false;
        });

        // Handle rejected state
        builder.addCase(deleteEvent.rejected, (state, action) => {
            state.updatedStatus = "";
            state.error = action.error.message;
            state.isLoading = false;
            console.log("error: ", action.error);
        });

        builder.addCase(createEvent.pending, (state) => {
            state.updatedStatus = "";
            state.isLoading = true;
        });
        // Handle fulfilled state
        builder.addCase(createEvent.fulfilled, (state, action) => {
            state.updatedStatus = action.payload.status;
            state.isLoading = false;
        });

        // Handle rejected state
        builder.addCase(createEvent.rejected, (state, action) => {
            state.updatedStatus = "";
            state.error = action.error.message;
            state.isLoading = false;
            console.log("loading: ", action.error);
        });
    },
});
export const calendarActions = calendarSlice.actions;
export default calendarSlice.reducer;
