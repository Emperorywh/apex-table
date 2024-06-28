import { IApexTableColumns, IFocusAxis } from "../index.types";

/**
 * 表格组件通用类型
 */
export interface ICommonProps {
    allowSelect: boolean;
    children?: React.ReactNode;
    column: IApexTableColumns<any>;
    defaultValue?: string;
    row: any;
    rowIndex: number;
    rowHeight: number;
    tableDivRef: React.RefObject<HTMLDivElement>;
    onCellClick: (rowInfo: IFocusAxis) => void;
    onFocus?: (rowInfo: IFocusAxis) => void;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    onChange?: (row: any, columnName: any, value: any) => void;
    onEnter?: () => void;
}

/**
 * 表格组件向外暴露的组件方法
 */
export interface IComponentsRef {
    focus: () => void;
    blur: () => void;
}