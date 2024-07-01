import { IApexTableColumns } from "apex-table/ApexTable/index.types";

export interface IProps<T> {
    rowHeight: number;
    children: React.ReactNode;
    allowFixed: boolean;
    showLineNumber: boolean;
    allowSelect: boolean;
    column: IApexTableColumns<T>;
    columns: IApexTableColumns<T>[];
}
