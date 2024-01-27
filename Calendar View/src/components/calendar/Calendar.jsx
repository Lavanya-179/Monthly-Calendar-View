import React, { useState, useEffect, useCallback } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-virtualized/styles.css";
import { fetchEvents, updateEvent, deleteEvent } from "./calendar.slice";
import {
    EVENT_DELETE_MESSAGE,
    EVENT_UPDATE_MESSAGE,
} from "../../constants/constant";
import EventFormPopup from "./CreateForm";
import EventComponent from "./EventComponent";
import CustomToolbar from "./CustomToolbar";
//&#x22EE;
const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);
const specialDay = {
    backgroundColor: "red",
};

const MyCalendar = () => {
    const {
        isLoading,
        events: data,
        updatedStatus,
    } = useSelector((x) => x.calendar);
    const dispatch = useDispatch();

    const [events, setEvents] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [selectedEvent, setSelectedEvent] = React.useState({ isEdit: false });

    // To Handle create Event show / hide
    const handleOpen = React.useCallback(() => {
        setOpen((prevState) => !prevState);
    }, []);

    // Reset Edit View
    const resetEdit = useCallback(() => {
        setSelectedEvent({ isEdit: false });
    }, []);

    // To Customize day event styles
    const customDayPropGetter = (date) => {
        var currentDate = new Date();
        if (
            date.getFullYear() === currentDate.getFullYear() &&
            date.getMonth() === currentDate.getMonth() &&
            date.getDate() === currentDate.getDate()
        )
            return {
                className: specialDay,
                style: {
                    border: "solid 3px #afa",
                },
            };
        else return {};
    };

    //custom event background color
    const eventPropGetter = (event) => {
        const backgroundColor = event.allDay ? "green" : "blue";
        return { style: { backgroundColor } };
    };

    // Increse the slots on Resizing
    const onEventResize = ({ event, start, end }) => {
        setEvents((prevState) => {
            const updatedEvents = prevState.map((item) =>
                item.id === event.id
                    ? {
                          ...item,
                          start,
                          end,
                      }
                    : item
            );

            return updatedEvents;
        });
        dispatch(updateEvent({ event: { ...event, start, end } }));
    };

    // to update the event by doing drag and drop
    const onEventDrop = ({ event, start, end }) => {
        setEvents((prevState) => {
            const updatedEvents = prevState.map((item) =>
                item.id === event.id
                    ? {
                          ...item,
                          start,
                          end,
                      }
                    : item
            );
            return updatedEvents;
        });
        dispatch(updateEvent({ event: { ...event, start, end } }));
    };

    // to handle edit event
    const handleEdit = (event, e) => {
        e.preventDefault();
        setSelectedEvent({ ...event, isEdit: true });
        handleOpen();
    };

    // to handle delete event
    const handleDelete = (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this event?"
        );
        if (confirmDelete) {
            dispatch(deleteEvent({ id: id }));
        }
    };

    const { components, defaultDate } = React.useMemo(
        () => ({
            components: {
                day: {
                    event: ({ event }) => (
                        <EventComponent
                            event={event}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                        />
                    ),
                },
                toolbar: (toolbar) => (
                    <CustomToolbar toolbar={toolbar} handleOpen={handleOpen} />
                ),
            },
            defaultDate: new Date(),
        }),
        [events]
    );

    useEffect(() => {
        dispatch(fetchEvents());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);
    useEffect(() => {
        if (
            EVENT_UPDATE_MESSAGE === updatedStatus ||
            EVENT_DELETE_MESSAGE === updatedStatus
        ) {
            dispatch(fetchEvents());
        }
    }, [EVENT_UPDATE_MESSAGE, EVENT_DELETE_MESSAGE, updatedStatus, dispatch]);

    useEffect(() => {
        console.log("data: ", data);
        if (data && data.length) {
            setEvents([
                ...data.map((event) => ({
                    ...event,
                    start: new Date(event.start),
                    end: new Date(event.end),
                })),
            ]);
        } else {
            setEvents([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    return (
        <div>
            <DnDCalendar
                defaultView="month"
                events={events}
                localizer={localizer}
                onEventDrop={onEventDrop}
                onEventResize={onEventResize}
                resizable
                style={{ height: "100vh" }}
                views={["month", "day"]}
                components={components}
                dayPropGetter={customDayPropGetter}
                defaultDate={defaultDate}
                eventPropGetter={eventPropGetter}
                startAccessor="start"
                endAccessor="end"
                selectable
                popup /* this for show more meetings on day with popup */
            />
            {open && (
                <EventFormPopup
                    onClose={handleOpen}
                    selectedEvent={{ ...selectedEvent }}
                    resetEdit={resetEdit}
                />
            )}
        </div>
    );
};

export default React.memo(MyCalendar);
