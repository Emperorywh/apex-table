import { IApexTableColumns } from "apex-table/ApexTable/index.types";
import { ITdThCommonProps } from "../index.types";

export interface IProps<T> extends ITdThCommonProps<T>  {
    /**
     * 是否开起排序
     */
    allowSort: boolean;
    dragKey: any;
    column: IApexTableColumns<T>;
    onColWidthChange: (column: IApexTableColumns<T>, width: number) => void;
}