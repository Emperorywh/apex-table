import { IApexTableColumns } from "apex-table/ApexTable/index.types";

export interface IProps<T> {
    showLineNumber: boolean;
    allowSelect: boolean;
    columns: IApexTableColumns<T>[];
}