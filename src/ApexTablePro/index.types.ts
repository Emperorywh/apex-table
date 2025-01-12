/**
 * 表格
 */
import React, { ReactNode } from 'react'
import { PaginationProps } from 'antd'

export interface ApexTableProps<T> {
    /**
     * 表格实例
     */
    ref?: React.Ref<ApexTableRef<T>>;
    
    /**
     * 高度
     */
    height?: number;
    
    /**
     * 是否允许勾选
     */
    allowSelect?: boolean;
    
    /**
     * 表格的列配置
     */
    columns: ApexTableColumn<T>[];
    
    /**
     * 表格数据源(静态)
     */
    dataSource?: (T & ApexTableColumnHideProps)[];
    
    /**
     * 是否展示表头复选框
     */
    showHeaderCheckBox?: boolean
    
    /**
     * 表格标题
     */
    tableTitle?: ReactNode;
    
    /**
     * 是否展示分页
     */
    showPagination?: boolean;
    
    /**
     * 分页配置
     */
    pagination?: PaginationProps;
    
    /**
     * 是否只读，开启后不能进行编辑，列也有此属性，先以列为准
     */
    readOnly?: boolean;
    
    /**
     * 是否单选
     */
    isSingle?: boolean;
    
    /**
     * 是否开起固定
     */
    allowFixed?: boolean;
    
    /**
     * 是否开起列宽调整
     */
    allowResize?: boolean;
    
    /**
     * 是否开起行拖动
     */
    allowRowDrag?: boolean;
    
    /**
     * 是否开起列拖动
     */
    allowColumnDrag?: boolean;
    
    /**
     * 是否开起排序
     */
    allowSort?: boolean;
    
    /**
     * 是否展示行号
     */
    showLineNumber?: boolean;
    
    /**
     * 是否开起 列配置
     */
    showColumnConfig?: boolean;
    
    /**
     * 是否展示 合计行
     */
    showSummary?: boolean;
    
    /**
     * 是否支持点击行勾选
     */
    selectByRowClick?: boolean;
    
    /**
     * 唯一行号字段名
     */
    rowKey: string;
    
    /**
     * 行高
     */
    rowHeight: number;
    
    /**
     * 是否开起行图标删除增加功能
     */
    allowRowAddDel?: boolean;
    
    /**
     * 获取 dataSource 的方法
     * @param params
     * @returns
     */
    request?: (params?: { pageSize: number, currentPage: number, args?: any }) => Promise<{
        data: any[],
        success: boolean,
        total: number
    }>;
    
    /**
     * 监听列宽改变
     * @param column
     * @returns
     */
    onColumnWidthChange?: (column: ApexTableColumn<T>) => void;
}

/**
 * 表格内部扩展的 props
 */
export interface ApexTableExtendProps<T> {
    tableDataSource?: T[]
}

/**
 * 列
 */
export interface ApexTableColumn<T> {
    title: string;
    name: string;
    columnType?: ApexColumnType;
    width?: number;
    /**
     * 是否显示
     */
    visible?: boolean;
}

/**
 * 表格数据源中，隐藏的属性（内部）
 */
export interface ApexTableColumnHideProps {
    apexTableRowIndex?: number;
    apexTableChecked?: boolean;
}

/**
 * 列类型定义
 */
export type ApexColumnType = 'input' | 'inputNumber' | 'datePicker' | 'rangePicker' | 'select' | 'modal' | 'customer';


/**
 * 表格的 ref 类型
 */
export interface ApexTableRef<T> {
    getColumns: () => ApexTableColumn<T>[];
    getDataSource: () => T[];
}
