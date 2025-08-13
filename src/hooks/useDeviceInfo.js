import { useMemo } from "react";

export default function useDeviceInfo() {
  return useMemo(() => {
    const ua = navigator.userAgent;
    const platform = navigator.platform;
    const vendor = navigator.vendor;

    let deviceType = "Desktop";
    if (/Mobi|Android/i.test(ua)) deviceType = "Mobile";
    if (/Tablet|iPad/i.test(ua)) deviceType = "Tablet";

    return {
      userAgent: ua,
      platform,
      vendor,
      language: navigator.language,
      deviceType,
      online: navigator.onLine,
    };
  }, []);
}
