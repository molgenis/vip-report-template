import { Component, onCleanup, onMount } from "solid-js";
import igv, { Browser } from "igv";
import api from "../Api";
import { fromByteArray } from "base64-js";
import { writeVcf } from "@molgenis/vip-report-vcf/src/VcfWriter";
import { ComposedQuery, Sample } from "../../../vip-report-api/src/Api";

async function createVcf(contig: string, position: number, samples: Sample[]): Promise<Uint8Array> {
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
  const vcf = writeVcf(
    { metadata: data[0], data: data[1].items.map((item) => item.data) },
    { samples: samples.map((sample) => sample.person.individualId) },
  );
  return toBytes(vcf);
}

const toBytes = (str: string): Uint8Array => Uint8Array.from(str.split("").map((letter) => letter.charCodeAt(0)));

const createBrowserConfig = async (contig: string, position: number, samples: Sample[]): Promise<unknown> => {
  const data = await Promise.all([
    api.getFastaGz(contig, position),
    createVcf(contig, position, samples),
    api.getGenesGz(),
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

  const htsFileMetadata = await api.getHtsFileMetadata();

  return {
    reference: {
      id: htsFileMetadata.genomeAssembly,
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

const updateBrowser = async (browser: Browser, samples: Sample[]): Promise<void> => {
  const cramData = await Promise.all([...samples.map((sample) => api.getCram(sample.person.individualId))]);
  const crams = cramData.slice(0);

  const bedmethylData = await Promise.all([...samples.map((sample) => api.getBedmethyl(sample.person.individualId))]);
  const bedmethyls = bedmethylData.slice(0);

  for (let i = 0; i < samples.length; ++i) {
    const cram = crams[i];
    const bedmethyl = bedmethyls[i];

    if (bedmethyl !== null) {
      const sampleId = samples[i].person.individualId;
      await browser.loadTrack({
        type: "annotation",
        format: "bedMethyl",
        name: `Bedmethyl (${sampleId})`,
        url: "data:application/octet-stream;base64," + fromByteArray(bedmethyl),
        checkSequenceMD5: false,
      });
    }

    if (cram !== null) {
      const sampleId = samples[i].person.individualId;
      await browser.loadTrack({
        type: "alignment",
        format: "cram",
        name: `Alignment (${sampleId})`,
        url: "data:application/octet-stream;base64," + fromByteArray(cram.cram),
        indexURL: "data:application/octet-stream;base64," + fromByteArray(cram.crai),
        checkSequenceMD5: false, //  disable verifying the MD5 checksum of the reference sequence underlying a slice
        colorBy: "basemod2",
      });
    }
  }
};

export const GenomeBrowser: Component<{ contig: string; position: number; samples: Sample[] }> = (props) => {
  let divRef: HTMLDivElement;
  let browser: Browser;
  onMount(() => {
    (async () => {
      const config = await createBrowserConfig(props.contig, props.position, props.samples);
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
  return <div ref={divRef!} />;
};
