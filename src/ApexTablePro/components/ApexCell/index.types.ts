import { ApexTableColumn } from "../../index.types";

export interface IProps<T> {
    row: T;
    column: ApexTableColumn<T>
}