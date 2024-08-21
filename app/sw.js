import { defaultCache } from "@serwist/next/worker";
import { Serwist } from "serwist";

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

// 添加自定义监听器
self.addEventListener("activate", (event) => {
  console.log("activate------", event);
  serwist.handleActivate(event);
});
self.addEventListener("fetch", (event) => {
  console.log("fetch------", event);
  serwist.handleFetch(event);
});
self.addEventListener("install", (event) => {
  console.log("install------", event);
  serwist.handleInstall(event);
});

serwist.addEventListeners();
