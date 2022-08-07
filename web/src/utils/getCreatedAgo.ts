export const getDateAgo = (date: number) => {
  const rtf = new Intl.RelativeTimeFormat("en");
  const now = new Date().getTime();
  const time = date;

  const diff = now - time;

  if (diff < 1000) {
    return "now";
  } else if (diff < 60 * 1000) {
    return rtf.format(-1 * Math.round(diff / 1000), "second");
  } else if (diff < 3600 * 1000) {
    return rtf.format(-1 * Math.round(diff / 60000), "minute");
  } else if (diff < 86400 * 1000) {
    return rtf.format(-1 * Math.round(diff / 3600000), "hour");
  } else if (diff < 2629743 * 1000) {
    return rtf.format(-1 * Math.round(diff / 86400000), "day");
  } else if (diff < 31556926 * 1000) {
    return rtf.format(-1 * Math.round(diff / 2629743000), "month");
  } else {
    return rtf.format(-1 * Math.round(diff / 31556926000), "year");
  }
};
