export const FileService = {
  uploadImage: (file: any) => {
    const formData = new FormData();
    formData.append("file", file);
    return fetch(
      "https://interactai-gateway-dev.onrender.com/api/v1/upload-pdf",
      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  },
};
