import { Component, createEffect, createSignal } from "solid-js";
import { FilterTypedProps, FilterWrapper } from "../FilterWrapper";
import { ButtonApply } from "../../form/ButtonApply";
import { ButtonReset } from "../../form/ButtonReset";
import { ChromosomeId, FilterValueLocus } from "../../../types/configFilterComposed";
import { Select } from "../../form/Select";
import { Input } from "../../form/Input";

export interface FilterLocusProps extends FilterTypedProps<FilterValueLocus> {
  chromosomes: ChromosomeId[];
}

export const FilterLocus: Component<FilterLocusProps> = (props) => {
  const [chromosome, setChromosome] = createSignal<string>();
  const [startPosition, setStartPosition] = createSignal<string>();
  const [endPosition, setEndPosition] = createSignal<string>();

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
    const start = startStr !== undefined ? parseInt(startStr) : undefined;
    const endStr = endPosition();
    const end = endStr !== undefined ? parseInt(endStr) : undefined;
    props.onValueChange({ value: { chromosome: chr, start, end } });
  };

  const onReset = () => {
    // filter might not have been applied, so clear local values in addition to generating event
    setChromosome();
    setStartPosition();
    setEndPosition();

    props.onValueClear();
  };

  return (
    <FilterWrapper label={props.label}>
      <div class="field is-grouped">
        <div class="control">
          <Select
            placeholder={"Contig"}
            value={chromosome()}
            options={props.chromosomes.map((chromosome) => ({ id: chromosome, label: chromosome }))}
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
