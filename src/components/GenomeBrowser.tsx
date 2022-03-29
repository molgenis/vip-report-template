import { Component, onCleanup, onMount } from "solid-js";
import igv from "igv";
import api from "../Api";
import { fromByteArray } from "base64-js";
import { writeVcf } from "../api/vcf/VcfWriter";
import { ComposedQuery } from "../api/Api";

async function createVcf(contig: string, position: number): Promise<Uint8Array> {
  const query: ComposedQuery = {
    operator: "and",
    args: [
      { selector: "c", operator: "==", args: contig },
      {
        operator: "and",
        args: [
          { selector: "p", operator: ">=", args: position - 250 },
          { selector: "p", operator: "<=", args: position + 250 },
        ],
      },
    ],
  };
  const data = await Promise.all([api.getRecordsMeta(), api.getRecords({ query, size: Number.MAX_SAFE_INTEGER })]);
  const vcf = writeVcf({ metadata: data[0], data: data[1].items.map((item) => item.data) });
  return toBytes(vcf);
}

const toBytes = (str: string): Uint8Array => Uint8Array.from(str.split("").map((letter) => letter.charCodeAt(0)));

const createBrowserConfig = async (contig: string, position: number): Promise<unknown | null> => {
  const data = await Promise.all([api.getFastaGz(contig, position), createVcf(contig, position), api.getGenesGz()]);
  const fastaGz = data[0];
  const vcf = data[1];
  const genesGz = data[2];
  if (fastaGz === null) {
    return null;
  }
  let order = 1;
  const tracks = [];
  if (genesGz) {
    tracks.push({
      order: order++,
      type: "annotation",
      format: "refGene",
      name: "Genes",
      url: "data:application/gzip;base64," + fromByteArray(genesGz),
    });
  }
  tracks.push({
    order: order++,
    type: "variant",
    format: "vcf",
    name: "Variants",
    url: "data:application/octet-stream;base64," + fromByteArray(vcf),
  });
  return {
    reference: {
      id: "reference_unknown",
      name: "Reference",
      fastaURL: "data:application/gzip;base64," + fromByteArray(fastaGz),
      tracks: tracks,
    },
    locus: `${contig}:${position}`,
    showChromosomeWidget: false,
    loadDefaultGenomes: false,
    showCenterGuide: true,
  };
};

export const GenomeBrowser: Component<{ contig: string; position: number }> = (props) => {
  let div: HTMLDivElement;
  let browser: unknown;
  onMount(() => {
    (async () => {
      const config = await createBrowserConfig(props.contig, props.position);
      browser = await igv.createBrowser(div, config);
    })().catch((err) => console.error(err));
  });
  onCleanup(() => {
    igv.removeBrowser(browser);
  });
  return <div ref={div} />;
};
