import { ApexTableColumn } from "../../index.types";
import React from 'react'

export interface IProps<T> {
    row: T;
    column: ApexTableColumn<T>
    onClick?: React.MouseEventHandler<HTMLDivElement>
}