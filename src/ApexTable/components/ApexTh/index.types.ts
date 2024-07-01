import { IApexTableColumns } from "apex-table/ApexTable/index.types";

export interface IProps<T> {
    column: IApexTableColumns<T>;
    columns: IApexTableColumns<T>[];
    rowHeight: number;
    allowResize: boolean;
    allowFixed: boolean;
    showLineNumber: boolean;
    allowSelect: boolean;
    onColWidthChange: (column: IApexTableColumns<T>, width: number) => void;
}