export const styles = {
  wrapper: "pt-2 pb-4 rounded-lg bg-darkblue-2 shadow-white-glow",
  option: "pt-2 pb-3 px-4 hover:bg-darkblue-1",
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
