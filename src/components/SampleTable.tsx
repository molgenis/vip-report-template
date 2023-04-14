import { Link } from "@solidjs/router";
import { Component, createMemo, For, Show } from "solid-js";
import { Item, Phenotype, PhenotypicFeature, Sample } from "@molgenis/vip-report-api/src/Api";
import { HpoTerm } from "./HpoTerm";
import { Anchor } from "./Anchor";

function getAffectedStatusLabel(affectedStatus: string) {
  let label;
  switch (affectedStatus) {
    case "AFFECTED":
      label = "Affected";
      break;
    case "UNAFFECTED":
      label = "Unaffected";
      break;
    default:
      label = "?";
      break;
  }
  return label;
}

function getSexLabel(sex: string) {
  let label;
  switch (sex) {
    case "MALE":
      label = "Male";
      break;
    case "FEMALE":
      label = "Female";
      break;
    default:
      label = "?";
      break;
  }
  return label;
}

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
  const phenoMap = createMemo(() => mapPhenotypes(props.phenotypes));

  function getPhenotypes(sampleId: string) {
    return phenoMap()[sampleId] !== undefined ? phenoMap()[sampleId] : [];
  }

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
            </tr>
          </thead>
          <tbody>
            <For each={props.samples}>
              {(sample) => (
                <tr>
                  <td>{sample.data.person.familyId}</td>
                  <td>
                    <Link href={`/samples/${sample.id}`}>{sample.data.person.individualId}</Link>
                  </td>
                  <td>{sample.data.person.paternalId}</td>
                  <td>{sample.data.person.maternalId}</td>
                  <td>{sample.data.proband === true ? "True" : "False"}</td>
                  <td>{getSexLabel(sample.data.person.sex)}</td>
                  <td>{getAffectedStatusLabel(sample.data.person.affectedStatus)}</td>
                  <td>
                    <For each={getPhenotypes(sample.data.person.individualId)}>
                      {(phenotypicFeature: PhenotypicFeature, i) => (
                        <>
                          {i() > 0 ? ", " : ""}
                          <HpoTerm ontologyClass={phenotypicFeature.type} />
                        </>
                      )}
                    </For>
                  </td>
                  <td>
                    <Show when={getPhenotypes(sample.data.person.individualId).length > 0}>
                      <Anchor
                        href={`https://vibe.molgeniscloud.org/?phenotypes=${getPhenotypes(
                          sample.data.person.individualId
                        )
                          .map((feature) => feature.type.id)
                          .join(",")}`}
                      >
                        <i class="fas fa-external-link" />
                      </Anchor>
                    </Show>
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
