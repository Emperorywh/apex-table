import { CheckboxChangeEvent } from "antd/es/checkbox/Checkbox";
import { IFocusAxis } from "apex-table/ApexTable/index.types";
import { ITdThCommonProps } from "../index.types";

export interface IProps<T> extends ITdThCommonProps<T> {
    activeDragKey: any;
    dataSourceItem: any;
    allowRowDrag?: boolean;
    startIndex: number;
    endIndex: number;
    rowKey: any;
    totalHeight: number;
    renderCount: number;
    dataSource: any[];
    tableDivRef: React.RefObject<HTMLDivElement>;
    allowRowAddDel?: boolean;
    onRowSelected: (event: CheckboxChangeEvent, row: any) => void;
    onCellClick: (axis: IFocusAxis) => void;
    onChange: (event: React.ChangeEvent<HTMLInputElement>, row: any, columnName: any) => void;
    onFocus: (axis: IFocusAxis) => void;
    onSetRef: (ref: any, refKey: string) => any;
    onEnter?: () => void;
    insertRows: (rowKey: string, dataSource: any[]) => void;
    deleteRow: (rowKey: string) => void
}