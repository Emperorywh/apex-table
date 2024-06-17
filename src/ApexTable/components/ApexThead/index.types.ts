import { CheckboxChangeEvent } from "antd/es/checkbox/Checkbox";
import { IApexTableColumns } from "apex-table/ApexTable";

export interface IPorps<T> {
    showLineNumber: boolean;
    columns: IApexTableColumns<T>[];
    showHeaderCheckBox: boolean;
    isSingle: boolean;
    headerChecked: boolean;
    indeterminate: boolean;
    onHeaderCheckBoxChange: (event: CheckboxChangeEvent) => void;
}