import { ApexTableColumnHideProps } from 'apex-table/ApexTablePro/index.types'

export interface IProps<T> {
    row: T & ApexTableColumnHideProps
}