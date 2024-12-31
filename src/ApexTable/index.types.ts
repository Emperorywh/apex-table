import { InputProps, ModalFuncProps, PaginationProps } from "antd";
import { DefaultOptionType } from "antd/es/select";
import React, { ReactNode } from "react";
import { ApexModalRef } from "./components/ApexModal/index.types";

export interface ApexTableProps<T, V> {
    /**
     * 表格实例
     */
    ref?: React.Ref<ApexTableRef>;
    
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
    columns: IApexTableColumns<T>[];
    
    /**
     * 表格数据源(静态)
     */
    dataSource?: V[];
    
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
    onColumnWidthChange?: (column: IApexTableColumns<T>) => void;
}

/**
 * 表格列的配置描述
 */
export interface IApexTableColumns<T> {
    title: string;
    name: string;
    columnType?: IColumnType;
    options?: DefaultOptionType[] | ((value: any, row: any) => DefaultOptionType[]);
    defaultValue?: any;
    width?: number;
    /**
     * 是否开起排序
     */
    allowSortColumn?: boolean;
    showTime?: boolean;
    /**
     * 是否显示
     */
    visible?: boolean;
    /**
     * 是否只读，优先级高于列表
     */
    readOnly?: boolean;
    /**
     * 固定列
     */
    fixed?: 'left' | 'right';
    /**
     * 单元格校验
     */
    rules?: IApexTableCellValid;
    /**
     * 是否展示 合计列
     */
    showSummary?: boolean;
    rowSpan?: number;
    colSpan?: number;
    children?: IApexTableColumns<T>[],
    onChange?: (value: any, option?: any, options?: any) => void;
    onFormatter?: (row?: any, value?: any) => React.ReactNode;
    onRender?: (row?: any, value?: any) => React.ReactNode;
    modalOptions?: (row: any, value: any, modalRef: React.RefObject<ApexModalRef>) => ModalFuncProps;
    /**
     * 输入框 属性
     */
    apexTableInputProps?: InputProps
}

/**
 * 列类型
 */
export type IColumnType = 'input' | 'inputNumber' | 'datePicker' | 'rangePicker' | 'select' | 'modal' | 'customer';

export interface IFocusAxis {
    rowIndex: number;
    columnName: string;
}

export interface ApexTableRef {
    /**
     * 获取列集合
     */
    getColumns: () => IApexTableColumns<any>[];
    /**
     * 获取表格数据源
     */
    getDataSource: () => any[];
    /**
     * 设置列
     * @param columns
     */
    setColumns: (columns: IApexTableColumns<any>[]) => void;
    /**
     * 重置列集合 根据传入的columns进行重置
     */
    resetColumns: () => void;
    /**
     * 在表尾新增N行，并返回所有数据
     * @param dataSource 列数组
     */
    pushRows: (dataSource: any[]) => any[];
    /**
     * 在指定的行ID后，批量插入数据。
     * @param rowKey        行ID
     * @param dataSource    插入数据
     */
    insertRows: (rowKey: string, dataSource: any[]) => void;
    /**
     * 更新指定行的数据
     * @param rowKey
     * @param dataSource
     */
    updateRow: (rowKey: string, dataSource: any) => void;
    /**
     * 删除指定行的数据
     * @param rowKey
     */
    deleteRow: (rowKey: string) => void
    
    /**
     * 获取选中的数据
     */
    getCheckedData: () => any[];
    
    /**
     * 设置请求参数，并重新请求接口
     * @param params
     */
    setRequestParams: (params: any) => void;
}

/**
 * 单元格校验
 */
export interface IApexTableCellValid {
    isValid: (params: IApexTableCellInfo) => boolean;
    noticeMessage?: string
}

/**
 *  单元格能拿到的信息
 */
export  interface IApexTableCellInfo {
    row: any;
    value: any;
}
