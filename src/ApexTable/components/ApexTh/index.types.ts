import { IApexTableColumns } from "apex-table/ApexTable/index.types";

export interface IProps<T> {
    column: IApexTableColumns<T>;
    rowHeight: number;
    onColWidthChange: (column: IApexTableColumns<T>, width: number) => void;
}