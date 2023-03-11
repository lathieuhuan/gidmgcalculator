import ReactDOM from "react-dom/client";

const show = () => {
  if (!document.body.querySelector("#notif")) {
    let location = document.createElement("div");
    location.id = "notif";
    document.body.append(location);
  }

  const notifCotent = <div className="absolute top-5 w-80 bg-default rounded-lg">Hello</div>;

  ReactDOM.createRoot(document.body.querySelector("#notif")!).render(notifCotent);
};

export const notification = {
  info: show,
};
