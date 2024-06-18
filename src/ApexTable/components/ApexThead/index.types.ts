import { CheckboxChangeEvent } from "antd/es/checkbox/Checkbox";
import { IApexTableColumns } from "apex-table/ApexTable";

export interface IProps<T> {
    showLineNumber: boolean;
    columns: IApexTableColumns<T>[];
    allowSelect: boolean;
    showHeaderCheckBox: boolean;
    isSingle: boolean;
    headerChecked: boolean;
    indeterminate: boolean;
    onHeaderCheckBoxChange: (event: CheckboxChangeEvent) => void;
}