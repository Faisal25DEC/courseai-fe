import { NextRequest, NextResponse } from "next/server";
import multer from "multer";
import { GCSUploader } from "@/utils/gcs-uploader";

const bucketName = "permian-course-guide-web-ui";

// Initialize multer for file upload
const upload = multer({ storage: multer.memoryStorage() });
const gcpCredentialsBase64 =
  "ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIsCiAgInByb2plY3RfaWQiOiAiYWxpLWJ1ZmF5byIsCiAgInByaXZhdGVfa2V5X2lkIjogIjkyMDNjMGFjOGIyOTczYTI0Zjg5ZjFmOWI3MTFiZjIxNjE3M2U1NWUiLAogICJwcml2YXRlX2tleSI6ICItLS0tLUJFR0lOIFBSSVZBVEUgS0VZLS0tLS1cbk1JSUV2UUlCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktjd2dnU2pBZ0VBQW9JQkFRQzFneUhjQy9QZ3pFb0lcbjVSWnhIY3BSc0tHVzVvMTlROFNsTlZQUDBjQ1ZmcmtudFJGOVU2YzNtRi9tNC83RjA4ZFA3c2RFQlhPQXpsU3RcbmIxcHpKSytQMmtXUlNYVWV4ZitEVlVMdW12SHRiOUJpMUdUMzN6NlN0UUFUS2dpU3FLdTVwNEt4QmUzeEtsVktcblhRb3F6N3VDU3RWN3RGcDV4QVcwSW1SZ2lsamd2ekFQci9ST2dCSUJBTFloQVhvZ015aXN6SnFoQ0hDNTdLbm9cbmFYUmxRMy94Mzd3dWgrVHgzcGdra0dOYUFraHlKdVlpMFZyOTY2YnMrRncrQkgreVFpQjVSQUh6STJQeC8vTW1cbnNZYzd6ZEdna1ZrZWt3WDJUeHZpcFczNFpZRVBjVS9kOHJ3Vk00bEtGeEpzVmN4ZUN0ODg0NWJmbER0NlNQek5cbjhuY1htdW45QWdNQkFBRUNnZ0VBTXRBUGFnVDBsRkZNUm5vdlVxSkcwYUNUVStXZDVWdlQwSFlCelBOSXFQRU5cblQwYmFxdzJBaWNrL3k2aTIyVldrZmNWNEJoeEtqZHYxQzRwWk5WT25UQ3VML3hTajAyWVZWZ1JIMVBrT1VleFRcbjExN2pGeHJwYnZONW5tUE5lNVQ1WWVNNWJHb2ZCcnpWbkpnNE1PenZicFdaZHVSeDBaV2xEUnoxb2FzSkgzMGRcbmR5WjRtQWVXOFRKc2hlT3poZlRUY09mcGdvMlhhRTNLVU02UklPQTc3RVNDaXROb2Z3b1ZoOEtSM3FFMFhWeFNcbnRvZnA4Y2tmeWh0MFdMOFZYU2ZVaUZCejhEVHRybFlCeWVZVnk2a2JabEN4dlZycGYrWnk5b21ROFlaTytWQzNcblgvVWRGdWhxVEF5MEM2am1DbENJSTN0d3R5bmREMkdtTWUzYU5wWXRwd0tCZ1FEYlVOZy90ekFTMlVMUWJlakZcbjMva3pCdTJxT0xsU05KMVovV3ZYc0ptY3V4Y1RzOVZxZzNJbmQwZzRsZG9vNkNyc2F1WnRoTitHVE45L2VOeUNcbmYwdVA0NWpIeDE4M0dwV0l4VWdPMDdsWm5qbXNRTUMzSytCN3l0RjNWWjk4TlJrd3BuVHF2MXNxOUVsMUt0QWpcbkgxKzAzOFdvNGd2bFZUeXBnaDVvUG5vTXh3S0JnUURUMzRlaTNPeXMzZVRteW1PUkJBdnJ5VllGT2d0Zi9oaTFcbnc1WlpiQlF1bVMrRzNnaWR6Q214S21xaGMvRitzQk0xQzFTais3eG96ZUFpZFd0VDRmQlRMRHFEYk5yVWxwQktcbmVFdzA5eDZzemNISTVndUltS0hra2hVSlQ3MHZzK1k4b3JKL3VqRkt3anlabWgxSkNCb2NnQ2tLZTNFZzVycDNcbkppQUJheXpuR3dLQmdHYlVXUkJHeS91S2NwRlhkelNQOXorOWwrR2dCd1JNTnhyaWY1WDU3NHhWREZUb2xNQUVcbk1abmZpN1U4VGJXd1phL0R6NWE2SGpQU0IxaTFTbTdGVUtCK2pqdmRkdjlYTDVXWktsZ0pYWFp2Z1lzS01WR3dcbitPZ1NDSFJ6YVB2THlhdk40RFBRMU9ZbTgrcEQwS01uS3JDYjJ3bDhNeWVyOTIxaTNPN3puRFl4QW9HQkFLRHJcbmRhbE5BcldKRXdIM1ZnZ2VlcTlyQzlxTWEzZE5GcGQzSmdway9DOG9TZUMxWXZYMnl2TzBzNmhNMTI3UmJNVXRcbkJleEdscU5ET3FqeFpjTWdKOWdFRDYwaVVGS0d5TERIRFpwczF1K0lsMVp1NHZPc2VjbVE2a2xZTnVpMFNucGpcbldBK0s2MFZNb1pwSVkxWEV3WkJFQnVmZk9kMHpZUXg5K0hFYlpjOWhBb0dBZldUMmJUVkQ5eWluUVdoaU90YldcbmE2dkpsbkU1WjhaZnRiOWppUXpZeGJScngwclBOdjBZYm13N1p0dVNRaFU4VmNRa1JuWGhCZmRpa1FzUWxMaTNcbjNZYXp6YlY2S1RhOWxVZVVLMTRyVnA5OExWT2VLZDl0azBLRXBSa1VvdUFiV091dW1HNTFVVkdITXJNS0NnTThcbnM4SGdOdzRmRzQ5eFBBYTQvVDNSWTRnPVxuLS0tLS1FTkQgUFJJVkFURSBLRVktLS0tLVxuIiwKICAiY2xpZW50X2VtYWlsIjogImdjcy11cGxvYWRAYWxpLWJ1ZmF5by5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsCiAgImNsaWVudF9pZCI6ICIxMTMxNTIwNjQwMTY2NTA4ODY5MjIiLAogICJhdXRoX3VyaSI6ICJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20vby9vYXV0aDIvYXV0aCIsCiAgInRva2VuX3VyaSI6ICJodHRwczovL29hdXRoMi5nb29nbGVhcGlzLmNvbS90b2tlbiIsCiAgImF1dGhfcHJvdmlkZXJfeDUwOV9jZXJ0X3VybCI6ICJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9vYXV0aDIvdjEvY2VydHMiLAogICJjbGllbnRfeDUwOV9jZXJ0X3VybCI6ICJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9yb2JvdC92MS9tZXRhZGF0YS94NTA5L2djcy11cGxvYWQlNDBhbGktYnVmYXlvLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwKICAidW5pdmVyc2VfZG9tYWluIjogImdvb2dsZWFwaXMuY29tIgp9Cg=="; // truncated for brevity

export const config = {
  api: {
    bodyParser: false,
  },
};

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
      message: "Image uploaded successfully!",
      url: publicUrl,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
};

export async function POST(req: any, res: any) {
  return upload.single("file")(req, res, (err: any) => {
    if (err) {
      return NextResponse.json(
        { error: "Error uploading file." },
        { status: 500 }
      );
    }
    return handler(req, res);
  });
}
