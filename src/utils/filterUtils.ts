export function validateIntervalValues(id: string, left: string | undefined, right: string | undefined) {
  if (left !== undefined && left.length !== 0) {
    if (isNaN(Number(left))) {
      return `Input 'from' (${left}) for filter '${id}' should be a number.`;
    }
  }
  if (right != undefined && right.length !== 0) {
    if (isNaN(Number(right))) {
      return `Input 'to' (${right}) for filter '${id}' should be a number.`;
    }
  }
  if (left != undefined && left.length !== 0 && right != undefined && right.length !== 0) {
    if (Number(right) <= Number(left)) {
      return `Input 'to' (${right}) for filter '${id}' should have a higher value than the 'from' input (${left}).`;
    }
  }
}
