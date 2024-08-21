import { event as gaevent } from "nextjs-google-analytics";
// import { fbevent } from "./fpixel";
import { dealUrlToReport, isMobileDevice } from "./common";
import { utc } from "moment";

function getUrlParam(name) {
  const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
  const r = window.location.search.substr(1).match(reg); // 匹配目标参数
  if (r != null) return unescape(r[2]);
  return null; // 返回参数值
}

function genUtcTime() {
  return utc().format("YYYY-MM-DD HH:mm:ss.SSS");
}

function getTestConfig() {
  const abtestcfg = window.localStorage && window.localStorage.getItem("x-abtestcfg");
  // eslint-disable-next-line no-extra-boolean-cast
  if (Boolean(abtestcfg)) {
    const abtestcfgObj = JSON.parse(abtestcfg || "") || {};
    return abtestcfgObj;
  } else {
    return false;
  }
}

function getTestRandom() {
  const abtestcfgName = window.localStorage && window.localStorage.getItem("x-abtestcfg-name");
  const abtestcfgSegments = window.localStorage && window.localStorage.getItem("x-abtestcfg-segments");
  let randomLeft = 0;
  const randomNum = Math.random();
  let max = 0;
  const abtestcfgObj = getTestConfig();
  // eslint-disable-next-line no-extra-boolean-cast
  if (Boolean(abtestcfgObj)) {
    const { name, segments } = abtestcfgObj;
    //  当进入ABtest时，如果有一个用户进来之前已经有ABtest了，覆盖
    if (abtestcfgName && abtestcfgSegments && abtestcfgName === name) {
      return;
    }
    for (const key in segments) {
      const value = segments[key];
      max = max + value;
      if (randomNum < max && randomNum >= randomLeft) {
        window.localStorage && window.localStorage.setItem("x-abtestcfg-name", name);
        window.localStorage && window.localStorage.setItem("x-abtestcfg-segments", key);
        reportUserSegment();
        return;
      } else {
        randomLeft = randomLeft + value;
      }
    }
  }
}

function setTestConfig() {
  const abtestcfg = getUrlParam("abtestcfg") || "";
  if (Boolean(abtestcfg)) {
    window.localStorage && window.localStorage.setItem("x-abtestcfg", abtestcfg);
    getTestRandom();
  }
}

export function setAttribution() {
  const properties = {
    campaignid: getUrlParam("campaignid") || "organic",
    adgroupid: getUrlParam("adgroupid") || "organic",
    creative: getUrlParam("creative") || "organic",
    device: getUrlParam("device") || "organic",
    devicemodel: getUrlParam("devicemodel") || "organic",
    gclid: getUrlParam("gclid") || "organic",
    network: getUrlParam("network") || "organic",
    adposotion: getUrlParam("adposotion") || "organic",
    placement: getUrlParam("placement") || "organic",
    keyword: getUrlParam("keyword") || "organic",
    browser_language: navigator.language || "organic",
    debugId: window && window.location.href,
    is_mobile: `${isMobileDevice()}`,
  };

  window.localStorage && window.localStorage.setItem("x-attribution", JSON.stringify(properties));
  const userid = window.localStorage && window.localStorage.getItem("x-userid");

  // abceshi
  setTestConfig();
  // 上报新用户
  if (!userid) {
    window.localStorage && window.localStorage.setItem("x-first-visit-time", genUtcTime());
    window.localStorage &&  window.localStorage.setItem("x-userid", window.userid);
    analytics("user_first_visit", {
      event_category: "engagement",
      event_label: "user_first_visit",
    });
  }
}

function reportUserSegment() {
  const description = window.localStorage && window.localStorage.getItem("x-abtestcfg-name");
  const user_type = window.localStorage && window.localStorage.getItem("x-abtestcfg-segments");
  const attribution = JSON.parse(window.localStorage && window.localStorage.getItem("x-attribution"));
  // window.ta && window.ta.track('user_segment', {...attribution, description, user_type});
}

export default function analytics(eventName, eventProperties = {}) {
  const properties = {
    campaignid: getUrlParam("campaignid") || "organic",
    adgroupid: getUrlParam("adgroupid") || "organic",
    creative: getUrlParam("creative") || "organic",
    device: getUrlParam("device") || "organic",
    devicemodel: getUrlParam("devicemodel") || "organic",
    gclid: getUrlParam("gclid") || "organic",
    network: getUrlParam("network") || "organic",
    adposotion: getUrlParam("adposotion") || "organic",
    placement: getUrlParam("placement") || "organic",
    browser_language: navigator.language || "organic",
    keyword: getUrlParam("keyword") || "organic",
    debugId: window && window.location.href,
    is_mobile: `${isMobileDevice()}`,
  };

  const props = { ...properties, ...eventProperties };

  console.log("track: ", eventName, props);

  window.ta && window.ta.track(eventName, props);
  gaevent(eventName, props);
  // fbevent(eventName, props);
}

export function pageHiddenReport() {
  const str = dealUrlToReport();
  analytics("page_hidden", {
    event_label: "page_hidden",
    page_name: str,
  });
}

export function mouseEnterAndHideReport() {
  const str = dealUrlToReport();
  analytics("test240419_1", {
    event_label: "test240419_1",
    page_name: str,
  });
}

export function reportWithPageName(eventName) {
  const str = dealUrlToReport();
  analytics(eventName, {
    event_label: eventName,
    page_name: str,
  });
}

export function mouseEnterAndHideReportBySlot(eventName) {
  const str = dealUrlToReport()
  analytics(eventName, {
    'event_label': eventName,
    'page_name': str,
  })
}

export function mouseEnterAndHideReportWidthValue(value) {
  const str = dealUrlToReport()
  analytics('test230619_3', {
    'event_label': 'test230619_3',
    'page_name': str,
  })
}

// 上报广告拦截
let hasReportAdBlocked = false
export function reportAdBlocked() {
  // hasReportAdBlocked = window?.localStorage?.getItem("hasReportAdBlocked") || false
  if (!hasReportAdBlocked) {
    hasReportAdBlocked = true
    // window.localStorage.setItem('hasReportAdBlocked', true);
    reportTa('fe_adblock_detect', {
      event_category: 'engagement',
      event_label: "fe_adblock_detect",
    })
  }
}

export function userEngegementReport() {
  const str = dealUrlToReport()
  analytics('user_engegement_ta',{
    event_category: 'engagement',
    event_label:"user_engegement_ta",
    page_name: str,
    time:5
  })
}