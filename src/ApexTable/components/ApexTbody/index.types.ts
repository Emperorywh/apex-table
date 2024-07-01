import { CheckboxChangeEvent } from "antd/es/checkbox/Checkbox";
import { IApexTableColumns, IFocusAxis } from "apex-table/ApexTable/index.types";

export interface IProps<T> {
    startIndex: number;
    endIndex: number;
    rowHeight: number;
    rowKey: any;
    totalHeight: number;
    renderCount: number;
    columns: IApexTableColumns<T>[];
    dataSource: any[];
    showLineNumber: boolean;
    allowSelect: boolean;
    allowFixed: boolean;
    tableDivRef: React.RefObject<HTMLDivElement>;
    onRowSelected: (event: CheckboxChangeEvent, row: any) => void;
    onCellClick: (axis: IFocusAxis) => void;
    onChange: (event: React.ChangeEvent<HTMLInputElement>, row: any, columnName: any) => void;
    onFocus: (axis: IFocusAxis) => void;
    onSetRef: (ref: any, refKey: string) => any;
    onEnter?: () => void;
}