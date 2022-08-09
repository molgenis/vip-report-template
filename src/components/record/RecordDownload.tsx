import { Component } from "solid-js";
import { HtsFileMetadata, Query, Sample } from "@molgenis/vip-report-api/src/Api";
import { Metadata } from "@molgenis/vip-report-vcf/src/Vcf";
import api from "../../Api";
import { Filter, writeVcf } from "@molgenis/vip-report-vcf/src/VcfWriter";

const DOWNLOAD_POSTFIX = "_report.vcf";
export const RecordDownload: Component<{ recordsMetadata: Metadata; query?: Query; samples?: Sample[] }> = (props) => {
  const filter = (): Filter | undefined =>
    props.samples ? { samples: props.samples.map((sample) => sample.person.individualId) } : undefined;

  function parseFilename(htsFile: HtsFileMetadata) {
    return htsFile.uri.split("\\").pop()?.split("/").pop()?.split(".").shift();
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
      link.setAttribute("download", filename + DOWNLOAD_POSTFIX);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    handler().catch((error) => console.error(error));
  }

  return (
    <div class="control">
      <button class="button is-info" onClick={onClick}>
        <span class="icon is-small">
          <i class="fas fa-download" />
        </span>
      </button>
    </div>
  );
};
