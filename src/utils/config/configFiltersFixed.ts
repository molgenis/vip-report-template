import { ConfigJsonFilterFixed } from "../../types/config";
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

export function initConfigFilterFixed(config: ConfigJsonFilterFixed): ConfigFilterFixed {
  let configFilter: ConfigFilterFixed;
  switch (config.name) {
    case "chrom":
      configFilter = createConfigFilterChrom(config);
      break;
    case "pos":
      configFilter = createConfigFilterPos(config);
      break;
    case "id":
      configFilter = createConfigFilterId(config);
      break;
    case "ref":
      configFilter = createConfigFilterRef(config);
      break;
    case "alt":
      configFilter = createConfigFilterAlt(config);
      break;
    case "qual":
      configFilter = createConfigFilterQual(config);
      break;
    case "filter":
      configFilter = createConfigFilterFilter(config);
      break;
    default:
      throw new UnexpectedEnumValueException(config["name"]);
  }
  return configFilter;
}

function createConfigFilterChrom(config: ConfigJsonFilterFixed): ConfigFilterChrom {
  return {
    type: "fixed",
    id: "chrom",
    label: () => getLabel(config, "Chromosome"),
    description: () => getDescription(config),
  };
}

function createConfigFilterPos(config: ConfigJsonFilterFixed): ConfigFilterPos {
  return {
    type: "fixed",
    id: "pos",
    label: () => getLabel(config, "Position"),
    description: () => getDescription(config),
  };
}

function createConfigFilterId(config: ConfigJsonFilterFixed): ConfigFilterId {
  return {
    type: "fixed",
    id: "id",
    label: () => getLabel(config, "Identifiers"),
    description: () => getDescription(config),
  };
}

function createConfigFilterRef(config: ConfigJsonFilterFixed): ConfigFilterRef {
  return {
    type: "fixed",
    id: "ref",
    label: () => getLabel(config, "Reference"),
    description: () => getDescription(config),
  };
}

function createConfigFilterAlt(config: ConfigJsonFilterFixed): ConfigFilterAlt {
  return {
    type: "fixed",
    id: "alt",
    label: () => getLabel(config, "Alt"),
    description: () => getDescription(config),
  };
}

function createConfigFilterQual(config: ConfigJsonFilterFixed): ConfigFilterQual {
  return {
    type: "fixed",
    id: "qual",
    label: () => getLabel(config, "Quality"),
    description: () => getDescription(config),
  };
}

function createConfigFilterFilter(config: ConfigJsonFilterFixed): ConfigFilterFilter {
  return {
    type: "fixed",
    id: "filter",
    label: () => getLabel(config, "Filter"),
    description: () => getDescription(config),
  };
}
