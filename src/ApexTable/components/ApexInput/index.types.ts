import { IApexTableColumns, IFocusAxis } from "apex-table/ApexTable";

export interface IProps {
    children?: React.ReactNode;
    column: IApexTableColumns<any>;
    defaultValue?: string;
    row: any;
    rowIndex: number;
    onCellClick: (rowInfo: IFocusAxis) => void;
    onFocus?: (rowInfo: IFocusAxis) => void;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>, row: any, columnName: any) => void;
}

export interface IApexInput {
    focus: () => void;
    blur: () => void;
}