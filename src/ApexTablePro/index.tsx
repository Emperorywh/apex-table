import React, { forwardRef, useImperativeHandle } from 'react';
import { ApexTableProps, ApexTableRef } from 'apex-table/ApexTablePro/index.types';

/**
 * 表格组件
 */
const ApexTablePro = <T, >(props: ApexTableProps<T>, ref: React.Ref<ApexTableRef<T>>) => {
    const { columns } = props;
    
    // 使用 useImperativeHandle 来暴露 ref 方法
    useImperativeHandle(ref, () => ({
        getColumns: () => columns,
        getDataSource: () => []
    }));
    
    return <h1>ApexTablePro</h1>;
};

// 显式地为 forwardRef 提供泛型 T
const ForwardedApexTablePro = forwardRef(ApexTablePro) as <T>(props: ApexTableProps<T> & { ref?: React.Ref<ApexTableRef<T>> }) => JSX.Element;

export default ForwardedApexTablePro;
