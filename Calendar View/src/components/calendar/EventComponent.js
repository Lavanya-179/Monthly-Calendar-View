import React from "react";
const EventComponent = ({ event, handleDelete, handleEdit }) => {
    return (
        <div className="event-container">
            <strong>{event.title}</strong>
            <div className="btn-group">
                <button
                    type="button"
                    title="Edit"
                    onClick={(e) => handleEdit(event, e)}
                >
                    &#x270E;
                </button>
                <button
                    type="button"
                    title="Delete"
                    onClick={() => handleDelete(event.id)}
                >
                    &#10005;
                </button>
            </div>
        </div>
    );
};

export default React.memo(EventComponent);
