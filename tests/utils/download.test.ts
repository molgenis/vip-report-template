import { describe, expect, test } from "vitest";
import { HtsFileMetadata } from "@molgenis/vip-report-api";
import { createVcfDownloadFilename } from "../../src/utils/download.ts";

describe("download", () => {
  test("createVcfDownloadFilename with path", () => {
    const metadata = { uri: "/x/y/my.vcf" } as HtsFileMetadata;
    expect(createVcfDownloadFilename(metadata)).toMatch(/^my_report_.*.vcf$/);
  });

  test("createVcfDownloadFilename without path", () => {
    const metadata = { uri: "my.vcf" } as HtsFileMetadata;
    expect(createVcfDownloadFilename(metadata)).toMatch(/^my_report_.*.vcf$/);
  });

  test("createVcfDownloadFilename unknown ", () => {
    const metadata = { uri: "" } as HtsFileMetadata;
    expect(createVcfDownloadFilename(metadata)).toMatch(/^unknown_report_.*.vcf$/);
  });
});
