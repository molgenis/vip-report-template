import { Component } from "solid-js";
import { VcfRecord } from "@molgenis/vip-report-vcf";
import { FieldChrom } from "./field/FieldChrom";
import { FieldPos } from "./field/FieldPos";
import { FieldId } from "./field/FieldId";
import { FieldRef } from "./field/FieldRef";
import { FieldAlt } from "./field/FieldAlt";
import { FieldQual } from "./field/FieldQual";
import { FieldFilter } from "./field/FieldFilter";
import { Table } from "./Table.tsx";

export const VariantTable: Component<{ variant: VcfRecord }> = (props) => {
  return (
    <Table>
      <tbody>
        <tr>
          <td>Contig</td>
          <td>
            <FieldChrom value={props.variant.c} />
          </td>
        </tr>
        <tr>
          <td>Position</td>
          <td>
            <FieldPos value={props.variant.p} />
          </td>
        </tr>
        {props.variant.i.length > 0 && (
          <tr>
            <td>Identifiers</td>
            <td>
              <FieldId value={props.variant.i} />
            </td>
          </tr>
        )}
        <tr>
          <td>Reference allele</td>
          <td>
            <FieldRef value={props.variant.r} isAbbreviate={false} />
          </td>
        </tr>
        <tr>
          <td>Alternate allele(s)</td>
          <td>
            <FieldAlt value={props.variant.a} isAbbreviate={false} />
          </td>
        </tr>
        {props.variant.q !== null && (
          <tr>
            <td>Quality</td>
            <td>
              <FieldQual value={props.variant.q} />
            </td>
          </tr>
        )}
        {props.variant.f.length > 0 && (
          <tr>
            <td>Filter(s)</td>
            <td>
              <FieldFilter value={props.variant.f} />
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};
