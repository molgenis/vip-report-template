import {
  ConfigStaticFieldAlt,
  ConfigStaticFieldChrom,
  ConfigStaticFieldFilter,
  ConfigStaticFieldFixed,
  ConfigStaticFieldId,
  ConfigStaticFieldPos,
  ConfigStaticFieldQual,
  ConfigStaticFieldRef,
} from "../../types/config";
import {
  ConfigFilterAlt,
  ConfigFilterChrom,
  ConfigFilterFilter,
  ConfigFilterFixed,
  ConfigFilterId,
  ConfigFilterPos,
  ConfigFilterQual,
  ConfigFilterRef,
} from "../../types/configFilter";
import { UnexpectedEnumValueException } from "../error.ts";
import { getDescription, getLabel } from "./config.ts";

export function initConfigFilterFixed(configStaticField: ConfigStaticFieldFixed): ConfigFilterFixed {
  let configFilter: ConfigFilterFixed;
  switch (configStaticField.name) {
    case "chrom":
      configFilter = createConfigFilterChrom(configStaticField);
      break;
    case "pos":
      configFilter = createConfigFilterPos(configStaticField);
      break;
    case "id":
      configFilter = createConfigFilterId(configStaticField);
      break;
    case "ref":
      configFilter = createConfigFilterRef(configStaticField);
      break;
    case "alt":
      configFilter = createConfigFilterAlt(configStaticField);
      break;
    case "qual":
      configFilter = createConfigFilterQual(configStaticField);
      break;
    case "filter":
      configFilter = createConfigFilterFilter(configStaticField);
      break;
    default:
      throw new UnexpectedEnumValueException(configStaticField["name"]);
  }
  return configFilter;
}

function createConfigFilterChrom(configStatic: ConfigStaticFieldChrom): ConfigFilterChrom {
  return {
    type: "fixed",
    id: "chrom",
    label: () => getLabel(configStatic, "Chromosome"),
    description: () => getDescription(configStatic),
  };
}

function createConfigFilterPos(configStatic: ConfigStaticFieldPos): ConfigFilterPos {
  return {
    type: "fixed",
    id: "pos",
    label: () => getLabel(configStatic, "Position"),
    description: () => getDescription(configStatic),
  };
}

function createConfigFilterId(configStatic: ConfigStaticFieldId): ConfigFilterId {
  return {
    type: "fixed",
    id: "id",
    label: () => getLabel(configStatic, "Identifiers"),
    description: () => getDescription(configStatic),
  };
}

function createConfigFilterRef(configStatic: ConfigStaticFieldRef): ConfigFilterRef {
  return {
    type: "fixed",
    id: "ref",
    label: () => getLabel(configStatic, "Reference"),
    description: () => getDescription(configStatic),
  };
}

function createConfigFilterAlt(configStatic: ConfigStaticFieldAlt): ConfigFilterAlt {
  return {
    type: "fixed",
    id: "alt",
    label: () => getLabel(configStatic, "Alt"),
    description: () => getDescription(configStatic),
  };
}

function createConfigFilterQual(configStatic: ConfigStaticFieldQual): ConfigFilterQual {
  return {
    type: "fixed",
    id: "qual",
    label: () => getLabel(configStatic, "Quality"),
    description: () => getDescription(configStatic),
  };
}

function createConfigFilterFilter(configStatic: ConfigStaticFieldFilter): ConfigFilterFilter {
  return {
    type: "fixed",
    id: "filter",
    label: () => getLabel(configStatic, "Filter"),
    description: () => getDescription(configStatic),
  };
}
