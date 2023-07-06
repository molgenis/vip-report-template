import { Component } from "solid-js";
import { Filter, FilterProps } from "./Filter";
import { FilterChangeEvent, FilterClearEvent } from "./Filters";
import { ComposedQuery, Query, QueryClause, SelectorPart } from "@molgenis/vip-report-api/src/Api";
import { selectorKey } from "../../utils/query";

export const InfoFilter: Component<FilterProps> = (props) => {
  const label = () => (props.field.label !== undefined ? props.field.label : props.field.id);

  const onChange = (event: FilterChangeEvent) => {
    props.onChange({
      key: selectorKey(["n", event.key]),
      query: updateQuery(event.query),
    });
  };

  function updateQuery(query: Query): QueryClause | ComposedQuery {
    let updatedQuery: QueryClause | ComposedQuery;
    if ((query as QueryClause).selector !== undefined) {
      updatedQuery = {
        ...(query as QueryClause),
        selector: ["n", ...((query as QueryClause).selector as SelectorPart[])],
      };
    } else {
      const queries: (QueryClause | ComposedQuery)[] = [];
      (query as ComposedQuery).args.forEach((subQuery) => queries.push(updateQuery(subQuery)));
      updatedQuery = {
        operator: (query as ComposedQuery).operator,
        args: queries,
      };
    }
    return updatedQuery;
  }

  const onClear = (event: FilterClearEvent) => {
    props.onClear({
      key: selectorKey(["n", event.key]),
    });
  };

  return (
    <>
      <p class="has-text-weight-semibold">
        {props.field.description ? <abbr title={props.field.description}>{label()}</abbr> : <span>{label()}</span>}
      </p>
      <div class="field">
        <Filter field={props.field} query={props.query} onChange={onChange} onClear={onClear} />
      </div>
    </>
  );
};
