import { Component, onCleanup, onMount } from "solid-js";
import { Record } from "../api/vcf/Vcf";
import igv from "igv";

export const GenomeBrowser: Component<{ variant: Record }> = (props) => {
  let div: HTMLDivElement;
  let browser: unknown;
  onMount(() => {
    (async () => {
      browser = await igv.createBrowser(div, {
        genome: "hg19",
        locus: props.variant.c + ":" + props.variant.p.toString(),
      });
    })().catch((err) => console.log(err));
  });
  onCleanup(() => {
    igv.removeBrowser(browser);
  });
  return <div ref={div} />;
};
