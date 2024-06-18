import { IApexTableColumns } from "apex-table/ApexTable";

export interface IProps<T> {
    showLineNumber: boolean;
    allowSelect: boolean;
    columns: IApexTableColumns<T>[];
}