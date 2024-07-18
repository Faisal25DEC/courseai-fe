import { NextRequest, NextResponse } from "next/server";
import multer from "multer";
import { GCSUploader } from "@/utils/gcs-uploader";

// Initialize multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 1024 * 1024 * 100 } // Limit file size to 100MB
});
const gcpCredentialsBase64 = 
  "ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIsCiAgInByb2plY3RfaWQiOiAicGVybWlhbi1haSIsCiAgInByaXZhdGVfa2V5X2lkIjogImU0YjEzZjM0ZDUwNWQ2OWMzOGEzZTIyNjIzNWFkNDk5ZjQyOTkzZTgiLAogICJwcml2YXRlX2tleSI6ICItLS0tLUJFR0lOIFBSSVZBVEUgS0VZLS0tLS1cbk1JSUV2Z0lCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktnd2dnU2tBZ0VBQW9JQkFRQ3FqTnlKT09QTUlpWUVcbm9vQkZ5ZVpGZXhwOEplaTNsSDVJWXptOVFpQTd5aVpVc0o1MTVIbTJJYUFNS25XejZVTHJKYkZKNktsSmsxK1pcbmZ6RzlFeVF5MGZQZ1pLNzk2QWViYkhHZlphdEtpRWRNUUhYOXVzeFdDT1d6dkpjbnY5MHIvdHdETGZ2Q29TU1Fcbm5xdzltbUZWcVNpaUQvY21wTlpwNlp0ekJiczIzd1Q0Vlozbnd2L2FSbVlBMG1UMzdqWThvZUpBcWU0MStNYW1cbkhRcU5zVHhCbE82SHNMUFBwMUcwZysvZEExbkhUQnJmcjIrZFJTTWU1R0hZWnNBaVBtTEdkYWlaTU03QlR4Qitcbm5NRmVKNGRsc1NRK0R2emFoN0lrb2UyRWhmM0RrRitod1QvVVJTWjVoMXNDMHZDNTVQcTNvdWgzcUNOVEdkVXFcbkFtZldOVmF4QWdNQkFBRUNnZ0VBQkxMc0g3bSttME5IQm5KaEpqak9ESEFweG0yOEdRdFJRRCsvbmlWOW5iZ1pcbkI5VUd4VGFkN3Y0TW1yM0d2V3B3eGc0M2xpNDJ4cTAvQVdjbkY3MUs2Yy9TVk0rWU1tTmtyMmVpYU93VVFFMDdcbm4rLzh1V0d3OGtQaHhvOVJINjY5cVZJQ1dWL0t2d1NzMnQ3bnVUNSt0MUg1Y3RZeU0yT1VpMUJZVUpXZFZ4TzFcbmF0ZDZ1alF3QWVvRDJjNE0yYnFzVEpvS0l3ZTVTNm8rU2VINnl5eTZWRzRmT2tldzVtcUdROXQxcFJ3Z2daV0VcbjZmNmVJQ2V5QzBpWndRN0JuVnhNZ3lvRWhBdEJKMFI3aDVSWDljb0l6b3YrNVJrbGVNQ3pTTFZ1TXFmbkJpbVNcblFKYWpQQ3JpSXo2YmJyNzROSDhhRGN2eWk5YzhsUFd4eE4wZldGS3F5d0tCZ1FEYkJZdmZMdGJMekY4RnZGVVhcbm9hN2wwNVk0cXY5S2NGZlRXSXJwZ1czZ01kdDJ3YXlGUE4rSW5kcktxL21SLzRRMWNSNFpjaUJobzFMRHNMcFZcblZvODNxcUtOc0xEMTFDd2YwZDdza1FQT0hQM2V6US9PRnBYNmQyNHlhbStLT0ZwL25IR1I4N29WeFNwN2g4SFdcbjZEdnJzVXRxYVpCTXFOZ2FiSDV0bU5kZXF3S0JnUURIV0U0eU53RnJkd0l4KzN6cVhlWmxLWDIvNVFWbTl4QXBcblVBWW1NTmEzZWIyV1lZbXVQOUljRGk3WFpYZXhQUG9ReUplVCtiQkIweTFWeG5hT3hUY1p4RE9qOEJPYU9oOXZcblFOWVVhNk5DYnF5UXVPSGxTY2M5WFpxZEwwZUZmVitrQnE4UjdkQWpmZ0hHb1RMWjFOWlc0OTZNUUxLemdiaERcbmhHZVZER3Z3RXdLQmdRQ2RnWjJYQUw0ampYT0FVbkgzTHFUeVRua25nNEZYN1BhYjNINzVjY1NzaCs1RnR2MzBcblMxU05rTWU1SEhlNzBMOHBGNUlIeHBVVzRqY3cxN1VJamRrc3RSOTFPZTNvdTQ2SHk0dS9JSUpXQlc5a2ZKK3pcbkczYjd5a3VMSWhQWW1MSXNOenROTkxOTDJLQzJlV2lpdmh2cFlYVFVyOW0vNTJTUmpCaFhoS1ROUlFLQmdHTkxcbi9GK05BTHNNSTk3TDI5Uk9nOFplWFpJcHZZQWxqenBVNzBzMHhxL01CNEVTQXVmMlNHM0xMdEFDYmhXdVB3My9cbkxXbjdWUzNreUU5U3RabTJhUlQvbzQyRXQrNzZCdEIvSm1Rem5iWW90UEs5OVdBbVdRV2JTN29DWkFqOWc1ZUxcbjhNYm9nK1k2RFI1cEM1QndNWGhFdDRWN2NNaHoxRnBsYU1kWTBhZGJBb0dCQU1Wb3J6MEZVejhTT24wRVdVVjRcbjAzdmxqdEgvYW1LUnNneDlkY3ppd1VaUXB4Vnd3Sm9paGtmS0ZQcGJLWWhEdFUzeWhQdUEvbldqVm9mNnNKcjdcbnF0Q1BuUk91SlowUkRSTE9aQUdhcUN0MkozMlpEYmNocHowR2JHa2dkUkJwYVpmY2lBWVZiS3lvdVZQNzYyQ2xcbmlRTDhBcEZEWnpKTXBocEdSTS9Vc2Z1UlxuLS0tLS1FTkQgUFJJVkFURSBLRVktLS0tLVxuIiwKICAiY2xpZW50X2VtYWlsIjogImdjcy11cGxvYWRlckBwZXJtaWFuLWFpLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwKICAiY2xpZW50X2lkIjogIjEwNTM2NDc4NDI4NjA0Mzg2MTAyNCIsCiAgImF1dGhfdXJpIjogImh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbS9vL29hdXRoMi9hdXRoIiwKICAidG9rZW5fdXJpIjogImh0dHBzOi8vb2F1dGgyLmdvb2dsZWFwaXMuY29tL3Rva2VuIiwKICAiYXV0aF9wcm92aWRlcl94NTA5X2NlcnRfdXJsIjogImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL29hdXRoMi92MS9jZXJ0cyIsCiAgImNsaWVudF94NTA5X2NlcnRfdXJsIjogImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL3JvYm90L3YxL21ldGFkYXRhL3g1MDkvZ2NzLXVwbG9hZGVyJTQwcGVybWlhbi1haS5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsCiAgInVuaXZlcnNlX2RvbWFpbiI6ICJnb29nbGVhcGlzLmNvbSIKfQo=";

