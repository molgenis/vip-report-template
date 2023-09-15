import { Component } from "solid-js";
import { Checkbox, CheckboxEvent } from "../Checkbox";
import { selector, selectorKey } from "../../utils/query";
import { Item, Query, QueryClause, Sample, Selector } from "@molgenis/vip-report-api/src/Api";
import { FieldMetadata } from "@molgenis/vip-report-vcf/src/MetadataParser";
import { FilterChangeEvent, FilterClearEvent } from "./Filters";

export type FilterInheritanceProps = {
  vimField: FieldMetadata;
  vidField: FieldMetadata;
  query?: Query;
  onChange: (event: FilterChangeEvent) => void;
  onClear: (event: FilterClearEvent) => void;
  sample: Item<Sample>;
  key: string;
};
export const FilterInheritance: Component<FilterInheritanceProps> = (props) => {
  const VIM_TRUE = "VIM_true";
  const VIM_MISSING = "VIM_missing";
  const VID = "VID";

  let isVimMissingChecked = false;
  let isVimTrueChecked = false;
  let isVidChecked = false;

  const vimFieldSelector: Selector = ["s", props.sample.data.index, ...selector(props.vimField)];
  const vidFieldSelector: Selector = ["s", props.sample.data.index, ...selector(props.vidField)];

  if (props.query !== undefined) {
    (props.query?.args as QueryClause[]).forEach((query) => {
      const selectorKeyValue = selectorKey(query.selector);
      if (selectorKeyValue === selectorKey(vimFieldSelector) && query.args === 1) {
        isVimTrueChecked = true;
      } else if (
        selectorKeyValue === selectorKey(vimFieldSelector) &&
        (query.args === null || query.args === undefined)
      ) {
        isVimMissingChecked = true;
      } else if (selectorKeyValue === selectorKey(vidFieldSelector) && query.args === 1) {
        isVidChecked = true;
      }
    });
  }
  const onFilterChange = (event: CheckboxEvent) => {
    const queries: QueryClause[] = [];
    if ((event.value === VIM_TRUE && event.checked) || (isVimTrueChecked && event.value !== VIM_TRUE)) {
      queries.push({
        selector: vimFieldSelector,
        operator: "==",
        args: 1,
      });
      isVimTrueChecked = true;
    } else if (isVimTrueChecked && event.value === VIM_TRUE && !event.checked) {
      isVimTrueChecked = false;
    }

    if ((event.value === VIM_MISSING && event.checked) || (isVimMissingChecked && event.value !== VIM_MISSING)) {
      queries.push(
        {
          selector: vimFieldSelector,
          operator: "==",
          args: null,
        },
        {
          selector: vimFieldSelector,
          operator: "==",
          args: undefined,
        },
      );
      isVimMissingChecked = true;
    } else if (isVimMissingChecked && event.value === VIM_MISSING && !event.checked) {
      isVimMissingChecked = false;
    }
    if ((event.value === VID && event.checked) || (isVidChecked && event.value !== VID)) {
      queries.push({
        selector: vidFieldSelector,
        operator: "==",
        args: 1,
      });
      isVidChecked = true;
    } else if (isVidChecked && event.value === VID && !event.checked) {
      isVidChecked = false;
    }
    if (queries.length > 0) {
      props.onChange({
        key: props.key,
        query: {
          operator: "or",
          args: queries,
        },
      });
    } else {
      props.onClear({ key: props.key });
    }
  };

  return (
    <>
      <div class="control">
        <Checkbox
          value={VIM_TRUE}
          label="Match"
          desc="Genotypes, affected statuses and known gene inheritance patterns match (can include de novo variants)."
          checked={isVimTrueChecked}
          onChange={onFilterChange}
        />
      </div>
      <div class="control">
        <Checkbox
          value={VIM_MISSING}
          label="Match: Possible"
          desc="Genotypes, affected statuses match but gene inheritance pattern is unknown (can include de novo variants)."
          checked={isVimMissingChecked}
          onChange={onFilterChange}
        />
      </div>
      <div class="control">
        <Checkbox
          value={VID}
          label="De novo"
          desc="On autosomes:
- Available parents do not have the variant, or genotype is missing.
On the X chromosome:
- Female proband: same as autosomes.
- Male proband: Mother does not have the variant, or mother genotype missing."
          checked={isVidChecked}
          onChange={onFilterChange}
        />
      </div>
    </>
  );
};
