"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { useEffect, useState } from "react";

export default function LockScreen({ children }) {
  //   const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  function unlock() {
    setIsOpen(false);
    sessionStorage.removeItem("lock");
  }

  function lock() {
    sessionStorage.setItem("lock", "1");
    setIsOpen(true);
  }

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem("lock") === "1") {
      setIsOpen(true);
    }
  }, []);

  function handler() {
    if (document.visibilityState === "visible") {
    } else if (document.visibilityState === "hidden") {
    //   lock();
    }
  }

  useEffect(() => {
    document.addEventListener("visibilitychange", handler);
    // return document.removeEventListener("visibilitychange", handler);
  }, []);

  return (
    <>
      <Modal
        isOpen={isOpen}
        // onOpenChange={setIsOpen}
        size="full"
        disableAnimation
        hideCloseButton
        isDismissable={false}
        shadow="none"
        radius="none"
        classNames={{ body: "flex items-center justify-center" }}
      >
        <ModalContent>
          {(onClose) => (
            <ModalBody>
              <div>LOCK</div>
              <button onClick={unlock}>unlock</button>
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
      {/* {isMounted ? (isOpen ? null : children) : null} */}
      {children}
    </>
  );
}
