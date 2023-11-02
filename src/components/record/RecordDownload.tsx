import { Component } from "solid-js";
import { HtsFileMetadata, Query, Sample } from "@molgenis/vip-report-api/src/Api";
import { Metadata } from "@molgenis/vip-report-vcf/src/Vcf";
import api from "../../Api";
import { Filter, writeVcf } from "@molgenis/vip-report-vcf/src/VcfWriter";

export const RecordDownload: Component<{ recordsMetadata: Metadata; query?: Query; samples?: Sample[] }> = (props) => {
  const filter = (): Filter | undefined =>
    props.samples ? { samples: props.samples.map((sample) => sample.person.individualId) } : undefined;

  function parseFilename(htsFile: HtsFileMetadata) {
    return htsFile.uri.split("\\").pop()?.split("/").pop()?.split(".").shift();
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

  function onClick() {
    const handler = async () => {
      const records = await api.getRecords({ query: props.query, size: Number.MAX_SAFE_INTEGER });
      const vcf = writeVcf({ metadata: props.recordsMetadata, data: records.items.map((item) => item.data) }, filter());

      const url = window.URL.createObjectURL(new Blob([vcf]));
      const link = document.createElement("a");
      link.href = url;
      const htsFile = await api.getHtsFileMetadata();
      const filename = parseFilename(htsFile) as string;
      link.setAttribute("download", filename + "_report_" + getDateTimeString() + ".vcf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    handler().catch((error) => console.error(error));
  }

  return (
    <div class="control">
      <button
        class="button is-info"
        onClick={onClick}
        title="Download vcf file with records matching filters and search queries"
      >
        <span class="icon is-small">
          <i class="fas fa-download" />
        </span>
      </button>
    </div>
  );
};
