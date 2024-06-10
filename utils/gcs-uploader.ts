import { Storage } from "@google-cloud/storage";
import { PassThrough, Readable } from "stream";

export class GCSUploader {
  static uploadFile(
    bucketName: string | undefined,
    objectKey: string,
    buffer: Buffer,
    size: number,
    contentType: string
  ) {
    throw new Error("Method not implemented.");
  }
  uploadFileStream(
    bucketName: string,
    outputFilename: string,
    videoStream: PassThrough,
    contentType: string
  ) {
    throw new Error("Method not implemented.");
  }
  storage: Storage;

  // constructor() {
  //   this.storage = new Storage({
  //     keyFilename: './src/keys/ali-bufayo-9203c0ac8b29.json',
  //     projectId: "ali-bufayo",
  //   });
  // }

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
    bucketName: any,
    objectKey: any,
    fileContents: any,
    fileSize: any,
    contentType: any
  ) {
    try {
      const bucket = this.storage.bucket(bucketName);
      const file = bucket.file(objectKey);

      const writableStream = file.createWriteStream({
        metadata: {
          contentType: contentType,
        },
      });

      // Convert the buffer to a Readable stream
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

      await file.makePublic(); // Make the file publicly accessible

      return file;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error("Failed to upload file to Google Cloud Storage");
    }
  }

  async deleteFile(bucketName: any, objectKey: any) {
    try {
      const bucket = this.storage.bucket(bucketName);
      const file = bucket.file(objectKey);

      await file.delete();

      return true;
    } catch (error) {
      console.error("Error deleting file:", error);
      throw new Error("Failed to delete file from Google Cloud Storage");
    }
  }
}
