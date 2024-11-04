import { IApexTableCellInfo, IApexTableCellValid } from 'apex-table/ApexTable/index.types'

export interface IuseCellValidationType {
    rules?: IApexTableCellValid;
    rowInfo: IApexTableCellInfo;
    isFocus: boolean;
}