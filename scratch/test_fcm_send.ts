import "dotenv/config";
import { adminMessaging } from "../lib/firebase-admin";
import prisma from "../lib/prisma";

async function testFcmSend() {
  try {
    const tokens = await prisma.fcmToken.findMany({
      include: { employee: true }
    });
    console.log(`Found ${tokens.length} token(s) in the database.`);
    if (tokens.length === 0) {
      console.log("No tokens to send to.");
      return;
    }

    const messages = tokens.map((t) => ({
      token: t.token,
      notification: {
        title: "Test Broadcast",
        body: "This is a test notification from Redlix EMS",
      },
    }));

    console.log("Sending messages via Firebase Admin Messaging...");
    const response = await adminMessaging.sendEach(messages);
    console.log("----------------------------------------");
    console.log("Send Summary:");
    console.log("Success Count:", response.successCount);
    console.log("Failure Count:", response.failureCount);
    console.log("Responses:");
    response.responses.forEach((res, idx) => {
      const tokenObj = tokens[idx];
      const name = tokenObj.employee ? tokenObj.employee.name : "Anonymous/Null";
      if (res.success) {
        console.log(`[Success] Token ID ${tokenObj.id} (${name})`);
      } else {
        console.log(`[Failure] Token ID ${tokenObj.id} (${name}):`, res.error?.message || res.error);
      }
    });
    console.log("----------------------------------------");
  } catch (error: any) {
    console.error("FCM Send Test Error:", error);
  } finally {
    process.exit(0);
  }
}

testFcmSend();