const bucketName = "avatar-lesson-recordings";

const handler = async (req: NextRequest, res: NextResponse) => {
  const form = await req.formData();
  const file: any = form.get("file");

  if (!file) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }

  const objectKey = `uploads/${Date.now()}-${file.name}`;
  const contentType = file.type;

  const gcsUploader = new GCSUploader(gcpCredentialsBase64);

  try {
    await gcsUploader.uploadFile(
      bucketName,
      objectKey,
      Buffer.from(await file.arrayBuffer()),
      file.size,
      contentType
    );

    const publicUrl = `https://storage.googleapis.com/${bucketName}/${objectKey}`;

    return NextResponse.json({
      message: "File uploaded successfully!",
      url: publicUrl,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
};

export const dynamic = 'force-dynamic'; // Disable static optimization for this route

export async function POST(req: NextRequest, res: NextResponse): Promise<void | Response> {
  return new Promise((resolve, reject) => {
    upload.single("file")(req as any, res as any, async (err: any) => {
      if (err) {
        reject(NextResponse.json(
          { error: "Error uploading file." },
          { status: 500 }
        ));
      }
      try {
        const response = await handler(req, res);
        resolve(response);
      } catch (error) {
        reject(NextResponse.json(
          { error: "Error handling file upload." },
          { status: 500 }
        ));
      }
    });
  });
}
