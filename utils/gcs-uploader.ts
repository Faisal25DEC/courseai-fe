import { Storage } from "@google-cloud/storage";
import { Readable } from "stream";

export class GCSUploader {
  storage: Storage;

  constructor(base64: string = "") {
    const credentialsBase64 =
      base64 !== "" ? base64 : process.env.GCP_CREDENTIALS_BASE64;

    if (!credentialsBase64) {
      throw new Error("Google Cloud credentials are not set.");
    }
    const credentialsJSON = Buffer.from(credentialsBase64, "base64").toString(
      "utf8"
    );
    const credentials = JSON.parse(credentialsJSON);
    this.storage = new Storage({ credentials });
  }

  async uploadFile(
    bucketName: string,
    objectKey: string,
    fileContents: Buffer,
    fileSize: number,
    contentType: string
  ) {
    try {
      const bucket = this.storage.bucket(bucketName);
      const file = bucket.file(objectKey);

      const writableStream = file.createWriteStream({
        metadata: {
          contentType: contentType,
        },
      });

      const readableStream = new Readable();
      readableStream._read = () => {};
      readableStream.push(fileContents);
      readableStream.push(null);

      await new Promise<void>((resolve, reject) => {
        readableStream
          .pipe(writableStream)
          .on("error", (err: any) => reject(err))
          .on("finish", () => resolve());
      });

      return file;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error("Failed to upload file to Google Cloud Storage");
    }
  }
}
