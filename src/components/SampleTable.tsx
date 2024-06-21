import { useNavigate, A } from "@solidjs/router";
import { Component, createMemo, For, Show } from "solid-js";
import { Item, Phenotype, PhenotypicFeature, Sample } from "@molgenis/vip-report-api/src/Api";
import { HpoTerm } from "./HpoTerm";
import { Anchor } from "./Anchor";
import {
  getSampleAffectedStatusLabel,
  getSampleFather,
  getSampleLabel,
  getSampleMother,
  getSampleSexLabel,
} from "../utils/sample";

function mapPhenotypes(phenotypes: Item<Phenotype>[]) {
  const phenoMap: { [key: string]: PhenotypicFeature[] } = {};
  phenotypes.forEach((item: Item<Phenotype>) => {
    phenoMap[item.data.subject.id] = item.data.phenotypicFeaturesList;
  });
  return phenoMap;
}

export const SampleTable: Component<{
  samples: Item<Sample>[];
  phenotypes: Item<Phenotype>[];
}> = (props) => {
  const navigate = useNavigate();
  const samples = createMemo(() => props.samples.map((item) => item.data));
  const phenoMap = createMemo(() => mapPhenotypes(props.phenotypes));

  const samplePhenotypes = (sample: Sample): PhenotypicFeature[] => {
    return phenoMap()[sample.person.individualId] ?? [];
  };

  const sampleFatherLabel = (sample: Sample): string => {
    const sampleFather = getSampleFather(sample, samples());
    return sampleFather ? getSampleLabel(sampleFather) : "";
  };

  const sampleMotherLabel = (sample: Sample): string => {
    const sampleMother = getSampleMother(sample, samples());
    return sampleMother ? getSampleLabel(sampleMother) : "";
  };

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
            <For each={props.samples}>
              {(sample) => (
                <tr>
                  <td>{sample.data.person.familyId}</td>
                  <td>
                    <A href={`/samples/${sample.id}`}>{getSampleLabel(sample.data)}</A>
                  </td>
                  <td>{sampleFatherLabel(sample.data)}</td>
                  <td>{sampleMotherLabel(sample.data)}</td>
                  <td>{sample.data.proband === true ? "True" : "False"}</td>
                  <td>{getSampleSexLabel(sample.data)}</td>
                  <td>{getSampleAffectedStatusLabel(sample.data)}</td>
                  <td>
                    <For each={samplePhenotypes(sample.data)}>
                      {(phenotypicFeature: PhenotypicFeature, i) => (
                        <>
                          {i() > 0 ? ", " : ""}
                          <HpoTerm ontologyClass={phenotypicFeature.type} />
                        </>
                      )}
                    </For>
                  </td>
                  <td>
                    <Show when={samplePhenotypes(sample.data).length > 0}>
                      <Anchor
                        href={`https://vibe.molgeniscloud.org/?phenotypes=${samplePhenotypes(sample.data)
                          .map((feature) => feature.type.id)
                          .join(",")}`}
                      >
                        <i class="fas fa-external-link" />
                      </Anchor>
                    </Show>
                  </td>
                  <td>
                    <button class="button is-primary py-1" onClick={() => navigate(`/samples/${sample.id}/variants`)}>
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
