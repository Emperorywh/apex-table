import { CheckboxChangeEvent } from "antd/es/checkbox/Checkbox";
import { IApexTableColumns } from "apex-table/ApexTable/index.types";
import { ITdThCommonProps } from "../index.types";

export interface IProps<T> extends ITdThCommonProps<T> {
    /**
     * 是否开起排序
     */
    allowSort: boolean;
    showColumnConfig?: boolean;
    showHeaderCheckBox: boolean;
    isSingle: boolean;
    headerChecked: boolean;
    indeterminate: boolean;
    originColumns: IApexTableColumns<T>[];
    onHeaderCheckBoxChange: (event: CheckboxChangeEvent) => void;
    onColWidthChange: (column: IApexTableColumns<T>, width: number) => void;
    onChangeColumns: (columns: IApexTableColumns<T>[]) => void;
}