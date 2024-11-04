import { IApexTableColumns } from "apex-table/ApexTable/index.types";
import { ITdThCommonProps } from "../index.types";

export interface IProps<T> extends ITdThCommonProps<T> {
    column: IApexTableColumns<T>;
    row: any;
    children: React.ReactNode;
    isValid?: boolean
}
