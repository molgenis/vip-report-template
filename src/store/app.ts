import { createStore } from "solid-js/store";
import { AppActions, AppState, AppStore } from "../types/store";

const defaultState: AppState = { variants: {}, sampleVariants: {}, samples: {} };

export function createAppStore(): AppStore {
  const [state, setState] = createStore(defaultState);

  const actions: AppActions = {
    reset() {
      setState(defaultState);
    },
    setSamplePage(page: number) {
      setState({ samples: { ...(state.samples || {}), page } });
    },
    setSampleSearchQuery(searchQuery: string) {
      setState({ samples: { ...(state.samples || {}), searchQuery, page: undefined } });
    },
    setSampleProbandFilterValue(probandFilterValue: boolean) {
      setState({ samples: { ...(state.samples || {}), probandFilterValue, page: undefined } });
    },
  };
  return [state, actions, setState];
}
