import { Component, For } from "solid-js";
import { Allele } from "../Allele";
import { CellValueAlt } from "../../types/configCells";

export const FieldAlt: Component<{ value: CellValueAlt; isAbbreviate?: boolean }> = (props) => {
  const abbreviate = () => (props.isAbbreviate !== undefined ? props.isAbbreviate : true);
  return (
    <>
      <For each={props.value}>
        {(alt, i) => (
          <>
            {i() !== 0 && <span>, </span>}
            <Allele value={alt} isAbbreviate={abbreviate()} />
          </>
        )}
      </For>
    </>
  );
};
