import { CheckboxChangeEvent } from "antd/es/checkbox/Checkbox";
import { IApexTableColumns, IFocusAxis } from "apex-table/ApexTable";

export interface IPorps<T> {
    columns: IApexTableColumns<T>[];
    dataSource: any[];
    showLineNumber: boolean;
    allowSelect: boolean;
    onRowSelected: (event: CheckboxChangeEvent, row: any) => void;
    onCellClick: (axis: IFocusAxis) => void;
    onChange: (event: React.ChangeEvent<HTMLInputElement>, row: any, columnName: any) => void;
    onFocus: (axis: IFocusAxis) => void;
    onSetRef: (ref: any, refKey: string) => any;
}