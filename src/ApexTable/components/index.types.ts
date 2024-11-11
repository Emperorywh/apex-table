import { IApexTableColumns, IFocusAxis } from "../index.types";
import React from 'react'

/**
 * td/th 通用属性
 */
export interface ITdThCommonProps<T> {
    columns: IApexTableColumns<T>[];
    rowHeight: number;
    allowResize?: boolean;
    allowFixed: boolean;
    showLineNumber: boolean;
    allowSelect: boolean;
    allowColumnDrag?: boolean;
}

/**
 * 表格组件通用类型
 */
export interface ICommonProps<T> extends ITdThCommonProps<T> {
    column: IApexTableColumns<T>;
    children?: React.ReactNode;
    defaultValue?: string;
    row: any;
    rowIndex: number;
    /**
     * 是否展示 合计行
     */
    showSummary: boolean;
    tableDivRef: React.RefObject<HTMLDivElement>;
    onCellClick: (rowInfo: IFocusAxis) => void;
    onFocus?: (rowInfo: IFocusAxis) => void;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    onChange?: (row: any, columnName: any, value: any) => void;
    onEnter?: () => void;
}

/**
 * 表格组件向外暴露的组件方法
 */
export interface IComponentsRef {
    focus: () => void;
    blur: () => void;
}