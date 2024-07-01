import { CheckboxChangeEvent } from "antd/es/checkbox/Checkbox";
import { IApexTableColumns } from "apex-table/ApexTable/index.types";
import { ITdThCommonProps } from "../index.types";

export interface IProps<T> extends ITdThCommonProps<T> {
    showHeaderCheckBox: boolean;
    isSingle: boolean;
    headerChecked: boolean;
    indeterminate: boolean;
    onHeaderCheckBoxChange: (event: CheckboxChangeEvent) => void;
    onColWidthChange: (column: IApexTableColumns<T>, width: number) => void;
}