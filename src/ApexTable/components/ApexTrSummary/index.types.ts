import { ITdThCommonProps } from "../index.types";

export interface IProps<T> extends ITdThCommonProps<T> {
    dataSourceItem: any;
    summaryData: any;
}