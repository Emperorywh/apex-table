import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { ApexTableProps, ApexTableRef } from './index.types';
import { ConfigProvider, Spin } from 'antd'
import zh_CN from 'antd/es/locale/zh_CN';
import "./index.less";
import ApexContextProvider from "./components/ApexContextProvider";
import ApexColgroup from "./components/ApexColgroup";

/**
 * 表格组件
 */
const ApexTablePro = <T extends object>(props: ApexTableProps<T>, ref: React.Ref<ApexTableRef<T>>) => {
    
    const {
        allowSelect = false,
        showLineNumber = true,
        columns = [],
        ...otherProps
    } = props;
    
    /**
     * 加载中
     */
    const [spinning, setSpinning] = useState(false);
    
    useImperativeHandle(ref, () => ({
        getColumns: () => [],
        getDataSource: () => []
    }));
    
    
    return <ConfigProvider locale={zh_CN}>
        <Spin size="large" spinning={spinning}>
            <ApexContextProvider value={{
                ...otherProps,
                allowSelect,
                columns,
                showLineNumber,
            }}>
                <div className='apex-table-container'>
                    <div className='apex-table-content'>
                        <table className='apex-table'>
                            <ApexColgroup />
                        </table>
                    </div>
                </div>
            </ApexContextProvider>
        </Spin>
    </ConfigProvider>
};

const ForwardedApexTablePro = forwardRef(ApexTablePro) as <T>(props: ApexTableProps<T> & { ref?: React.Ref<ApexTableRef<T>> }) => JSX.Element;

export default ForwardedApexTablePro;
