"use client";

import { useEffect, useState } from "react";
import firebaseApp from "@/lib/firebase";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import FcmTokenComp from "@/components/firebaseForeground";
import InstallationPrompt from "@/components/InstallationPrompt";
import useUserAgent from "@/hooks/useUserAgent";

export default function Home() {
  // const [updateAvailable, setUpdateAvailable] = useState(false);
  // const [token, setToken] = useState("null");
  const [msg, setMsg] = useState("null");
  const { isStandalone } = useUserAgent();
  // const [messaging, setMessaging] = useState();

  // useEffect(() => {
  //   // const messaging = getMessaging(firebaseApp);
  //   // setMessaging(messaging);
  //   // onMessage(messaging, () => {
  //   //   setMsg("fuck.....");
  //   // });
  // }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        // console.log("Received a message from service worker:", event.data);
        // // 处理收到的消息
        // alert(`Message from service worker: ${event.data.msg}`);
        setMsg("messaging push");
      });
    }
  }, []);

  // const handleUpdate = () => {
  //   if (navigator.serviceWorker.controller) {
  //     navigator.serviceWorker.controller.postMessage({ type: "SKIP_WAITING" });
  //     navigator.serviceWorker.controller.addEventListener("statechange", (e) => {
  //       if (e.target.state === "activated") {
  //         window.location.reload();
  //       }
  //     });
  //   }
  // };

  // function notif() {
  //   Notification.requestPermission().then((permission) => {
  //     if (permission === "granted") {
  //       getToken(messaging, { vapidKey: "BO-PyAKSc9jctgPYma0CKkLBc7m1KAisA6f3f9cakvEKgggn_jgROun1vJiJvDC962YEPaRyFuhi-bI_n6fc18I" })
  //         .then((currentToken) => {
  //           if (currentToken) {
  //             console.log(currentToken);
  //             setToken(currentToken);
  //           } else {
  //             // Show permission request.
  //             console.log("No registration token available. Request permission to generate one.");
  //             // Show permission UI.
  //           }
  //         })
  //         .catch((err) => {
  //           console.log("An error occurred while retrieving token. ", err);
  //         });
  //     } else {
  //       console.log("Unable to get permission to notify.");
  //     }
  //   });
  // }

  return (
    <main className="flex flex-col items-center justify-between rounded-lg gap-4">
      <h1>web-push-with-firebase demo2</h1>
      <FcmTokenComp />
      <h5>msg: {msg}</h5>
      <InstallationPrompt />
    </main>
  );
}
