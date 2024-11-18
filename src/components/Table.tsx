import { ParentComponent } from "solid-js";

export const Table: ParentComponent<{
  borderless?: boolean;
}> = (props) => {
  // workaround for https://github.com/jgthms/bulma/issues/2572#issuecomment-523099776
  return (
    <div style={{ display: "grid" }}>
      <div class="table-container">
        <table classList={{ table: true, "is-narrow": true, "is-borderless": props.borderless }}>
          {props.children}
        </table>
      </div>
    </div>
  );
};
