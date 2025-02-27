import dotenv from "dotenv";
dotenv.config();

import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.CLIENT_ID);

export async function verifyGoogleToken(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });

    const payload = ticket.getPayload();
    return payload;
  } catch (error) {
    console.error("Error verifying Google token:", error.message);
    return error.message;
  }
}
