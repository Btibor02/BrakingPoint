export interface IColumns {
  name: string;
  label: string;
  field: string;
  align: "left" | "right" | "center" | undefined;
  sortable: boolean;
}
