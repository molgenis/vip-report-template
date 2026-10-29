import { describe, expect, test } from "vitest";
import { BoolMultiNode, BoolNode, CategoricalNode, ExistsNode, LeafNode } from "@molgenis/vip-report-api";
import { describeCondition, describeOutcome } from "../../src/utils/decisionTreeOutcome.ts";

describe("decision tree outcome", () => {
  const bool = {
    type: "BOOL",
    label: "filter",
    description: "All filters passed",
    query: { field: "FILTER", operator: "==", value: ["PASS"] },
    outcomeTrue: { nextNode: "artefact", label: "" },
    outcomeFalse: { nextNode: "exit_f", label: "" },
    outcomeMissing: { nextNode: "artefact", label: "" },
  } as BoolNode;

  const categorical = {
    type: "CATEGORICAL",
    label: "vkgl",
    description: "VKGL classification",
    field: "INFO/VKGL",
    outcomeMap: { P: { nextNode: "exit_p", label: "" }, LP: { nextNode: "exit_lp", label: "likely" } },
    outcomeMissing: { nextNode: "filter", label: "" },
    outcomeDefault: { nextNode: "filter", label: "" },
  } as CategoricalNode;

  test("bool condition", () => {
    expect(describeCondition(bool)).toBe("FILTER == [PASS]");
  });

  test("bool outcome", () => {
    expect(describeOutcome(bool, "exit_f")).toBe("False");
  });

  test("bool outcomes sharing a next node", () => {
    expect(describeOutcome(bool, "artefact")).toBe("True or Missing");
  });

  test("categorical outcome with label", () => {
    expect(describeOutcome(categorical, "exit_lp")).toBe("LP (likely)");
  });

  test("categorical missing or default", () => {
    expect(describeOutcome(categorical, "filter")).toBe("Missing or Otherwise");
  });

  test("outcome not leading to the next node", () => {
    expect(describeOutcome(categorical, "unknown")).toBeNull();
  });

  test("exists", () => {
    const exists = {
      type: "EXISTS",
      label: "gene",
      description: "",
      field: "INFO/CSQ/SYMBOL",
      outcomeTrue: { nextNode: "a", label: "" },
      outcomeFalse: { nextNode: "b", label: "" },
    } as ExistsNode;
    expect(describeCondition(exists)).toBe("INFO/CSQ/SYMBOL exists");
    expect(describeOutcome(exists, "b")).toBe("No");
  });

  test("bool multi", () => {
    const multi = {
      type: "BOOL_MULTI",
      label: "spliceai",
      description: "",
      fields: ["INFO/CSQ/SpliceAI_pred_DS_AG", "INFO/CSQ/SpliceAI_pred_DS_AL"],
      outcomes: [{ id: "high", queries: [], operator: "OR", outcomeTrue: { nextNode: "exit_lp", label: "" } }],
      outcomeMissing: { nextNode: "next", label: "" },
      outcomeDefault: { nextNode: "next", label: "" },
    } as unknown as BoolMultiNode;
    expect(describeCondition(multi)).toBe("INFO/CSQ/SpliceAI_pred_DS_AG, INFO/CSQ/SpliceAI_pred_DS_AL");
    expect(describeOutcome(multi, "exit_lp")).toBe("high");
  });

  test("leaf has no condition", () => {
    const leaf = { type: "LEAF", label: "LP", description: "", class: "LP" } as LeafNode;
    expect(describeCondition(leaf)).toBeNull();
  });
});
