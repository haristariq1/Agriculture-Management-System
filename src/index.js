import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./styles.css";
import App from "./app/App";
import { store } from "./app/redux/store";

createRoot(document.getElementById("root")).render(
  React.createElement(
    Provider,
    { store },
    React.createElement(BrowserRouter, null, React.createElement(App)),
  ),
);
