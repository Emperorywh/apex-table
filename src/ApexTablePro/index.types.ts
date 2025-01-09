/**
 * 表格
 */
export interface ApexTableProps<T> {
    /**
     * 表格列
     */
    columns: ApexTableColumns<T>[];
    
    /**
     * 是否展示行号
     */
    showLineNumber?: boolean;
    
    /**
     * 是否允许勾选
     */
    allowSelect?: boolean;
}

/**
 * 列
 */
export interface ApexTableColumns<T> {
    title: string;
    name: keyof T;
    columnType?: ApexColumnType;
    width?: number;
}

/**
 * 列类型定义
 */
export type ApexColumnType = 'input' | 'inputNumber' | 'datePicker' | 'rangePicker' | 'select' | 'modal' | 'customer';


/**
 * 表格的 ref 类型
 */
export interface ApexTableRef<T> {
    getColumns: () => ApexTableColumns<T>[];
    getDataSource: () => T[];
}

/**
 * 表格数据源中，隐藏的属性（内部）
 */
export interface ApexTableColumnHideProps {
    apexTableRowIndex: number;
}
