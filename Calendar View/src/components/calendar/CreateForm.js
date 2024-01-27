import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { uuID } from "../../_helpers/util";
import { createEvent, updateEvent } from "./calendar.slice";
import { useDispatch } from "react-redux";
const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    start: yup.date(),
    end: yup.date(),
});

const EventFormPopup = ({ onClose, selectedEvent, resetEdit }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = React.useState({
        title: selectedEvent.title ? selectedEvent.title : "",
        start: selectedEvent.start ? selectedEvent.start : new Date(),
        end: selectedEvent.end ? selectedEvent.start : new Date(),
        id: selectedEvent.id ? selectedEvent.id : "",
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });
    const onChange = (key, value) => {
        setFormData({ ...formData, [key]: value });
    };

    const onSubmit = () => {
        if (selectedEvent.isEdit) {
            dispatch(updateEvent({ event: { ...selectedEvent, ...formData } }));
        } else {
            dispatch(createEvent({ ...formData, id: uuID() }));
        }
        handleClose();
    };

    const handleClose = () => {
        onClose();
        resetEdit();
    };

    return (
        <div className="overlay">
            <div className="popup-form">
                <h3>{selectedEvent.isEdit ? "Update Event" : "Add Event"}</h3>
                <div>
                    <button className="close-btn" onClick={handleClose}>
                        &#10005;
                    </button>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-field">
                            <label htmlFor="eventTitle">Title:</label>
                            <input
                                {...register("title", {
                                    required: true,
                                    maxLength: 30,
                                })}
                                type="text"
                                id="title"
                                value={formData.title}
                                onChange={(event) =>
                                    onChange("title", event.target.value)
                                }
                            />
                            {errors?.title && (
                                <p className="error-message">
                                    {errors?.title.message}
                                </p>
                            )}
                        </div>

                        {/* Start and End fields */}
                        <div className="form-field">
                            <label>Start:</label>
                            <DatePicker
                                selected={formData.start}
                                showIcon
                                showTimeSelect
                                dateFormat="Pp"
                                onChange={(date) => onChange("start", date)}
                                minDate={new Date()}
                                minTime={
                                    new Date().getDate() ===
                                    new Date(
                                        formData.start ?? new Date().getTime()
                                    ).getDate()
                                        ? new Date()
                                        : new Date().setHours(0, 0, 0)
                                }
                                maxTime={new Date().setHours(23, 59, 59)}
                            />
                        </div>
                        <div className="form-field">
                            <label>End:</label>
                            <DatePicker
                                selected={formData.end}
                                showIcon
                                onChange={(date) => onChange("end", date)}
                                showTimeSelect
                                dateFormat="Pp"
                                minDate={formData.start}
                            />
                        </div>

                        {/* Button to close the popup */}
                        <div className="form-field">
                            <button type="submit">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default React.memo(EventFormPopup);
