import * as React from "react";
import * as NProgress from "nprogress";
import { usePathname, useSearchParams, useRouter as useNextRouter } from "next/navigation";

const NextTopLoader = ({
  color: propColor,
  height: propHeight,
  showSpinner = false,
  crawl,
  crawlSpeed,
  initialPosition,
  easing,
  speed,
  shadow,
  template,
  zIndex = 100003,
  showAtBottom = false,
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const defaultColor = "#FF385C";
  const defaultHeight = 3;

  const color = propColor ?? defaultColor;
  const height = propHeight ?? defaultHeight;

  // Any falsy (except undefined) will disable the shadow
  const boxShadow =
    !shadow && shadow !== undefined ? "" : shadow ? `box-shadow:${shadow}` : `box-shadow:0 0 10px ${color},0 0 5px ${color}`;

  // Check if to show at bottom
  const positionStyle = showAtBottom ? "bottom: 0;" : "top: 0;";
  const spinnerPositionStyle = showAtBottom ? "bottom: 15px;" : "top: 15px;";

  const styles = (
    <style>
      {`#nprogress{pointer-events:none}#nprogress .bar{background:${color};position:fixed;z-index:${zIndex};${positionStyle}left:0;width:100%;height:${height}px}#nprogress .peg{display:block;position:absolute;right:0;width:100px;height:100%;${boxShadow};opacity:1;-webkit-transform:rotate(3deg) translate(0px,-4px);-ms-transform:rotate(3deg) translate(0px,-4px);transform:rotate(3deg) translate(0px,-4px)}#nprogress .spinner{display:block;position:fixed;z-index:${zIndex};${spinnerPositionStyle}right:15px}#nprogress .spinner-icon{width:18px;height:18px;box-sizing:border-box;border:2px solid transparent;border-top-color:${color};border-left-color:${color};border-radius:50%;-webkit-animation:nprogress-spinner 400ms linear infinite;animation:nprogress-spinner 400ms linear infinite}.nprogress-custom-parent{overflow:hidden;position:relative}.nprogress-custom-parent #nprogress .bar,.nprogress-custom-parent #nprogress .spinner{position:absolute}@-webkit-keyframes nprogress-spinner{0%{-webkit-transform:rotate(0deg)}100%{-webkit-transform:rotate(360deg)}}@keyframes nprogress-spinner{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}
    </style>
  );

  // Convert the url to Absolute URL based on the current window location.
  const toAbsoluteURL = (url) => {
    return new URL(url, window.location.href).href;
  };

  // Check if it is hash anchor or same page anchor
  const isHashAnchor = (currentUrl, newUrl) => {
    const current = new URL(toAbsoluteURL(currentUrl));
    const next = new URL(toAbsoluteURL(newUrl));
    return current.href.split("#")[0] === next.href.split("#")[0];
  };

  React.useEffect(() => {
    NProgress.configure({
      showSpinner: showSpinner ?? true,
      trickle: crawl ?? true,
      trickleSpeed: crawlSpeed ?? 200,
      minimum: initialPosition ?? 0.08,
      easing: easing ?? "ease",
      speed: speed ?? 200,
      template:
        template ??
        '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>',
    });

    function isAnchorOfCurrentUrl(currentUrl, newUrl) {
      const currentUrlObj = new URL(currentUrl);
      const newUrlObj = new URL(newUrl);
      // Compare hostname, pathname, and search parameters
      if (
        currentUrlObj.hostname === newUrlObj.hostname &&
        currentUrlObj.pathname === newUrlObj.pathname &&
        currentUrlObj.search === newUrlObj.search
      ) {
        // Check if the new URL is just an anchor of the current URL page
        const currentHash = currentUrlObj.hash;
        const newHash = newUrlObj.hash;
        return currentHash !== newHash && currentUrlObj.href.replace(currentHash, "") === newUrlObj.href.replace(newHash, "");
      }
      return false;
    }

    // eslint-disable-next-line no-var
    var npgclass = document.querySelectorAll("html");
    function findClosestAnchor(element) {
      while (
        element &&
        element.tagName.toLowerCase() !== "a" &&
        !(typeof element?.className === "string" && element?.className?.includes("disable-progress"))
      ) {
        element = element.parentElement;
      }
      return element;
    }
    function handleClick(event) {
      try {
        const target = event.target;
        const anchor = findClosestAnchor(target);
        const newUrl = anchor?.href;
        if (newUrl) {
          const currentUrl = window.location.href;
          // const newUrl = (anchor as HTMLAnchorElement).href;
          const isExternalLink = anchor.target === "_blank";

          // Check for Special Schemes
          const isSpecialScheme = ["tel:", "mailto:", "sms:", "blob:", "download:"].some((scheme) => newUrl.startsWith(scheme));
          const isAnchor = isAnchorOfCurrentUrl(currentUrl, newUrl);
          if (
            newUrl === currentUrl ||
            isAnchor ||
            isExternalLink ||
            isSpecialScheme ||
            event.ctrlKey ||
            event.metaKey ||
            isHashAnchor(window.location.href, anchor.href)
          ) {
            NProgress.start();
            NProgress.done();
            [].forEach.call(npgclass, function (el) {
              el.classList.remove("nprogress-busy");
            });
          } else {
            NProgress.start();
            (function (history) {
              const pushState = history.pushState;
              history.pushState = function () {
                NProgress.done();
                [].forEach.call(npgclass, function (el) {
                  el.classList.remove("nprogress-busy");
                });
                return pushState.apply(history, arguments);
              };
            })(window.history);
          }
        }
      } catch (err) {
        // Log the error in development only!
        // console.log('NextTopLoader error: ', err);
        NProgress.start();
        NProgress.done();
      }
    }

    // Add the global click event listener
    document.addEventListener("click", handleClick);

    // Clean up the global click event listener when the component is unmounted
    return () => {
      document.removeEventListener("click", handleClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    NProgress.done();
  }, [pathname, searchParams]);

  return styles;
};
export default NextTopLoader;

export function isSameURL(target, current) {
  const cleanTarget = target.protocol + "//" + target.host + target.pathname;
  const cleanCurrent = current.protocol + "//" + current.host + current.pathname;

  return cleanTarget === cleanCurrent;
}

export function useRouter() {
  const router = useNextRouter();
  const pathname = usePathname();

  function push(href, options, NProgressOptions) {
    if (NProgressOptions?.showProgressBar === false) return router.push(href, options);

    const currentUrl = new URL(pathname, location.href);
    const targetUrl = new URL(href, location.href);

    if (isSameURL(targetUrl, currentUrl) || href === pathname) return router.push(href, options);

    NProgress.start();

    return router.push(href, options);
  }

  function back(NProgressOptions) {
    if (NProgressOptions?.showProgressBar === false) return router.back();

    NProgress.start();

    return router.back();
  }

  return { ...router, push, back };
}
