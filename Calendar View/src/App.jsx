import React from "react";
import {
    Routes,
    Route,
    Navigate,
    useNavigate,
    useLocation,
} from "react-router-dom";

import { history } from "./_helpers";
import { Home } from "./home";

export { App };

function App() {
    // init custom history object to allow navigation from
    // anywhere in the react app (inside or outside components)
    history.navigate = useNavigate();
    history.location = useLocation();

    return (
        <div className="app-container bg-light">
            <div className="container pt-4 pb-4">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="*" element={<Navigate to="/home" />} />
                </Routes>
            </div>
        </div>
    );
}
