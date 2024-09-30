import { A, useNavigate } from "@solidjs/router";
import { Component, For, Show } from "solid-js";
import { Item, PhenotypicFeature } from "@molgenis/vip-report-api/src/Api";
import { HpoTerm } from "./HpoTerm";
import { Anchor } from "./Anchor";
import { getSampleAffectedStatusLabel, getSampleLabel, getSampleSexLabel } from "../utils/sample";
import { href } from "../utils/utils.ts";
import { SampleContainer } from "../Api.ts";

export const SampleTable: Component<{
  samples: Item<SampleContainer>[];
}> = (props) => {
  const navigate = useNavigate();

  return (
    <div style={{ display: "grid" }}>
      {/* workaround for https://github.com/jgthms/bulma/issues/2572#issuecomment-523099776 */}
      <div class="table-container">
        <table class="table is-narrow">
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
              <th />
            </tr>
          </thead>
          <tbody>
            <For each={props.samples.map((sample) => sample.data)}>
              {(sample) => (
                <tr>
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
                  <td>
                    <button
                      class="button is-primary py-1"
                      onClick={() => navigate(href(["samples", sample.item.id, "variants"]))}
                    >
                      Explore Variants
                    </button>
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </div>
  );
};
