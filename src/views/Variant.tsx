import { Component, createResource, For, Resource, Show } from "solid-js";
import { Link, useRouteData } from "solid-app-router";
import { Record } from "../api/vcf/Vcf";
import { GenomeBrowser } from "../components/GenomeBrowser";
import { Loader } from "../components/Loader";
import { Chrom } from "../components/record/Chrom";
import { Pos } from "../components/record/Pos";
import { Ref } from "../components/record/Ref";
import { Alt } from "../components/record/Alt";
import { Qual } from "../components/record/Qual";
import { Id } from "../components/record/Id";
import { Filter } from "../components/record/Filter";
import api from "../Api";
import { Value } from "../api/vcf/ValueParser";
import { FieldMetadata } from "../api/vcf/MetadataParser";
import { Info } from "../components/record/Info";

function isNonEmptyNestedInfoItem(nestedInfoField: FieldMetadata, index: number, value: Value[] | Value[][]): boolean {
  const infoField = nestedInfoField.nested?.items[index];

  let empty;
  if (nestedInfoField.number.count === 0 || nestedInfoField.number.count === 1) {
    empty = (value as Value[])[index] === null;
  } else {
    empty = true;
    for (const subValue of value as Value[][]) {
      if (infoField.number.count === 0 || infoField.number.count === 1) {
        if (subValue[index] !== null) {
          empty = false;
          break;
        }
      } else {
        if ((subValue as Value[][])[index].length > 0) {
          empty = false;
          break;
        }
      }
    }
  }
  return !empty;
}

export const Variant: Component = () => {
  const variant: Resource<Record> = useRouteData();

  const [recordsMetadata, recordsMetadataActions] = createResource(async () => await api.getRecordsMeta());
  recordsMetadataActions.mutate();

  return (
    <>
      <Show when={!variant.loading} fallback={<Loader />}>
        <div class="columns is-gapless">
          <div class="column">
            <nav class="breadcrumb">
              <ul>
                <li>
                  <Link href="/">
                    <span class="icon">
                      <i class="fa-solid fa-home" />
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href={"/variants"}>Variants</Link>
                </li>
                <li class="is-active">
                  <a href="#">
                    {variant().c +
                      ":" +
                      variant().p.toString() +
                      " " +
                      variant()
                        .a.map((a) => variant().r + ">" + (a !== null ? a : "."))
                        .join(" / ")}
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        <GenomeBrowser contig={variant().c} position={variant().p} samples={[]} />
      </Show>
      <Show when={!variant.loading && !recordsMetadata.loading} fallback={<Loader />}>
        <div class="columns">
          <div class="column is-3">
            <h1 class="title is-5">Record</h1>
            <table class="table is-borderless is-narrow">
              <tbody>
                <tr>
                  <td>Contig</td>
                  <td>
                    <Chrom value={variant().c} />
                  </td>
                </tr>
                <tr>
                  <td>Position</td>
                  <td>
                    <Pos value={variant().p} />
                  </td>
                </tr>
                {variant().i.length > 0 && (
                  <tr>
                    <td>Identifiers</td>
                    <td>
                      <Id value={variant().i} />
                    </td>
                  </tr>
                )}
                <tr>
                  <td>Reference allele</td>
                  <td>
                    <Ref value={variant().r} />
                  </td>
                </tr>
                <tr>
                  <td>Alternate allele(s)</td>
                  <td>
                    <Alt value={variant().a} />
                  </td>
                </tr>
                {variant().q !== null && (
                  <tr>
                    <td>Quality</td>
                    <td>
                      <Qual value={variant().q} />
                    </td>
                  </tr>
                )}
                {variant().f.length > 0 && (
                  <tr>
                    <td>Filter(s)</td>
                    <td>
                      <Filter value={variant().f} />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div class="column is-3">
            <h1 class="title is-5">Info</h1>
            <table class="table is-borderless is-narrow">
              <tbody>
                <For
                  each={Object.values(recordsMetadata().info).filter(
                    (info) => !info.nested && variant().n[info.id] !== undefined
                  )}
                >
                  {(infoField) => (
                    <tr>
                      <td>{infoField.id}</td>
                      <td>{variant().n[infoField.id] as string}</td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
        </div>

        <For
          each={Object.values(recordsMetadata().info).filter(
            (info) => info.nested && variant().n[info.id] !== undefined
          )}
        >
          {(infoField) => (
            <>
              <h1 class="title is-5">{infoField.id}</h1>
              <p class="mb-4">{infoField.description}</p>
              <div class="table-container">
                <table class="table is-narrow">
                  <thead>
                    <For each={infoField.nested.items}>
                      {(infoFieldItem, i) => (
                        <>
                          {isNonEmptyNestedInfoItem(infoField, i(), variant().n[infoField.id]) && (
                            <th style="writing-mode: vertical-rl">{infoFieldItem.id}</th>
                          )}
                        </>
                      )}
                    </For>
                  </thead>
                  <tbody>
                    <For each={variant().n[infoField.id] as Value[][]}>
                      {(value) => (
                        <>
                          <tr>
                            <For each={infoField.nested.items}>
                              {(infoFieldItem, i) => (
                                <>
                                  {isNonEmptyNestedInfoItem(infoField, i(), variant().n[infoField.id]) && (
                                    <td>
                                      <Info info={value[i()]} infoMetadata={infoFieldItem} />
                                    </td>
                                  )}
                                </>
                              )}
                            </For>
                          </tr>
                        </>
                      )}
                    </For>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </For>
      </Show>
    </>
  );
};
