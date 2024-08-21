import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";
import { cloneDeep } from "lodash-es";
import numeral from "numeral";
import moment from "moment";

export function copyToClipboard(text, callback) {
  try {
    const textField = document.createElement("textarea");
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    console.log(textField);

    try {
      document.execCommand("copy");
      console.log(text, "texttext");
      callback && callback();
    } catch (error) {
      console.error("error", error);
    }

    document.body.removeChild(textField);
  } catch (error) {
    navigator.clipboard
      .writeText(text)
      .then(function () {
        callback && callback();
      })
      .catch(function (err) {
        console.error("use navigator.clipboard.writeText error: " + err);
      });
  }
}

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function roundToDecimal(number, decimalPlaces) {
  const factor = 10 ** decimalPlaces;
  return Math.round(number * factor) / factor;
}
export function splitNumber(number) {
  const text = number.toString();
  return text.split(".");
}
export function getDiscount(original_number, number) {
  return splitNumber(100 - roundToDecimal(number / original_number, 2) * 100)[0];
}

export function isNotEmpty(value) {
  if (
    value !== undefined &&
    value !== null &&
    value !== "" &&
    value !== 0 &&
    (!Array.isArray(value) || value.length > 0) &&
    (typeof value !== "object" || Object.keys(value).length > 0)
  ) {
    return true;
  } else {
    return false;
  }
}
export function chunkArray(array, chunkSize = 20) {
  const chunkedArray = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunkedArray.push(array.slice(i, i + chunkSize));
  }
  return chunkedArray;
}

export function formatTimeDiff(time) {
  const currentTime = new Date();
  const targetTime = new Date(time);
  const timeDiff = currentTime.getTime() - targetTime.getTime();

  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(timeDiff / (1000 * 60));
  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  if (seconds < 60) {
    return `${seconds} ${seconds > 1 ? "Secs" : "Sec"} ago`;
  } else if (minutes < 60) {
    return `${minutes} ${minutes > 1 ? "Mins" : "Min"} ago`;
  } else if (hours < 24) {
    return `${hours} ${hours > 1 ? "Hours" : "Hour"} ago`;
  } else {
    return `${days} ${days > 1 ? "Days" : "Day"} ago`;
  }
}

export function dealUrlToReport() {
  const reg = /^\/[0-9]+/;
  const str = window.location.pathname.replace(reg, "").substr(1);
  const arr = str.split("/");
  let newStr = "";
  if (
    (arr[0]?.includes("detail") || arr[0]?.includes("recommendation") || arr[0]?.includes("download") || arr[0]?.includes("allversions")) &&
    !arr[0]?.includes("recommendations")
  ) {
    newStr = `${arr[0]}_${arr[arr.length - 1]}`;
  } else if (arr[1] && arr[1]?.includes("category")) {
    newStr = `${arr[1]}_${arr[2]}`;
  } else {
    newStr = str.replace("/", "_");
  }
  console.log("上报的page_name", newStr);
  return newStr || "home";
}

export function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getChannelPath(pathname) {
  const channels = pathname.match(/^\/\d{3}/g);
  return Array.isArray(channels) && channels.length ? channels[0] : "";
}

export function addCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
// 使用解构赋值交换数组中的元素
export function swapArrayElements(arr, indexA, indexB) {
  // 克隆数组以避免修改原始数组
  let newArray = cloneDeep(arr);
  [newArray[indexA], newArray[indexB]] = [newArray[indexB], newArray[indexA]];
  return newArray;
}

export function generateNumber(target, min, max) {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

  function lcg(seed) {
    const a = 1664525;
    const c = 1013904223;
    const m = 2 ** 32;
    seed = (a * seed + c) % m;
    return seed / m;
  }

  const randomValue = lcg(seed);

  // 计算新的范围
  const minValue = min * target;
  const newMaxValue = max * target;

  // 生成在新范围内的随机数
  const B = minValue + randomValue * (newMaxValue - minValue);

  return B.toFixed(0);
}

// 处理tilte字段返回整个带横线
// 处理tilte字段返回整个带横线
export function dealTitleToUrl(title) {
  const newTitle = title
    ?.replace(/\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\_|\+|\=|\{|\}|\||\:|\"|\<|\>|\?|\/|\.|\'|\;|\,|\\|\]|\[|\`|\,/g, "-")
    .replace(/\～|\·|\！|\@|\¥|\……|\（|\）|\「|\」|\【|\】|\|\｜|\、|\；|\‘|\：|\“|\”|\《|\》|\，|\。|\？|\—/g, "-")
    .replace(/ /g, "-")
    .replace(/\s/g, "-")
    .replace(/\x20/g, "-")
    .replace(/\-$/, "")
    .replace(/^\-/, "")
    .replace(/[\-]+/g, "-")
    .replace(/\&/g, "&amp;")
    .toLowerCase();
  const encodedUrl = encodeURI(newTitle);
  return `${encodedUrl}`;
}

export function partialAnonymizeName(name) {
  if (typeof name !== "string") {
    throw new Error("Input must be a string");
  }
  const length = name.length;

  if (length <= 2) {
    return "*" + name.slice(1);
  }

  const firstChar = name[0];
  const lastChar = name[length - 1];
  const middleLength = Math.ceil((length - 2) / 2);
  const middleVisiblePart = name.slice(1 + middleLength, length - 1);
  const middleAnonymizedPart = "*".repeat(middleLength);
  return firstChar + middleAnonymizedPart + middleVisiblePart + lastChar;
}

export function deepMerge(target, ...sources) {
  if (typeof target !== "object" || target === null) {
    return target;
  }

  for (const source of sources) {
    for (const key in source) {
      if (typeof source[key] === "object" && source[key] !== null) {
        target[key] = deepMerge({}, target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }

  return target;
}

export function formatNumber(number, formatter) {
  return numeral(number).format(formatter);
}

export function formatTime(time, formatter) {
  return moment(time).format(formatter);
}
