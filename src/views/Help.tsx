import { Component, For, Show } from "solid-js";
import { Anchor } from "../components/Anchor";
import { Loader } from "../components/Loader";
import { Breadcrumb } from "../components/Breadcrumb";
import { VcfHeaderRow } from "../components/VcfHeaderRow";
import { createAsync } from "@solidjs/router";
import { getConfig, getMetadata } from "./data/data";
import { getHeaderValue } from "../utils/vcf.ts";
import { Table } from "../components/Table.tsx";
import { ConfigStatic } from "../types/config";
import { Json } from "@molgenis/vip-report-api";

export const Help: Component = () => {
  const metadata = createAsync(() => getMetadata());
  const config = createAsync(() => getConfig());

  function createParamList(config: ConfigStatic) {
    const stack: { path: string[]; values: { [property: string]: Json } }[] = [{ path: [], values: config.vip.params }];

    const paramList: [key: string, value: string][] = [];
    while (stack.length !== 0) {
      const params = stack.pop()!;
      const values = params.values;
      for (const key in values) {
        const path = [...params.path, key];
        const value = values[key]!;
        // derived from https://stackoverflow.com/a/8511350
        if (typeof value === "object" && !Array.isArray(value) && value !== null) {
          stack.push({ path, values: value as { [property: string]: Json } });
        } else {
          paramList.push([path.join("."), String(value)]);
        }
      }
    }

    return paramList.sort((keyA, keyB) => keyA[0].localeCompare(keyB[0]));
  }

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
                <Table>
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
                </Table>
              </div>
            </div>
            <div class="columns">
              <div class="column">
                <Table>
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
                </Table>
              </div>
            </div>
          </>
        )}
      </Show>
      <Show when={config()} fallback={<Loader />}>
        {(config) => (
          <>
            <p class="title is-3">Configuration</p>
            <p class="subtitle is-5">Listing of all VIP parameters used in the process to create this report</p>
            <div class="columns">
              <div class="column">
                <Table>
                  <tbody>
                    <For each={createParamList(config())}>
                      {([key, value]) => (
                        <tr>
                          <th>{key}</th>
                          <td>{value}</td>
                        </tr>
                      )}
                    </For>
                  </tbody>
                </Table>
              </div>
            </div>
          </>
        )}
      </Show>
    </>
  );
};
