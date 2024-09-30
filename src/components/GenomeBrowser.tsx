import { Component, onCleanup, onMount } from "solid-js";
import igv, { Browser } from "igv";
import { fromByteArray } from "base64-js";
import { VcfRecord, writeVcf } from "@molgenis/vip-report-vcf";
import { ComposedQuery, Cram, Item, Sample } from "@molgenis/vip-report-api";
import { fetchCram, fetchFastaGz, fetchGenesGz, fetchRecords, MetadataContainer } from "../utils/api.ts";

async function fetchVcf(
  metadata: MetadataContainer,
  contig: string,
  position: number,
  samples: Item<Sample>[],
): Promise<Uint8Array> {
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
  const records = await fetchRecords({ query, size: Number.MAX_SAFE_INTEGER });
  const vcf = writeVcf(
    { metadata: metadata.records, data: records.items.map((item) => item.data) },
    { samples: samples.map((sample) => sample.data.person.individualId) },
  );
  return toBytes(vcf);
}

const toBytes = (str: string): Uint8Array => Uint8Array.from(str.split("").map((letter) => letter.charCodeAt(0)));

const createBrowserConfig = async (
  metadata: MetadataContainer,
  record: Item<VcfRecord>,
  samples: Item<Sample>[],
): Promise<unknown> => {
  const contig = record.data.c;
  const position = record.data.p;

  const data = await Promise.all([
    fetchFastaGz(contig, position),
    fetchVcf(metadata, contig, position, samples),
    fetchGenesGz(),
  ]);
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
      format: "gff3",
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
      id: metadata.htsFile.genomeAssembly,
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

const updateBrowser = async (browser: Browser, samples: Item<Sample>[]): Promise<void> => {
  const data = await Promise.all([...samples.map((sample) => fetchCram(sample.data.person.individualId))]);
  const crams = data.slice(0);

  for (let i = 0; i < samples.length; ++i) {
    const cram = crams[i] as Cram | null;

    if (cram !== null) {
      const sampleId = samples[i]!.data.person.individualId;
      await browser.loadTrack({
        type: "alignment",
        format: "cram",
        name: `Alignment (${sampleId})`,
        url: "data:application/octet-stream;base64," + fromByteArray(cram.cram),
        indexURL: "data:application/octet-stream;base64," + fromByteArray(cram.crai),
        checkSequenceMD5: false, //  disable verifying the MD5 checksum of the reference sequence underlying a slice
        colorBy: "strand",
      });
    }
  }
};

export const GenomeBrowser: Component<{
  metadata: MetadataContainer;
  record: Item<VcfRecord>;
  samples: Item<Sample>[];
}> = (props) => {
  let divRef: HTMLDivElement;
  let browser: Browser;
  onMount(() => {
    (async () => {
      const config = await createBrowserConfig(props.metadata, props.record, props.samples);
      if (config !== null) {
        browser = await igv.createBrowser(divRef, config);
        await updateBrowser(browser, props.samples);
      }
    })().catch((err) => console.error(err));
  });
  onCleanup(() => {
    if (browser) {
      igv.removeBrowser(browser);
    }
  });
  // noinspection JSUnusedAssignment
  return <div ref={divRef!} />;
};
