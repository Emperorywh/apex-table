import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { ApexFocusAxis, ApexTableColumnHideProps, ApexTableProps, ApexTableRef } from './index.types';
import { ConfigProvider, Spin } from 'antd'
import zh_CN from 'antd/es/locale/zh_CN';
import "./index.less";
import ApexContextProvider from "./components/ApexContextProvider";
import ApexColgroup from "./components/ApexColgroup";
import ApexThead from "./components/ApexThead"
import ApexTbody from './components/ApexTbody'
import { flushSync } from 'react-dom'

/**
 * 表格组件
 */
const ApexTablePro = <T extends ApexTableColumnHideProps>(props: ApexTableProps<T>, ref: React.Ref<ApexTableRef<T>>) => {
    
    const {
        allowSelect = false,
        columns = [],
        dataSource = [],
        showLineNumber = true,
        rowHeight = 45,
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
     * 当前聚焦的单元格
     */
    const [focusAxis, setFocusAxis] = useState<ApexFocusAxis>({
        x: -1,
        y: ''
    });
    
    
    /**
     * 格式化外部传入的dataSource
     */
    const onFormatDataSource = () => {
        const cloneDataSource = structuredClone(dataSource);
        cloneDataSource.forEach((row, rowIndex) => {
            row.apexTableRowIndex = rowIndex;
            row.apexTableChecked = false;
        });
        setTableDataSource(cloneDataSource);
    }
    
    /**
     * 监听表格键盘按下事件
     */
    const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event: any) => {
        const key = event.key;
        const eventValue = event.target.value;
        const cursorPosition = event.target.selectionStart;
        switch (key) {
            case 'ArrowUp':
                onArrowUp();
                break;
            case 'ArrowDown':
                onArrowDown();
                break;
            case 'ArrowLeft':
                onArrowLeft(cursorPosition);
                break;
            case 'ArrowRight':
                onArrowRight(cursorPosition, eventValue);
                break;
        }
    }
    
    /**
     * 监听键盘按键 ↑
     */
    const onArrowUp = () => {
        const axis: ApexFocusAxis = {
            x: focusAxis.x - 1,
            y: focusAxis.y
        }
        if (axis.x < 0) {
            axis.x = 0;
        }
        if (axis.x !== focusAxis.x) {
            setFocusAxis(axis);
        }
    }
    
    /**
     * 监听键盘按键 ↓
     */
    const onArrowDown = () => {
        const axis: ApexFocusAxis = {
            x: focusAxis.x + 1,
            y: focusAxis.y
        }
        if (axis.x > tableDataSource.length - 1) {
            axis.x = tableDataSource.length - 1;
        }
        if (axis.x !== focusAxis.x) {
            setFocusAxis(axis);
        }
    }
    
    /**
     * 监听键盘按键 ←
     * @param cursorPosition 光标位置
     */
    const onArrowLeft = (cursorPosition: number) => {
    
    }
    
    /**
     * 监听键盘按键 →
     * @param cursorPosition    光标位置
     * @param eventValue        输入框的值
     */
    const onArrowRight = (cursorPosition: number, eventValue: any) => {
    
    }
    
    /**
     * 改变单元格坐标
     */
    const handleChangeFocusAxis = useCallback((axis: ApexFocusAxis) => {
        setFocusAxis(structuredClone(axis))
    }, [])
    
    /**
     * 上下文中传递的值
     */
    const providerValue = useMemo(() => {
        return {
            ...otherProps,
            allowSelect,
            columns,
            dataSource,
            focusAxis,
            showLineNumber,
            tableDataSource,
            rowHeight,
            onChangeFocusAxis: handleChangeFocusAxis
        }
    }, [tableDataSource, columns, dataSource, focusAxis]);
    
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
                value={providerValue}>
                <div className='apex-table-container' onKeyDown={handleKeyDown}>
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
