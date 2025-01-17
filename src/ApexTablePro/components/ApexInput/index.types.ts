import { ApexTableColumn } from 'apex-table/ApexTablePro/index.types'

export interface IProps<T> {
    row: T;
    column: ApexTableColumn<T>
}