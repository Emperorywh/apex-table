import { CheckboxChangeEvent } from "antd/es/checkbox/Checkbox";
import { IApexTableColumns } from "apex-table/ApexTable/index.types";

export interface IProps<T> {
    showLineNumber: boolean;
    columns: IApexTableColumns<T>[];
    allowSelect: boolean;
    showHeaderCheckBox: boolean;
    isSingle: boolean;
    headerChecked: boolean;
    indeterminate: boolean;
    rowHeight: number;
    onHeaderCheckBoxChange: (event: CheckboxChangeEvent) => void;
    onColWidthChange: (column: IApexTableColumns<T>, width: number) => void;
}