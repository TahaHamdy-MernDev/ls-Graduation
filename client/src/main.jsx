import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { CookiesProvider } from "react-cookie";
import { Provider } from "react-redux";
import Store from "./Redux/Store.jsx";
import { ToastContainer } from "react-toastify";
import { BrowserRouter } from "react-router-dom";
import { PrimeReactProvider } from "primereact/api";
import "react-toastify/dist/ReactToastify.css";
import 'swiper/css';
import { I18nextProvider } from "react-i18next"

import i18n from "./i18n.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'primereact/resources/themes/lara-light-indigo/theme.css'; //theme
import 'primereact/resources/primereact.min.css'; //core css
import 'primeicons/primeicons.css'; //icons
// import 'primeflex/primeflex.css'; // flex
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
        <CookiesProvider defaultSetOptions={{ path: "/" }}>
        <Provider store={Store}>
        <I18nextProvider i18n={i18n}>
        <PrimeReactProvider value={{ unstyled: false }}>
        <App />
          <ToastContainer position="top-right" autoClose={5000} />
    </PrimeReactProvider>
      </I18nextProvider>
        </Provider>
      </CookiesProvider>
    </BrowserRouter>
  </React.StrictMode>
);
