import { Item, Sample } from "../api/Api";
import api from "../Api";

export async function fetchPedigreeSamples(sample: Item<Sample>): Promise<Sample[]> {
  return (
    await api.getSamples({
      query: {
        operator: "and",
        args: [
          { selector: ["person", "individualId"], operator: "!=", args: sample.data.person.individualId },
          { selector: ["person", "familyId"], operator: "==", args: sample.data.person.familyId },
        ]
      },
      size: Number.MAX_SAFE_INTEGER,
    })
  ).items.map((item) => item.data);
}
