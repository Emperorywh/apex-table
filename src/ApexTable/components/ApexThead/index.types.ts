import { CheckboxChangeEvent } from "antd/es/checkbox/Checkbox";
import { IApexTableColumns } from "apex-table/ApexTable/index.types";

export interface IProps<T> {
    allowSelect: boolean;
    allowFixed: boolean;
    allowResize: boolean;
    showLineNumber: boolean;
    columns: IApexTableColumns<T>[];
    showHeaderCheckBox: boolean;
    isSingle: boolean;
    headerChecked: boolean;
    indeterminate: boolean;
    rowHeight: number;
    onHeaderCheckBoxChange: (event: CheckboxChangeEvent) => void;
    onColWidthChange: (column: IApexTableColumns<T>, width: number) => void;
}