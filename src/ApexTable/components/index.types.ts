import { IApexTableColumns, IFocusAxis } from "..";

/**
 * 组件通用类型
 */
export interface ICommonProps {
    allowSelect: boolean;
    children?: React.ReactNode;
    column: IApexTableColumns<any>;
    defaultValue?: string;
    row: any;
    rowIndex: number;
    tableDivRef: React.RefObject<HTMLDivElement>;
    onCellClick: (rowInfo: IFocusAxis) => void;
    onFocus?: (rowInfo: IFocusAxis) => void;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>, row: any, columnName: any) => void;
    onEnter?: () => void;
}