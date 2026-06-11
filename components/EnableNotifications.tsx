"use client";

import React, { useState, useEffect } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "@/lib/firebase-messaging";
import { Bell, BellOff, Loader2 } from "lucide-react";

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || "BLvOB7K4bhEgS8A5ffUYR_5Wd0-IhZYx95D7zD0_OxM-fXB3JVUXhDKAc2JeL4JSm0TzGWroF0PhD80JPYDvX9w";

export default function EnableNotifications({ employeeId }: { employeeId?: number }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<NotificationPermission | "idle">("idle");

  const registerFcmTokenWithDb = async (token: string) => {
    try {
      await fetch("/api/employee/register-fcm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, employeeId }),
      });
    } catch (err) {
      console.error("Failed to register FCM token with database:", err);
    }
  };

  // Check current notification permission on mount
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      const currentPermission = Notification.permission;
      setStatus(currentPermission);

      if (currentPermission === "granted") {
        const fetchAndRegisterToken = async () => {
          try {
            if (messaging) {
              let registration;
              if ("serviceWorker" in navigator) {
                registration = await navigator.serviceWorker.ready;
              }
              const token = await getToken(messaging, {
                vapidKey: VAPID_KEY,
                serviceWorkerRegistration: registration,
              });
              console.log("FCM Token:", token);
              if (token) {
                await registerFcmTokenWithDb(token);
              }

              // Handle foreground push notifications
              onMessage(messaging, (payload) => {
                console.log("Foreground push received:", payload);
                if (payload.notification) {
                  alert(`[Push Notification]\n\nTitle: ${payload.notification.title}\nMessage: ${payload.notification.body}`);
                }
              });
            }
          } catch (error) {
            console.error("Error fetching FCM token:", error);
          }
        };
        fetchAndRegisterToken();
      }
    }
  }, [employeeId]);

  const enableNotifications = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      alert("Push notifications are not supported in this browser/device. If you are on iOS, you must install the PWA (Add to Home Screen) first to enable notifications.");
      return;
    }
    setLoading(true);
    try {
      const permission = await Notification.requestPermission();
      setStatus(permission);

      if (permission !== "granted") {
        setLoading(false);
        return;
      }

      if (!messaging) {
        console.warn("Firebase Messaging is not initialized or supported in this browser.");
        alert("Notification permission granted, but Firebase Messaging is not initialized in this browser.");
        setLoading(false);
        return;
      }

      let registration;
      if ("serviceWorker" in navigator) {
        registration = await navigator.serviceWorker.ready;
      }
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      console.log("Firebase Cloud Messaging Token:", token);
      if (token) {
        await registerFcmTokenWithDb(token);
        alert(`Notifications enabled successfully!\n\n(FCM Token registered in database)`);
      } else {
        alert("Could not retrieve notification token.");
      }
    } catch (error: any) {
      console.error("Error enabling notifications:", error);
      alert(`Error enabling notifications: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={enableNotifications}
      disabled={loading || status === "granted"}
      className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-none border border-white/15 transition-all cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
    >
      {loading ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : status === "denied" ? (
        <BellOff className="w-3 h-3 text-red-500" />
      ) : (
        <Bell className="w-3 h-3 text-[#E61E32]" />
      )}
      {loading
        ? "Requesting..."
        : status === "granted"
        ? "Notifications Enabled"
        : status === "denied"
        ? "Blocked"
        : "Enable Notifications"}
    </button>
  );
}
