import { onCleanup, onMount, ParentComponent, createSignal } from "solid-js";
import { A, Location, Navigator, useLocation, useNavigate } from "@solidjs/router";
import { DatasetDropdown } from "./components/DatasetDropdown";
import { fetchSampleProbandIds, isDatasetSupport } from "./utils/api.ts";
import { href } from "./utils/utils.ts";
import { getMetadata, getReportId } from "./views/data/data.tsx";
import { HtsFileMetadata } from "@molgenis/vip-report-api";
import { getNotesApi } from "./api/NotesApiFactory.tsx";
import { createFileApi } from "./api/FileApi.tsx";
import { Upload } from "./components/form/Upload.tsx";

// export for development purposes
export function init(navigate: Navigator, location?: Location) {
  (async () => {
    document.title = `VCF Report (${((await getMetadata()).app.htsFile as HtsFileMetadata).uri})`;
    const sampleIds = await fetchSampleProbandIds();
    if (location === undefined || location.pathname === "/") {
      let components: (string | number)[];
      if (sampleIds.length === 1) {
        components = ["samples", sampleIds[0]!, "variants"];
      } else if (sampleIds.length === 0) {
        components = ["variants"];
      } else {
        components = ["samples"];
      }
      navigate(href(components));
    }
  })();
}

const App: ParentComponent = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const notesApi = getNotesApi();
  const fileApi = createFileApi(notesApi);

  const [reportId, setReportId] = createSignal<string | null>(null);

  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (!notesApi.hasUnsavedData(reportId())) return;

    e.preventDefault();
    e.returnValue = "";
    return "";
  };

  onMount(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);

    (async () => {
      try {
        const id = await getReportId();
        setReportId(id);
      } catch (err) {
        console.error("Failed to get reportId", err);
      }
    })();

    init(navigate, location);
  });

  onCleanup(() => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
  });

  const onNotesDownload = async () => {
    try {
      await fileApi.download(reportId());
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const [triggerUpload, setTriggerUpload] = createSignal<() => void>(() => {});

  const onNotesUpload = () => {
    if (notesApi.hasUnsavedData(reportId())) {
      const proceed = window.confirm(
        "You have unsaved classifications or notes. Loading a new file will discard them.\n\nContinue anyway?",
      );
      if (!proceed) return;
    }
    triggerUpload()();
  };

  return (
    <>
      <nav class="navbar is-fixed-top is-light" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
          <A class="navbar-item has-text-weight-semibold" href="/" end={true}>
            Variant Interpretation Pipeline
          </A>
        </div>
        <div class="navbar-menu">
          <div class="navbar-item has-dropdown is-hoverable">
            <A class="navbar-link" href={"/"} end={true}>
              Report
            </A>
            <div class="navbar-dropdown">
              <A class="navbar-item" href={"/samples"} end={true}>
                Samples
              </A>
              <hr class="navbar-divider" />
              <A class="navbar-item" href={"/variants"} end={true}>
                Variants
              </A>
            </div>
          </div>
          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link" onClick={(e) => e.preventDefault()}>
              Save / Load
            </a>
            <div class="navbar-dropdown">
              <A
                class="navbar-item"
                href={"/"}
                onClick={(e) => {
                  e.preventDefault();
                  onNotesUpload();
                }}
              >
                Load classifications and notes
              </A>
              <hr class="navbar-divider" />
              <A
                class="navbar-item"
                href={"/"}
                onClick={(e) => {
                  e.preventDefault();
                  onNotesDownload();
                }}
              >
                Save classifications and notes
              </A>
            </div>
          </div>
          {isDatasetSupport() && (
            <div class="navbar-start">
              <DatasetDropdown />
            </div>
          )}
          <div class="navbar-end">
            <A class="navbar-item" href={"/help"} end={true}>
              Help
            </A>
          </div>
        </div>
      </nav>
      <div class="container is-fluid">{props.children}</div>
      <Upload reportId={reportId()} ref={(fn) => setTriggerUpload(() => fn)} />
    </>
  );
};

export default App;
