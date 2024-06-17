import { IApexTableColumns } from "apex-table/ApexTable";

export interface IPorps<T> {
    showLineNumber: boolean;
    allowSelect: boolean;
    columns: IApexTableColumns<T>[];
}