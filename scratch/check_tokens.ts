import prisma from "../lib/prisma";

async function main() {
  try {
    const count = await prisma.fcmToken.count();
    const tokens = await prisma.fcmToken.findMany({
      include: { employee: true },
    });
    console.log("----------------------------------------");
    console.log("Active Database FCM Registration Stats:");
    console.log("Total Tokens Count:", count);
    console.log("Tokens List:", JSON.stringify(tokens, null, 2));
    console.log("----------------------------------------");
  } catch (error: any) {
    console.error("Error checking FCM tokens in database:", error);
  } finally {
    process.exit(0);
  }
}

main();
