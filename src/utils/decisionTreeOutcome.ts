import { BoolMultiNode, BoolNode, CategoricalNode, ExistsNode, Node, NodeOutcome } from "@molgenis/vip-report-api";

function formatValue(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(formatValue).join(", ")}]`;
  if (typeof value === "object" && value !== null) return JSON.stringify(value);
  return String(value);
}

// Short text of what a decision node tests, e.g. "CSQ/IMPACT == HIGH".
export function describeCondition(node: Node): string | null {
  switch (node.type) {
    case "BOOL": {
      const query = (node as BoolNode).query;
      return `${query.field} ${query.operator} ${formatValue(query.value)}`;
    }
    case "BOOL_MULTI":
      return (node as BoolMultiNode).fields.join(", ");
    case "CATEGORICAL":
      return (node as CategoricalNode).field;
    case "EXISTS":
      return `${(node as ExistsNode).field} exists`;
    default:
      return null;
  }
}

// The answer(s) of a decision node that lead to the given next node, e.g. "True" or "Missing".
export function describeOutcome(node: Node, nextNodeId: string): string | null {
  const outcomes: [string, NodeOutcome | undefined][] = [];
  switch (node.type) {
    case "BOOL": {
      const bool = node as BoolNode;
      outcomes.push(["True", bool.outcomeTrue], ["False", bool.outcomeFalse], ["Missing", bool.outcomeMissing]);
      break;
    }
    case "BOOL_MULTI": {
      const multi = node as BoolMultiNode;
      multi.outcomes.forEach((query) => outcomes.push([query.id, query.outcomeTrue]));
      outcomes.push(["Missing", multi.outcomeMissing], ["Otherwise", multi.outcomeDefault]);
      break;
    }
    case "CATEGORICAL": {
      const categorical = node as CategoricalNode;
      Object.entries(categorical.outcomeMap).forEach(([value, outcome]) => outcomes.push([value, outcome]));
      outcomes.push(["Missing", categorical.outcomeMissing], ["Otherwise", categorical.outcomeDefault]);
      break;
    }
    case "EXISTS": {
      const exists = node as ExistsNode;
      outcomes.push(["Yes", exists.outcomeTrue], ["No", exists.outcomeFalse]);
      break;
    }
  }
  const labels = outcomes
    .filter(([, outcome]) => outcome?.nextNode === nextNodeId)
    .map(([label, outcome]) => (outcome?.label ? `${label} (${outcome.label})` : label));
  return labels.length > 0 ? labels.join(" or ") : null;
}
