import { Component, Show } from "solid-js";
import { Anchor } from "../components/Anchor";
import { Loader } from "../components/Loader";
import { Breadcrumb } from "../components/Breadcrumb";
import { VcfHeaderRow } from "../components/VcfHeaderRow";
import { createAsync } from "@solidjs/router";
import { getMetadata } from "./data/data";
import { getHeaderValue } from "../utils/vcf.ts";

export const Help: Component = () => {
  const metadata = createAsync(() => getMetadata());

  return (
    <>
      <Breadcrumb items={[{ text: "Help" }]} />
      <div class="columns">
        <div class="column">
          <p class="title is-3">Documentation</p>
          <span>The documentation for the Variant Interpretation Pipeline is located </span>
          <Anchor href={`https://molgenis.github.io/vip/`}>
            <span>here</span>
          </Anchor>
          <span>.</span>
        </div>
      </div>
      <Show when={metadata()} fallback={<Loader />}>
        {(metadata) => (
          <>
            <p class="title is-3">About</p>
            <div class="columns">
              <div class="column">
                <div class="table-container">
                  <table class="table is-narrow">
                    <thead>
                      <tr>
                        <th colSpan={2}>Software metadata</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>Name:</th>
                        <td>{metadata().app.name}</td>
                      </tr>
                      <tr>
                        <th>Version:</th>
                        <td>{metadata().app.version}</td>
                      </tr>
                      <tr>
                        <th>Arguments:</th>
                        <td>{metadata().app.args}</td>
                      </tr>
                      <VcfHeaderRow value={getHeaderValue(metadata().records, "VIP_Version")} title={"VIP Version"} />
                      <VcfHeaderRow value={getHeaderValue(metadata().records, "VIP_Command")} title={"VIP Command"} />
                    </tbody>
                  </table>
                </div>
                <div class="table-container">
                  <table class="table is-narrow">
                    <thead>
                      <tr>
                        <th colSpan={2}>Input metadata</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th>Filename:</th>
                        <td>{metadata()?.htsFile.uri}</td>
                      </tr>
                      <tr>
                        <th>Assembly:</th>
                        <td>{metadata()?.htsFile.genomeAssembly}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </Show>
    </>
  );
};
