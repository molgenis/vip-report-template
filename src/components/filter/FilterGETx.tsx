import { Component, For } from "solid-js";
import { Checkbox, CheckboxEvent } from "../Checkbox";
import { FilterProps } from "./Filter";
import { selector, selectorKey } from "../../utils/query";
import { Query } from "@molgenis/vip-report-api/src/Api";
import { useStore } from "../../store";

export type CheckboxGroup = {
  [key: string]: boolean;
};

export type CategoryLabels = {
  [key: string]: string;
};

export const FilterGETx: Component<
  FilterProps & {
    labels?: CategoryLabels;
  }
> = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, actions] = useStore();
  const group: CheckboxGroup = {};
  const gtexSelector = selector(props.field);
  const csqMeta = props.field.parent;
  const label = () => (props.field.label !== undefined ? props.field.label : props.field.id);
  const filteredTissues: string[] = [];
  let selectedTissues: string[] = [];
  const gtexValues = [
    "Adipose_Subcutaneous",
    "Adipose_Visceral",
    "AdrenalGland",
    "Artery_Aorta",
    "Artery_Coronary",
    "Artery_Tibial",
    "Bladder",
    "Brain_Amygdala",
    "Brain_Anteriorcingulatecortex",
    "Brain_Caudate",
    "Brain_CerebellarHemisphere",
    "Brain_Cerebellum",
    "Brain_Cortex",
    "Brain_FrontalCortex",
    "Brain_Hippocampus",
    "Brain_Hypothalamus",
    "Brain_Nucleusaccumbens",
    "Brain_Putamen",
    "Brain_Spinalcord",
    "Brain_Substantianigra",
    "Breast_MammaryTissue",
    "Cells_Culturedfibroblasts",
    "Cells_EBV_transformedlymphocytes",
    "Cervix_Ectocervix",
    "Cervix_Endocervix",
    "Colon_Sigmoid",
    "Colon_Transverse",
    "Esophagus_GastroesophagealJunction",
    "Esophagus_Mucosa",
    "Esophagus_Muscularis",
    "FallopianTube",
    "Heart_AtrialAppendage",
    "Heart_LeftVentricle",
    "Kidney_Cortex",
    "Kidney_Medulla",
    "Liver",
    "Lung",
    "MinorSalivaryGland",
    "Muscle_Skeletal",
    "Nerve_Tibial",
    "Ovary",
    "Pancreas",
    "Pituitary",
    "Prostate",
    "Skin_NotSunExposed",
    "Skin_SunExposed",
    "SmallIntestine_TerminalIleum",
    "Spleen",
    "Stomach",
    "Testis",
    "Thyroid",
    "Uterus",
    "Vagina",
    "WholeBlood",
  ];
  gtexValues.forEach((tissue) => {
    csqMeta?.nested?.items.forEach((meta) => {
      if (meta.id === "GTEx_" + tissue) {
        filteredTissues.push(tissue);
      }
    });
  });

  if (props.query !== undefined) {
    (props.query?.args as string[]).forEach((key) => {
      group[key] = true;
      selectedTissues.push(key);
    });
  }
  const onChange = (event: CheckboxEvent) => {
    let query: Query;
    group[event.value] = event.checked;
    selectedTissues = Object.keys(group)
      .filter((key) => group[key])
      .map((key) => key);
    if (selectedTissues.length > 0) {
      query = {
        selector: gtexSelector,
        operator: "any_has_any",
        args: selectedTissues,
      };
      actions.clearTissues();
      actions.setTissues(selectedTissues);
      props.onChange({
        key: selectorKey(gtexSelector),
        query: query,
      });
    } else {
      actions.clearTissues();
      props.onClear({ key: selectorKey(gtexSelector) });
    }
  };
  return (
    <>
      <p class="has-text-weight-semibold">
        <abbr title={props.field.description}>{label()}</abbr>: <span>{"TPM > 1"}</span>
      </p>
      <div class="field">
        <For each={filteredTissues}>
          {(tissue) => (
            <div class="control">
              <Checkbox
                value={tissue}
                label={tissue.replaceAll("_", " ")}
                checked={selectedTissues && selectedTissues.includes(tissue)}
                onChange={onChange}
              />
            </div>
          )}
        </For>
      </div>
    </>
  );
};
