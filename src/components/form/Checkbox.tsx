import { ParentComponent } from "solid-js";

export type CheckboxEvent = {
  value: string;
  checked: boolean;
};

export const Checkbox: ParentComponent<{
  value: string;
  checked?: boolean;
  onChange: (event: CheckboxEvent) => void;
}> = (props) => {
  const onChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    props.onChange({
      value: target.value,
      checked: target.checked,
    });
  };

  return (
    <label class="checkbox">
      <input class="mr-1" type="checkbox" value={props.value} checked={props.checked} onChange={onChange} />
      {props.children}
    </label>
  );
};
