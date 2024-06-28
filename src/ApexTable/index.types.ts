import { ModalFuncProps, PaginationProps } from "antd";
import { DefaultOptionType } from "antd/es/select";
import { ReactNode } from "react";
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
     * 是否展示行号
     */
    showLineNumber?: boolean;

    /**
     * 唯一行号字段名
     */
    rowKey: string;

    /**
     * 行高
     */
    rowHeight: number;

    /**
     * 获取 dataSource 的方法
     * @param params 
     * @returns 
     */
    request?: (params?: { pageSize: number, currentPage: number }) => Promise<{
        data: any[],
        success: boolean,
        total: number
    }>
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
    showTime?: boolean;
    // 是否显示
    visible?: boolean;
    /**
     * 是否只读，优先级高于列表
     */
    readOnly?: boolean;
    fixed?: 'left' | 'right';
    onChange?: (value: any, option?: any, options?: any) => void;
    onFormatter?: (row?: any, value?: any) => React.ReactNode;
    onRender?: (row?: any, value?: any) => React.ReactNode;
    modalOptions?: (row: any, value: any, modalRef: React.RefObject<ApexModalRef>) => ModalFuncProps;
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
    getColumns: () => IApexTableColumns<any>[];
    getDataSource: () => any[];
    setColumns: (columns: IApexTableColumns<any>[]) => void;
    resetColumns: () => void;
    pushRows: (dataSource: any[]) => any[];
    insertRows: (rowKey: string, dataSource: any[]) => void;
    updateRow: (rowKey: string, dataSource: any) => void
}
