import { Component, createEffect, createSignal } from "solid-js";
import { FilterWrapper } from "../FilterWrapper";
import { ButtonApply } from "../../form/ButtonApply";
import { ButtonReset } from "../../form/ButtonReset";
import { ConfigFilterLocus, FilterValueLocus } from "../../../types/configFilterComposed";
import { Select } from "../../form/Select";
import { Input } from "../../form/Input";
import { FilterProps } from "../Filter.tsx";

import { validateInterval } from "../../../utils/utils.ts";

export const FilterLocus: Component<FilterProps<ConfigFilterLocus, FilterValueLocus>> = (props) => {
  const [chromosome, setChromosome] = createSignal<string>();
  const [startPosition, setStartPosition] = createSignal<string>();
  const [endPosition, setEndPosition] = createSignal<string>();
  const [error, setError] = createSignal<string>();

  createEffect(() => {
    if (props.value) {
      setChromosome(props.value.chromosome);
      setStartPosition(props.value.start?.toString());
      setEndPosition(props.value.end?.toString());
    }
  });

  const onApply = () => {
    const chr = chromosome();
    if (chr === undefined) return;
    const startStr = startPosition();
    const endStr = endPosition();
    const validationResult = validateInterval(props.config.id, startStr, endStr);
    if (validationResult !== undefined) {
      setError(validationResult);
    } else {
      setError(undefined);
      const start = startStr !== undefined ? parseInt(startStr) : undefined;
      const end = endStr !== undefined ? parseInt(endStr) : undefined;
      props.onValueChange({ value: { chromosome: chr, start, end } });
    }
  };

  const onReset = () => {
    // filter might not have been applied, so clear local values in addition to generating event
    setChromosome();
    setStartPosition();
    setEndPosition();

    props.onValueClear();
  };

  return (
    <FilterWrapper config={props.config} error={error()}>
      <div class="field is-grouped">
        <div class="control">
          <Select
            placeholder={"Contig"}
            value={chromosome()}
            options={props.config.chromosomes.map((chromosome) => ({ id: chromosome, label: chromosome }))}
            onValueChange={(e) => setChromosome(e.value)}
          />
        </div>
        <div class="control is-expanded">
          <Input placeholder="Start" value={startPosition()} onValueChange={(e) => setStartPosition(e.value)} />
        </div>
        <div class="control is-expanded">
          <Input placeholder="End" value={endPosition()} onValueChange={(e) => setEndPosition(e.value)} />
        </div>
        <div class="control">
          <ButtonApply onClick={onApply} />
        </div>
      </div>
      <ButtonReset onClick={() => onReset()} />
    </FilterWrapper>
  );
};
