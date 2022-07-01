import { Component } from "solid-js";
import { Query, Sample } from "@molgenis/vip-report-api/src/Api";
import { Metadata, Record } from "@molgenis/vip-report-vcf/src/Vcf";
import api from "../../Api";
import { Filter, writeVcf } from "@molgenis/vip-report-vcf/src/VcfWriter";
import { getRecordKey } from "../../utils/utils";

export const RecordDownload: Component<{
  recordsMetadata: Metadata;
  query?: Query;
  samples?: Sample[];
  selection?: string[];
}> = (props) => {
  const filter = (): Filter | undefined =>
    props.samples ? { samples: props.samples.map((sample) => sample.person.individualId) } : undefined;

  function recordSelected(record: Record) {
    if (props.selection !== undefined) {
      return props.selection.indexOf(getRecordKey(record)) !== -1;
    }
    return true;
  }

  function onClick() {
    const handler = async () => {
      const records = await api.getRecords({ query: props.query, size: Number.MAX_SAFE_INTEGER });
      const vcf = writeVcf(
        {
          metadata: props.recordsMetadata,
          data: records.items.filter((record) => recordSelected(record.data)).map((item) => item.data),
        },
        filter()
      );

      const url = window.URL.createObjectURL(new Blob([vcf]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "data.vcf");
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
