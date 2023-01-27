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
