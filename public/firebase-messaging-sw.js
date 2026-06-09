importScripts(
  "https://www.gstatic.com/firebasejs/11.9.1/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/11.9.1/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyCNpF-tid2a_LX0En8Q1kMMeBRgi0uZGrs",
  authDomain: "redlix-ems.firebaseapp.com",
  projectId: "redlix-ems",
  storageBucket: "redlix-ems.firebasestorage.app",
  messagingSenderId: "794355549260",
  appId: "1:794355549260:web:1f451f28a285f50a92a0e9",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(
    payload.notification.title,
    {
      body: payload.notification.body,
      icon: "/logo.png",
    }
  );
});
