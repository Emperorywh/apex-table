import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { ApexTableColumnHideProps, ApexTableProps, ApexTableRef } from './index.types';
import { ConfigProvider, Spin } from 'antd'
import zh_CN from 'antd/es/locale/zh_CN';
import "./index.less";
import ApexContextProvider from "./components/ApexContextProvider";
import ApexColgroup from "./components/ApexColgroup";
import ApexThead from "./components/ApexThead"
import ApexTbody from 'apex-table/ApexTablePro/components/ApexTbody'

/**
 * 表格组件
 */
const ApexTablePro = <T extends ApexTableColumnHideProps>(props: ApexTableProps<T>, ref: React.Ref<ApexTableRef<T>>) => {
    
    const {
        allowSelect = false,
        columns = [],
        dataSource = [],
        showLineNumber = true,
        ...otherProps
    } = props;
    
    /**
     * 加载中
     */
    const [spinning, setSpinning] = useState(false);
    /**
     * 外部传入的dataSource
     */
    const [tableDataSource, setTableDataSource] = useState<T[]>([]);
    
    /**
     * 格式化外部传入的dataSource
     */
    const onFormatDataSource = () => {
        const cloneDataSource = structuredClone(dataSource);
        cloneDataSource.forEach((row, rowIndex) => {
            row.apexTableRowIndex = rowIndex;
            row.apexTableChecked = false;
        });
        setTableDataSource(tableDataSource);
    }
    
    useEffect(() => {
        onFormatDataSource();
    }, [dataSource]);
    
    useImperativeHandle(ref, () => ({
        getColumns: () => [],
        getDataSource: () => []
    }));
    
    return <ConfigProvider locale={zh_CN}>
        <Spin size="large" spinning={spinning}>
            <ApexContextProvider<T>
                value={{
                    ...otherProps,
                    allowSelect,
                    columns,
                    dataSource,
                    showLineNumber,
                    tableDataSource
                }}>
                <div className='apex-table-container'>
                    <div className='apex-table-content'>
                        <table className='apex-table'>
                            <ApexColgroup/>
                            <ApexThead/>
                            <ApexTbody/>
                        </table>
                    </div>
                </div>
            </ApexContextProvider>
        </Spin>
    </ConfigProvider>
};

const ForwardedApexTablePro = forwardRef(ApexTablePro) as <T>(props: ApexTableProps<T> & { ref?: React.Ref<ApexTableRef<T>> }) => JSX.Element;

export default ForwardedApexTablePro;
