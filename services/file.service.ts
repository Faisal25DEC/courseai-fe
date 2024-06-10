export const FileService = {
  uploadImage: (file: any) => {
    const formData = new FormData();
    formData.append("file", file);
    return fetch("/api/upload/image", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  },
};
