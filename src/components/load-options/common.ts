export const styles = {
  option: "pt-2 pb-3 px-4 hover:bg-darkblue-1",
  option_title: "mt-1 text-h5 font-bold text-lightgold",
};

export const downloadToDevice = (data: any) => {
  // type: "application/json"
  const textBlob = new Blob([data], { type: "text/plain" });
  const newLink = document.createElement("a");

  newLink.download = "GDC_Data";

  if (window.webkitURL != null) {
    newLink.href = window.webkitURL.createObjectURL(textBlob);
  } else {
    newLink.href = window.URL.createObjectURL(textBlob);
    newLink.style.display = "none";
    document.body.appendChild(newLink);
  }

  newLink.click();
};
