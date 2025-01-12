import { ApexTableColumn, ApexTableColumnHideProps } from '../../index.types';
import React from 'react'

export interface IProps<T> {
    row: T & ApexTableColumnHideProps;
    column: ApexTableColumn<T>;
}