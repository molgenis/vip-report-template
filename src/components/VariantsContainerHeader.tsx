import { Component, Show } from "solid-js";
import { getSampleAffectedStatusLabel, getSampleContainerLabel, getSampleSexLabel } from "../utils/sample";
import { SampleContainer } from "../Api.ts";

export const VariantsContainerHeader: Component<{
  sample: SampleContainer | null;
}> = (props) => {
  function getTitleSampleSexLabel(sample: SampleContainer): string {
    const label = getSampleSexLabel(sample.item.data);
    return label !== "?" ? label : "sex:?";
  }

  function getTitleAffectedStatusLabel(sample: SampleContainer): string {
    const label = getSampleAffectedStatusLabel(sample.item.data);
    return label !== "?" ? label : "affected status:?";
  }

  const title = (): string => {
    let title: string;
    if (props.sample) {
      title = `Reported variants for ${getSampleContainerLabel(props.sample)} (${getTitleSampleSexLabel(props.sample)} ${getTitleAffectedStatusLabel(props.sample)})`;
    } else {
      title = "Reported variants";
    }
    return title;
  };

  const subtitle = (): string | null => {
    let subtitle: string | null;
    if (props.sample) {
      const sampleFather = props.sample.paternalSample;
      const sampleMother = props.sample.maternalSample;
      const sampleOtherFamilyMembers = props.sample.otherPedigreeSamples;

      if (!(sampleFather === undefined && sampleMother === undefined && sampleOtherFamilyMembers.length === 0)) {
        const tokens: string[] = [];
        if (sampleMother !== null) {
          tokens.push(`mother (${getTitleAffectedStatusLabel(sampleMother)})`);
        }
        if (sampleFather !== null) {
          tokens.push(`father (${getTitleAffectedStatusLabel(sampleFather)})`);
        }

        for (const familyMember of sampleOtherFamilyMembers) {
          tokens.push(
            `${getSampleContainerLabel(familyMember)} (${getTitleSampleSexLabel(familyMember)} ${getTitleAffectedStatusLabel(familyMember)})`,
          );
        }

        let str = tokens.pop() as string;
        if (tokens.length > 0) str = `${tokens.join(", ")} and ${str}`;
        subtitle = `Includes genotypes for ${str}`;
      } else {
        subtitle = null;
      }
    } else {
      subtitle = "Includes all reported variants without genotypes";
    }
    return subtitle;
  };

  return (
    <>
      <p class="title is-3">{title()}</p>
      <Show when={subtitle()}>{(subtitle) => <p class="subtitle is-5">{subtitle()}</p>}</Show>
    </>
  );
};
