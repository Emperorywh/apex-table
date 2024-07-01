import { IApexTableColumns } from "apex-table/ApexTable/index.types";
import { ITdThCommonProps } from "../index.types";

export interface IProps<T> extends ITdThCommonProps<T>  {
    onColWidthChange: (column: IApexTableColumns<T>, width: number) => void;
}