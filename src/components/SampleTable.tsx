import { Link } from "solid-app-router";
import { Component, For } from "solid-js";
import { Item, Sample } from "../api/Api";

export const SampleTable: Component<{
  samples: Item<Sample>[];
}> = (props) => {
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
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </div>
  );
};
