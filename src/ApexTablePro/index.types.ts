
// 表格的列配置接口
export interface ApexTableColumns<T> {
    title: string;  // 列的标题
    name: keyof T;  // 列名，确保是 T 的键
    columnType?: ApexColumnType;  // 列类型，可以是可选的
}

// 列类型定义
export type ApexColumnType = 'input' | 'inputNumber' | 'datePicker' | 'rangePicker' | 'select' | 'modal' | 'customer';

// 表格的 props 类型，传入泛型 T 来定义数据行的结构
export interface ApexTableProps<T> {
    columns: ApexTableColumns<T>[];  // 表格的列配置，列数组
}

// 表格的 ref 类型，包含获取列集合的方法
export interface ApexTableRef<T> {
    getColumns: () => ApexTableColumns<T>[];  // 获取列配置的方法
    getDataSource: () => T[];
}
