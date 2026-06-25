import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import fs from "fs";
import path from "path";

const initializeFirebaseAdmin = () => {
  const activeApps = getApps();
  if (activeApps.length > 0) {
    return activeApps[0];
  }

  // 1. Check for firebase-service-account.json in the project root
  const serviceAccountPath = path.join(process.cwd(), "firebase-service-account.json");
  if (fs.existsSync(serviceAccountPath)) {
    try {
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
      return initializeApp({
        credential: cert(serviceAccount),
      });
    } catch (error) {
      console.error("Error reading firebase-service-account.json:", error);
    }
  }

  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || "redlix-ems";

  const isValidKey = privateKey && 
                     privateKey.includes("BEGIN PRIVATE KEY") && 
                     !privateKey.includes("YOUR_PRIVATE_KEY_HERE");

  if (isValidKey && clientEmail) {
    return initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, "\n"),
      }),
    });
  }

  console.warn(
    "Firebase Admin credentials are missing or invalid. Send notifications will fail until " +
    "firebase-service-account.json is added to the root directory or env variables are set."
  );

  return initializeApp({
    projectId
  });
};

export const adminApp = initializeFirebaseAdmin();
export const adminMessaging = getMessaging(adminApp);
