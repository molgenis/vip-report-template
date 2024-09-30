import { HtsFileMetadata } from "@molgenis/vip-report-api/src/Api";

export function createDownloadFilename(htsFileMetadata: HtsFileMetadata) {
  return (
    (htsFileMetadata.uri.split("\\").pop()?.split("/").pop()?.split(".").shift() || "unknown") +
    "_report_" +
    getDateTimeString() +
    ".vcf"
  );
}

// derived from https://stackoverflow.com/a/19176102
function getDateTimeString() {
  const now = new Date();

  const year = now.getFullYear().toString();
  let month = (now.getMonth() + 1).toString();
  let day = now.getDate().toString();
  let hour = now.getHours().toString();
  let minute = now.getMinutes().toString();
  let second = now.getSeconds().toString();

  if (month.length == 1) month = "0" + month;
  if (day.length == 1) day = "0" + day;
  if (hour.length == 1) hour = "0" + hour;
  if (minute.length == 1) minute = "0" + minute;
  if (second.length == 1) second = "0" + second;

  return year + month + day + "_" + hour + minute + second;
}
