import { defaultCache } from "@serwist/next/worker";
import { Serwist } from "serwist";

// import { clientsClaim } from "workbox-core";
// import { initializeApp } from "firebase/app";
// import { getMessaging } from "firebase/messaging/sw";

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  fallbacks: {
    entries: [
      {
        url: "/~offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

self.addEventListener("notificationclick", function (event) {
  // do what you want
});
self.addEventListener("push", async (event) => {
  try {
    console.log("PUSH", { event });
    const data = await event.data?.json();
    event?.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.body,
        icon: "/icons/icon-48x48.png",
      })
    );
  } catch (error) {
    console.error("PUSH ERROR", { error });
  }
});
self.addEventListener("notificationclick", (event) => {
  console.log(999, event);
  event.notification.close(); // 关闭通知

  if (event.action === "open_url") {
    clients.openWindow("https://example.com"); // 打开链接
  } else if (event.action === "close") {
    // 可以在这里处理关闭操作
  } else {
    // 处理通知点击
    clients.openWindow("https://example.com");
  }
});

serwist.addEventListeners();
