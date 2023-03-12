import ReactDOM from "react-dom/client";

if (!document.body.querySelector("#notif")) {
  let location = document.createElement("div");
  location.id = "notif";
  location.className = "absolute z-50 top-0 w-full flex justify-center";
  document.body.append(location);
}

export const notifRoot = ReactDOM.createRoot(document.body.querySelector("#notif")!);
