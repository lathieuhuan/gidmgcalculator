import ReactDOM from "react-dom/client";

const location = document.createElement("div");
location.id = "notif";
location.className = "absolute z-50 top-0 w-full flex justify-center";
document.body.append(location);

const notifRoot = ReactDOM.createRoot(location);

export { location, notifRoot };
