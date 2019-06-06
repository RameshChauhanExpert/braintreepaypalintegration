import React from "react";
import { render } from "react-dom";
import { Paypal } from "./Paypal";
import "./style.css";

render( // just render .. paypal  component .
    <Paypal />,
    document.getElementById("root")
);
