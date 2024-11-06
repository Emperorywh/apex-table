import { IApexTableColumns } from 'apex-table/ApexTable/index.types'

export interface IProps<T> {
    columns: IApexTableColumns<T>[];
    id: string;
    onChangeColumn: (column: IApexTableColumns<any>) => void;
}
