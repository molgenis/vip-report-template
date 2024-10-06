import { Component, createMemo, createSignal, onMount, Show } from "solid-js";
import { PagedItems, Sample } from "@molgenis/vip-report-api/src/Api";
import { Loader } from "./Loader";
import { SortChangeCallback, SortClearCallback } from "./Sort";
import { PageChangeCallback, Pager } from "./record/Pager";
import { RecordsTable } from "./RecordsTable";
import {
  getSampleAffectedStatusLabel,
  getSampleFamilyMembersWithoutParents,
  getSampleFather,
  getSampleLabel,
  getSampleMother,
  getSampleSexLabel,
  SampleContainer,
} from "../utils/sample";
import { RecordsPerPage, RecordsPerPageChangeCallback } from "./RecordsPerPage";
import { Record } from "@molgenis/vip-report-vcf/src/Vcf";
import { ButtonDownload } from "./ButtonDownload";
import { MetadataContainer } from "../utils/ApiUtils";
import { ConfigFields } from "../types/config";

export type RecordsDownloadCallback = () => void;

export const SampleRecordsResults: Component<{
  metadata: MetadataContainer;
  sample: SampleContainer;
  fieldConfigs: ConfigFields;
  records: PagedItems<Record>;
  onRecordsPerPageChange: RecordsPerPageChangeCallback;
  onRecordsDownload: RecordsDownloadCallback;
  onPageChange: PageChangeCallback;
  onSortChange: SortChangeCallback;
  onSortClear: SortClearCallback;
}> = (props) => {
  const samples = createMemo(() => [
    props.sample.item.data,
    ...props.sample.otherPedigreeSamples.map((pedigreeSample) => pedigreeSample.item.data),
  ]);

  const [proband, setProband] = createSignal<Sample>();
  const [father, setFather] = createSignal<Sample>();
  const [mother, setMother] = createSignal<Sample>();
  const [otherFamilyMembers, setOtherFamilyMembers] = createSignal<Sample[]>([]);

  onMount(() => {
    setProband(props.sample.item.data);
    setMother(getSampleMother(proband() as Sample, samples()));
    setFather(getSampleFather(proband() as Sample, samples()));
    setOtherFamilyMembers(getSampleFamilyMembersWithoutParents(proband() as Sample, samples()));
  });

  function getTitleSampleSexLabel(sample: Sample): string {
    const label = getSampleSexLabel(sample);
    return label !== "?" ? label : "sex:?";
  }

  function getTitleAffectedStatusLabel(sample: Sample): string {
    const label = getSampleAffectedStatusLabel(sample);
    return label !== "?" ? label : "affected status:?";
  }

  const title = (): string => {
    return `Reported variants for ${getSampleLabel(props.sample.item.data)} (${getTitleSampleSexLabel(props.sample.item.data)} ${getTitleAffectedStatusLabel(props.sample.item.data)})`;
  };

  const subtitle = (): string | undefined => {
    const sampleFather = father();
    const sampleMother = mother();
    const sampleOtherFamilyMembers = otherFamilyMembers();

    if (sampleFather === undefined && sampleMother === undefined && sampleOtherFamilyMembers.length === 0) {
      return undefined;
    }

    const tokens: string[] = [];
    if (sampleMother !== undefined) {
      tokens.push(`mother (${getTitleAffectedStatusLabel(sampleMother)})`);
    }
    if (sampleFather !== undefined) {
      tokens.push(`father (${getTitleAffectedStatusLabel(sampleFather)})`);
    }

    for (const familyMember of sampleOtherFamilyMembers) {
      tokens.push(
        `${getSampleLabel(familyMember)} (${getTitleSampleSexLabel(familyMember)} ${getTitleAffectedStatusLabel(familyMember)})`,
      );
    }

    let str = tokens.pop() as string;
    if (tokens.length > 0) str = `${tokens.join(", ")} and ${str}`;
    return `Includes genotypes for ${str}`;
  };

  return (
    <>
      <div class="columns is-gapless">
        <div class="column">
          <p class="title is-3">{title()}</p>
          <Show when={subtitle()} keyed>
            {(subtitle) => <p class="subtitle is-5">{subtitle}</p>}
          </Show>
        </div>
      </div>
      <div class="columns is-gapless">
        <div class="column is-offset-1-fullhd is-3-fullhd is-4">
          <Show when={props.records} fallback={<Loader />} keyed>
            {(records) => (
              <span class="is-pulled-left inline-control-text ml-2">{records.page.totalElements} records</span>
            )}
          </Show>
        </div>
        <div class="column is-4">
          <Show when={props.records} fallback={<Loader />} keyed>
            {(records) => <Pager page={records.page} onPageChange={props.onPageChange} />}
          </Show>
        </div>
        <div class="column">
          <div class="field is-grouped is-grouped-right">
            {/* FIXME */}
            {/*{infoFields().length > 0 && (*/}
            {/*  <Sort options={sortOptions()} onChange={props.onSortChange} onClear={props.onSortClear} />*/}
            {/*)}*/}
            <div class="control">
              <ButtonDownload
                title="Download vcf file with records matching filters and search queries"
                onClick={props.onRecordsDownload}
              />
            </div>
          </div>
        </div>
      </div>
      <div class="columns is-gapless">
        <div class="column is-full">
          <Show when={props.records} fallback={<Loader />} keyed>
            {(records) => (
              <>
                <RecordsTable fieldConfigs={props.fieldConfigs} records={records.items} />
                <div class="columns is-gapless">
                  <div class="column">
                    <div class="field is-grouped is-grouped-right">
                      <RecordsPerPage initialValue={records.page.size} onChange={props.onRecordsPerPageChange} />
                    </div>
                  </div>
                </div>
              </>
            )}
          </Show>
        </div>
      </div>
    </>
  );
};
