import { Component, createMemo, createSignal, For, Signal } from "solid-js";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { HtsFileMetadata, Item } from "@molgenis/vip-report-api/src/Api";
import { ValueArray } from "@molgenis/vip-report-vcf/src/ValueParser";
import { Info } from "./record/Info";
import { FieldValue } from "./record/field/Field";
import { isCsqInfo } from "../utils/csqUtils";
import { Link, useLocation } from "solid-app-router";

export const InfoCollapsablePane: Component<{
  fields: FieldMetadata[];
  record: Item<Record>;
  htsFileMeta: HtsFileMetadata;
  isPossibleCompound?: boolean;
}> = (props) => {
  const [collapsed, setCollapsed]: Signal<boolean> = createSignal(false);

  function toggleCollapse() {
    setCollapsed(!collapsed());
  }

  const values = createMemo((): FieldValue[][] =>
    props.fields.map((field) => {
      if (field.parent) {
        const values = (props.record.data.n[field.parent.id] || []) as ValueArray;
        return values.map((nestedValues) => {
          const value =
            field.parent && field.parent.nested
              ? (nestedValues as ValueArray)[
                  field.parent.nested.items.findIndex((nestedField) => nestedField.id === field.id)
                ]
              : null;
          return {
            record: props.record,
            value: value,
            valueParent: nestedValues,
          };
        });
      }
      throw new Error(`Nested field '${field.id}' needs to have a parent field.`);
    })
  );
  return (
    <>
      <td>
        {values().length > 0 && values()[0].length > 1 && (
          <span class="icon is-left is-clickable" onClick={toggleCollapse}>
            {collapsed() ? <i class="fas fa-angle-up" /> : <i class="fas fa-angle-down" />}
          </span>
        )}
      </td>
      <For each={props.fields}>
        {(field, i) => (
          <td>
            <For each={values()[i()]}>
              {(value, j) => (
                <>
                  {j() != 0 && collapsed() && <br />}
                  {(j() == 0 || collapsed()) &&
                    (isCsqInfo(field, "Consequence") ? (
                      <Link href={`${useLocation().pathname}/${props.record.id}/consequences/${j()}`}>
                        <Info
                          info={value}
                          infoMeta={field}
                          context={{
                            genomeAssembly: props.htsFileMeta.genomeAssembly,
                            isPossibleCompound: props.isPossibleCompound,
                          }}
                        />
                      </Link>
                    ) : (
                      <Info
                        info={value}
                        infoMeta={field}
                        context={{
                          genomeAssembly: props.htsFileMeta.genomeAssembly,
                          isPossibleCompound: props.isPossibleCompound,
                        }}
                      />
                    ))}
                </>
              )}
            </For>
          </td>
        )}
      </For>
    </>
  );
};
