import { dec } from "./Ascii85";
import { gunzipSync } from "fflate";

const doc = document;
const textDecoder = new TextDecoder("utf-8");

/**
 * Replace script tag with compressed data with script tag with uncompressed data
 */
function handle(script: HTMLScriptElement): void {
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
      throw `unknown class '${className}'`;
    }
    element.textContent = textDecoded;

    script.replaceWith(element);
  }
}

doc.querySelectorAll("script[type='application/gzip']").forEach((script) => handle(script as HTMLScriptElement));
doc.getElementById("ldr")?.remove();
