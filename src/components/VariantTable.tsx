import { Component } from "solid-js";
import { Chrom } from "./record/Chrom";
import { Pos } from "./record/Pos";
import { Id } from "./record/Id";
import { Ref } from "./record/Ref";
import { Alt } from "./record/Alt";
import { Qual } from "./record/Qual";
import { Filter } from "./record/Filter";
import { Record } from "../api/vcf/Vcf";

export const VariantTable: Component<{ variant: Record }> = (props) => {
  return (
    <div style="display: grid">
      {/* workaround for https://github.com/jgthms/bulma/issues/2572#issuecomment-523099776 */}
      <div class="table-container">
        <table class="table is-borderless is-narrow">
          <tbody>
            <tr>
              <td>Contig</td>
              <td>
                <Chrom value={props.variant.c} />
              </td>
            </tr>
            <tr>
              <td>Position</td>
              <td>
                <Pos value={props.variant.p} />
              </td>
            </tr>
            {props.variant.i.length > 0 && (
              <tr>
                <td>Identifiers</td>
                <td>
                  <Id value={props.variant.i} />
                </td>
              </tr>
            )}
            <tr>
              <td>Reference allele</td>
              <td>
                <Ref value={props.variant.r} />
              </td>
            </tr>
            <tr>
              <td>Alternate allele(s)</td>
              <td>
                <Alt value={props.variant.a} />
              </td>
            </tr>
            {props.variant.q !== null && (
              <tr>
                <td>Quality</td>
                <td>
                  <Qual value={props.variant.q} />
                </td>
              </tr>
            )}
            {props.variant.f.length > 0 && (
              <tr>
                <td>Filter(s)</td>
                <td>
                  <Filter value={props.variant.f} />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
