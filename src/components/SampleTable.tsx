import { Link } from "solid-app-router";
import { Component, For, Show } from "solid-js";
import { Item, Phenotype, PhenotypicFeature, Sample } from "@molgenis/vip-report-api/src/Api";
import { HpoTerm } from "./record/info/HpoTerm";

function getAffectedStatusLabel(affectedStatus: string) {
  let label = "";
  switch (affectedStatus) {
    case "AFFECTED":
      label = "Affected";
      break;
    case "UNAFFECTED":
      label = "Unaffected";
      break;
    default:
      label = "?";
  }
  return label;
}

function getSexLabel(sex: string) {
  let label = "";
  switch (sex) {
    case "MALE":
      label = "Male";
      break;
    case "FEMALE":
      label = "Female";
      break;
    default:
      label = "?";
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
  const phenoMap = mapPhenotypes(props.phenotypes);

  function getPhenotypes(sampleId: string) {
    return phenoMap[sampleId] !== undefined ? phenoMap[sampleId] : [];
  }

  return (
    <div style="display: grid">
      {/* workaround for https://github.com/jgthms/bulma/issues/2572#issuecomment-523099776 */}
      <div class="table-container">
        <table class="table is-narrow">
          <thead>
            <tr>
              <th>familyId</th>
              <th>individualId</th>
              <th>paternalId</th>
              <th>maternalId</th>
              <th>proband</th>
              <th>sex</th>
              <th>affected</th>
              <th>phenotypes</th>
              <th>VIBE</th>
            </tr>
          </thead>
          <tbody>
            <For each={props.samples}>
              {(sample) => (
                <tr>
                  <td>{sample.id}</td>
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
                      <Link
                        href={`https://vibe.molgeniscloud.org/?phenotypes=${getPhenotypes(
                          sample.data.person.individualId
                        )
                          .map((feature) => feature.type.id)
                          .join(",")}`}
                      >
                        <i class="fa-solid fa-external-link" />
                      </Link>
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
