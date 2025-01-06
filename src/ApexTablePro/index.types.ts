import React from 'react'

export interface ApexTableProps<T> {
    /**
     * 表格的列配置
     */
    columns: ApexTableColumns<T>[];
 
}

export interface ApexTableColumns<T> {
    title: string;
    name: keyof T;
    columnType?: ApexColumnType;
}

/**
 * 列类型
 */
export type ApexColumnType = 'input' | 'inputNumber' | 'datePicker' | 'rangePicker' | 'select' | 'modal' | 'customer';

export interface ApexTableRef<T> {
    /**
     * 获取列集合
     */
    getColumns: () => ApexTableColumns<T>[];
}