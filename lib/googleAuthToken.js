const token =
  "eyJhbGciOiJSUzI1NiIsImtpZCI6Ijc2M2Y3YzRjZDI2YTFlYjJiMWIzOWE4OGY0NDM0ZDFmNGQ5YTM2OGIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIyNDAwODEyNzkyNTgta3QwNDlxODIxajB1MWFoNG1xOG44NnBka3Y5OXZvaTUuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIyNDAwODEyNzkyNTgta3QwNDlxODIxajB1MWFoNG1xOG44NnBka3Y5OXZvaTUuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDI0OTMyMjA2NDI3MDYwOTgxOTAiLCJlbWFpbCI6ImFsaXphbmFzaXI0NTQ1QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYmYiOjE3NDA0NjYxNjAsIm5hbWUiOiJBbGl6YSBOYXNpciIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NJcFI3aXBEYW9NeFFHWC1pVlA3UHNmMG0zcy1vZ1JOc1AxQWRNVDlxR0plSlhUNWc9czk2LWMiLCJnaXZlbl9uYW1lIjoiQWxpemEiLCJmYW1pbHlfbmFtZSI6Ik5hc2lyIiwiaWF0IjoxNzQwNDY2NDYwLCJleHAiOjE3NDA0NzAwNjAsImp0aSI6ImQ0YzI4ZGM5OThmMzkzODk3YTVjMTQ3M2ZlMDZhNTI1ZDNjOGYxNmMifQ.JQ45ovvtUcNAtmAIyrTK8hAQjKNEAbtjqkKQjWDGTzI5I5h_i4rZy9Yb4cu67dsrV9BaQbkW0Za3jI-9mWINBaBcTf1QQqxd2KfRaisobrH_5xWgVgqd1VHRmXWIJpdq1k8CvgMeW4357md8DGBoqK_eVLuc0dd0fjq0aw3332iy4MHXPHqQqDo-8xm-KPNT9ZvULKnhholtzifB8DrWb6sg_2mPA-3055TykMRUvb_DBsBPHaIdLkdRq-mA5PhdADbiXTrZhTRoM7P3hDDk9rSrOPUQ4TxJguyBIscwuBZj5o6mPaqqNMT-znAp_kssVlFXgiHobtA5tUfjpd8GpA";

const clientId =
  "240081279258-kt049q821j0u1ah4mq8n86pdkv99voi5.apps.googleusercontent.com";

import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(clientId);

export async function verifyGoogleToken() {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: clientId, // Client ID for verification
    });

    const payload = ticket.getPayload(); // Decoded user data
    return payload;
  } catch (error) {
    console.error("Error verifying Google token:", error.message);
    return null;
  }
}
