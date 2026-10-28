import { A, useNavigate } from "@solidjs/router";
import { Component, For, Show } from "solid-js";
import { Item, PhenotypicFeature } from "@molgenis/vip-report-api";
import { HpoTerm } from "./HpoTerm";
import { Anchor } from "./Anchor";
import { getSampleAffectedStatusLabel, getSampleLabel, getSampleSexLabel } from "../utils/sample";
import { href } from "../utils/utils.ts";
import { SampleContainer } from "../utils/api.ts";
import { Table } from "./Table.tsx";

export const SampleTable: Component<{
  samples: Item<SampleContainer>[];
}> = (props) => {
  const navigate = useNavigate();

  return (
    <Table>
      <thead>
        <tr>
          <th>Family</th>
          <th>Individual</th>
          <th>Father</th>
          <th>Mother</th>
          <th>Proband</th>
          <th>Sex</th>
          <th>Affected</th>
          <th>Phenotypes</th>
          <th>VIBE</th>
          <th>
            <span class="is-sr-only">Variants</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <For each={props.samples.map((sample) => sample.data)}>
          {(sample) => {
            const variantsHref = () => href(["samples", sample.item.id, "variants"]);
            return (
              <tr
                class="is-clickable-row"
                tabIndex={0}
                title={`Explore variants of ${getSampleLabel(sample.item)}`}
                onClick={(event) => {
                  // links in the row (sample, phenotypes, VIBE) keep their own target
                  if ((event.target as HTMLElement).closest("a")) return;
                  navigate(variantsHref());
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && event.target === event.currentTarget) navigate(variantsHref());
                }}
              >
                <td>{sample.item.data.person.familyId}</td>
                <td>
                  <A href={href(["samples", sample.item.id])} end={true}>
                    {getSampleLabel(sample.item)}
                  </A>
                </td>
                <td>{sample.paternalSample ? getSampleLabel(sample.paternalSample) : ""}</td>
                <td>{sample.maternalSample ? getSampleLabel(sample.maternalSample) : ""}</td>
                <td>{sample.item.data.proband ? "True" : "False"}</td>
                <td>{getSampleSexLabel(sample.item)}</td>
                <td>{getSampleAffectedStatusLabel(sample.item)}</td>
                <td>
                  <For each={sample.phenotypes}>
                    {(phenotypicFeature: PhenotypicFeature, i) => (
                      <>
                        {i() > 0 ? ", " : ""}
                        <HpoTerm ontologyClass={phenotypicFeature.type} />
                      </>
                    )}
                  </For>
                </td>
                <td>
                  <Show when={sample.phenotypes.length > 0}>
                    <Anchor
                      href={`https://vibe.molgeniscloud.org/?phenotypes=${sample.phenotypes
                        .map((feature) => feature.type.id)
                        .join(",")}`}
                    >
                      <i class="fas fa-external-link" />
                    </Anchor>
                  </Show>
                </td>
                <td class="row-action">
                  <A href={variantsHref()}>
                    Variants <span class="chevron" />
                  </A>
                </td>
              </tr>
            );
          }}
        </For>
      </tbody>
    </Table>
  );
};
