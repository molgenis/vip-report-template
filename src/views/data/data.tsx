import { cache } from "@solidjs/router";
import { Item, Sample } from "@molgenis/vip-report-api/src/Api";
import { Record } from "@molgenis/vip-report-vcf/src/Vcf";
import api from "../../Api";

export const getSample = cache(async (id: number): Promise<Item<Sample>> => api.getSampleById(id), "sample");
export const getVariant = cache(async (id: number): Promise<Item<Record>> => api.getRecordById(id), "variant");
