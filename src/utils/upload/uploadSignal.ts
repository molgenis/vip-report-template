import { createSignal } from "solid-js";

const [dataVersion, setDataVersion] = createSignal(0);

export const notifyDataChanged = () => {
  setDataVersion((v) => v + 1);
};
export { dataVersion };
