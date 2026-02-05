// src/main.jsx
import React from "react";
import ReactDOMClient from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import MyApp from "./MyApp";
import "./main.css";

// Create the container
const container = document.getElementById("root");

// Create a root
const root = ReactDOMClient.createRoot(container);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <MyApp />
        </BrowserRouter>
    </React.StrictMode>
);