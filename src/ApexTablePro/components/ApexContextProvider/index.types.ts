import React from 'react'
import { ApexTableExtendProps, ApexTableProps } from 'apex-table/ApexTablePro/index.types'

export interface IProps<T> {
    children: React.ReactNode;
    value: ApexTableProps<T> & ApexTableExtendProps<T>
}