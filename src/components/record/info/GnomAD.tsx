import { Component, createResource, Show } from "solid-js";
import { Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { FieldValueFloat } from "../field/FieldValueFloat";
import { EMPTY_HTS_FILE_METADATA, fetchHtsFileMetadata } from "../../../utils/ApiUtils";
import { FieldValueInteger } from "../field/FieldValueInteger";

export const GnomAD: Component<{
  id: string;
  variant: Record;
  value: number;
}> = (props) => {
  const [htsFileMetadata] = createResource({}, fetchHtsFileMetadata, { initialValue: EMPTY_HTS_FILE_METADATA });

  function getHref(genomeAssembly: string) {
    return `https://gnomad.broadinstitute.org/variant/${encodeURIComponent(
      [props.variant.c, props.variant.p, props.variant.r, props.variant.a].join("-")
    )}?dataset=${genomeAssembly === "GRCh38" ? "gnomad_r3" : "gnomad_r2_1"}`;
  }

  return (
    <Show when={!htsFileMetadata.loading}>
      <a href={getHref(htsFileMetadata().genomeAssembly)} target="_blank" rel="noopener noreferrer nofollow">
        <Show when={props.id === "GNOMAD_AD"} fallback={<FieldValueFloat value={props.value} />}>
          <FieldValueInteger value={props.value} />
        </Show>
      </a>
    </Show>
  );
};
