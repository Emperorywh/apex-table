import { ModalFuncProps } from "antd";
import { IApexTableColumns, IFocusAxis } from "apex-table/ApexTable";

export interface IProps {
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
}

export interface IApexModal {
    focus: () => void;
    blur: () => void;
}

export interface ApexModalRef {
    destroy: () => void;
    update: (props: ModalFuncProps) => void;
}