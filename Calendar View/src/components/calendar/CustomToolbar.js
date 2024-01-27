import React from "react";
import { NAVIGATE } from "../../constants/constant";
const CustomToolbar = ({ toolbar, handleOpen }) => {
    const goToToday = () => {
        toolbar.onNavigate(NAVIGATE.TODAY);
    };

    const goToBack = () => {
        toolbar.onNavigate(NAVIGATE.PREV);
    };

    const goToNext = () => {
        toolbar.onNavigate(NAVIGATE.NEXT);
    };

    const goToMonthView = () => {
        toolbar.onView(NAVIGATE.MONTH);
    };

    const goToDayView = () => {
        toolbar.onView(NAVIGATE.DAY);
    };

    return (
        <div className="rbc-toolbar">
            <div className="arrow-block">
                <div className="rbc-btn-group">
                    <button type="button" onClick={goToToday}>
                        Today
                    </button>
                    <button type="button" onClick={goToBack}>
                        <i className="arrow left"></i>
                    </button>
                    <button type="button" onClick={goToNext}>
                        <i className="arrow right"></i>
                    </button>
                </div>
                <div className="rbc-toolbar-label">{toolbar.label}</div>
            </div>
            <div className="rbc-btn-group">
                <button type="button" onClick={goToMonthView}>
                    Month
                </button>
                <button type="button" onClick={goToDayView}>
                    Day
                </button>
                <button type="button" onClick={handleOpen}>
                    Add Event
                </button>
            </div>
        </div>
    );
};

export default React.memo(CustomToolbar);
