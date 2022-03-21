import { dec } from "./Base85";
import { gunzipSync } from "fflate";
import { BinaryReportData } from "../api/ApiClient";
import { EncodedReportData } from "../global";

const doc = document;
const textDecoder = new TextDecoder("utf-8");

/**
 * Replace script tag with compressed data with script tag with uncompressed data
 */
function decodeScript(script: HTMLScriptElement): void {
  const text = script.textContent;
  if (text !== null) {
    const textDecoded = textDecoder.decode(gunzipSync(dec(text)));
    let element: HTMLElement;
    const className = script.className;
    if (className === "ldr-js") {
      element = doc.createElement("script");
    } else if (className === "ldr-css") {
      element = doc.createElement("style");
    } else {
      throw new Error(`unknown class '${className}'`);
    }
    element.textContent = textDecoded;

    script.replaceWith(element);
  }
}

function decodeReportDataObject(encodedObj: { [key: string]: string }): {
  [key: string]: Uint8Array;
} {
  const decodedObj: { [key: string]: Uint8Array } = {};
  for (const [key, value] of Object.entries(encodedObj)) {
    decodedObj[key] = dec(value);
  }
  return decodedObj;
}

/**
 * Replace encoded api base85 data with decoded api binary data.
 */
function decodeReportData(encodedData: EncodedReportData): BinaryReportData {
  const encodedVcfGz = encodedData.vcfGz;
  const reportData: BinaryReportData = {
    vcf: gunzipSync(dec(encodedVcfGz)),
  };

  const encodedFastGz = encodedData.fastaGz;
  if (encodedFastGz) {
    reportData.fastaGz = decodeReportDataObject(encodedFastGz);
  }

  const encodedGenesGz = encodedData.genesGz;
  if (encodedGenesGz) {
    reportData.genesGz = dec(encodedGenesGz);
  }

  const encodedBam = encodedData.bam;
  if (encodedBam) {
    reportData.bam = reportData.fastaGz = decodeReportDataObject(encodedBam);
  }

  const encodedDecisionTreeGz = encodedData.decisionTreeGz;
  if (encodedDecisionTreeGz) {
    reportData.decisionTree = gunzipSync(dec(encodedDecisionTreeGz));
  }
  return reportData;
}

// decode js and css
doc.querySelectorAll("script[type='application/gzip']").forEach((script) => decodeScript(script as HTMLScriptElement));

// decode report data
if (import.meta.env.PROD) {
  const api = window.api;
  if (api.base85) {
    api.binary = decodeReportData(api.base85);
    delete api.base85;
  }
}

// remove loader
doc.getElementById("ldr")?.remove();
