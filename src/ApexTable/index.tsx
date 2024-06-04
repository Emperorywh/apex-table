import React, { ReactNode, useState, useEffect, useRef, forwardRef, useImperativeHandle, useCallback, useMemo } from 'react';
import "./index.less"
import { Checkbox, ConfigProvider, DatePicker, Empty, Input, ModalFuncProps, Pagination, PaginationProps, Spin } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import dayjs from 'dayjs';
import zh_CN from 'antd/es/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import { ApexModalRef } from './types/ApexModal';
import ApexTdWrap from './components/ApexTdWrap';
import ApexTableInput from './components/ApexTableInput';
import ApexTableSelect from './components/ApexTableSelect';
import ApexModal from './components/ApexModal';
import ApexInput from './components/ApexInput';

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
    options?: any[] | ((value: any, row: any) => any);
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


const ApexTable = forwardRef((props: ApexTableProps<any, any>, ref) => {

    const {
        allowSelect = false,
        columns = [],
        dataSource = [],
        showHeaderCheckBox = false,
        tableTitle = false,
        showPagination = false,
        pagination = {},
        readOnly = false,
        height = 450,
        isSingle = false,
        allowFixed = false,
        showLineNumber = true,
        rowKey
    } = props;

    /**
     * 可编辑单元格的 Ref
     */
    const editRefs = useRef<any>({});

    const tableDivRef = useRef<HTMLDivElement>(null);

    const [apexColumns, setApexColumns] = useState<IApexTableColumns<any>[]>([]);

    /**
     * 当前聚焦的坐标
     */
    const focusAxisRef = useRef<IFocusAxis>({
        rowIndex: -1,
        columnName: ''
    });

    /**
     * 表格数据源
     */
    const [tableDataSource, setTableDataSource] = useState<any[]>([]);

    /**
     * 分页数据
     */
    const [pageDataSource, setPageDataSource] = useState<any[]>([]);

    /**
     * 当前页码
     */
    const [currentPage, setCurrentPage] = useState(1);

    /**
     * 每页条数
     */
    const [pageSize, setPageSize] = useState(10);

    /**
     * 数据总数
     */
    const [total, setTotal] = useState(0);

    /**
     * 表格选中的数据
     */
    const [checkedData, setCheckedData] = useState<any[]>([]);

    /**
     * 表头复选框半选样式
     */
    const [indeterminate, setIndeterminate] = useState(false);

    /**
     * 表头复选框是否全选
     */
    const [headerChecked, setHeaderChecked] = useState(false);

    /**
     * 加载中
     */
    const [spinning, setSpinning] = useState(false);

    /**
     * 表头复选框改变事件
     * @param event 
     */
    const onHeaderCheckBoxChange = (event: CheckboxChangeEvent) => {
        const eventValue = event.target.checked;
        setHeaderChecked(eventValue);
        const tempTableDataSource: any[] = [...tableDataSource];
        tempTableDataSource.forEach((item: any) => {
            item['apexTableChecked'] = eventValue;
        });
        if (eventValue) {
            setCheckedData(tableDataSource);
        } else {
            setCheckedData([]);
        }
        setTableDataSource(tempTableDataSource);
    }

    /**
     * 行选中事件
     */
    const handleRowSelected = (event: CheckboxChangeEvent, row: any) => {
        const eventValue = event.target.checked;
        const tempCheck: any[] = structuredClone(checkedData);
        const tempTableDataSource: any[] = structuredClone(tableDataSource);
        const findRowIndex = tempCheck.findIndex(item => item[rowKey] === row[rowKey]);
        const findTableIndex = tempTableDataSource.findIndex(item => item[rowKey] === row[rowKey]);
        if (isSingle) {
            if (eventValue) {
                setCheckedData([row]);
            } else {
                setCheckedData([]);
            }
            tempTableDataSource.forEach((item, index) => {
                if (findTableIndex === index) {
                    tempTableDataSource[index]['apexTableChecked'] = eventValue;
                } else {
                    tempTableDataSource[index]['apexTableChecked'] = false;
                }
            });
            setTableDataSource(tempTableDataSource);
        } else {
            if (eventValue) {
                if (findRowIndex < 0) {
                    tempCheck.push(row);
                    setCheckedData(tempCheck);
                }
            } else {
                if (findRowIndex > -1) {
                    tempCheck.splice(findRowIndex, 1);
                    setCheckedData(tempCheck);
                }
            }
            if (findTableIndex > -1) {
                tempTableDataSource[findTableIndex]['apexTableChecked'] = eventValue;
                setTableDataSource(tempTableDataSource);
            }
        }
    }

    /**
     * 表头复选框半选状态
     */
    const onChangeHeaderCheckBoxIndeter = () => {
        if (checkedData.length > 0) {
            setIndeterminate(true);
            if (checkedData.length === total) {
                setIndeterminate(false);
                setHeaderChecked(true);
            }
        } else {
            setIndeterminate(false);
            setHeaderChecked(false);
        }
    }

    /**
     * 下拉框事件监听
     * @param row 
     * @param columnName 
     * @param value 
     */
    const handleSelectChange = (row: any, columnName: any, value: any, option: any, options: any, onChange?: (value: any, option?: any, options?: any) => void) => {
        handleChangeCellValue(row, columnName, value);
        onChange && onChange(value, option, options);
    }


    /**
     * 时间选择器 改变时间监听
     * @param date 
     * @param dateString 
     */
    const handleDatePickerChange = (row: any, columnName: any, date: dayjs.Dayjs | null, dateString: string, onChange?: (date: dayjs.Dayjs | null, dateString: string) => void) => {
        handleChangeCellValue(row, columnName, dayjs(date));
        onChange && onChange(date, dateString);
    }

    const handleRangePickerChange = (row: any, columnName: any, date: any, dateString: [string, string], onChange?: (date: dayjs.Dayjs | null, dateString: [string, string]) => void) => {
        handleChangeCellValue(row, columnName, dayjs(date));
        onChange && onChange(date, dateString);
    }

    /**
     * 改变单元格的值
     * @param row           当前行信息
     * @param columnName    单元格列名
     * @param value         新值
     */
    const handleChangeCellValue = useCallback((row: any, columnName: any, value: any) => {
        const tempTableDataSource: any[] = [...tableDataSource];
        const findIndex = tempTableDataSource.findIndex((item: any) => item[rowKey] === row[rowKey]);
        if (findIndex > -1) {
            tempTableDataSource[findIndex][columnName] = value;
            setTableDataSource(tempTableDataSource);
        }
    }, [tableDataSource])

    const memoHandleChangeCellValue = (event: React.ChangeEvent<HTMLInputElement>, row: any, columnName: any) => {
        handleChangeCellValue(row, columnName, event.target.value);
    }

    /**
     * 初始化外部传入的静态数据源
     */
    const initOuterDataSource = () => {
        if (Array.isArray(dataSource) && dataSource.length > 0) {
            const data: any[] = [...dataSource];
            data.forEach((item) => {
                item['apexTableChecked'] = false;
            });
            initPagenation(data);
            setTableDataSource(data);
        }
    }

    /**
     * 初始化分页数据
     */
    const initPagenation = (dataSource: any) => {
        setCurrentPage(1);
        if (showPagination) {
            setTotal(dataSource.length);
            setPageSize(pagination?.pageSize ? pagination.pageSize : 10);
        } else {
            setPageSize(dataSource.length);
        }
    }

    /**
     * 根据表格数据、当前页码、每页条数的变化，重新切片
     */
    const initPageDadaSource = () => {
        if (Array.isArray(dataSource) && dataSource.length > 0) {
            const startIndex = (currentPage - 1) * pageSize;
            const endIndex = currentPage * pageSize;
            const newArray: any[] = tableDataSource.slice(startIndex, endIndex);
            setPageDataSource([...newArray]);
        }
        if (props.request && typeof props.request === 'function') {
            setPageDataSource([...tableDataSource]);
        }
    }

    /**
     * 处理 request 的数据
     */
    const handleRequestData = async () => {
        if (props.request && typeof props.request === 'function') {
            setSpinning(true);
            const { data, success, total } = await props.request({ pageSize, currentPage });
            if (success && Array.isArray(data) && data.length > 0) {
                data.forEach((item) => {
                    const findChecked = checkedData.find(checkItem => checkItem[rowKey] === item[rowKey]);
                    item['apexTableChecked'] = findChecked ? true : false;
                });
                setTableDataSource(data);
            }
            setTotal(total);
            setSpinning(false);
        }
    }

    /**
     * 聚焦可编辑单元格
     * @param rowIndex  行号
     * @param rowName   列名
     */
    const handleFocusEditAbleCell = (rowInfo: IFocusAxis) => {
        const name = `${rowInfo.rowIndex}-${rowInfo.columnName}`;
        const findRefName = Object.keys(editRefs.current).find(key => key === name);
        if (findRefName) {
            editRefs.current[findRefName]?.focus();
            const tableTop = tableDivRef.current?.getBoundingClientRect().top;
            const td = document.getElementById(`td-${findRefName}`);
            const tdHeight = td?.getBoundingClientRect().height || 0;
            const tdTop = td?.getBoundingClientRect().top || 0;
            if (tableTop && td && tdTop - tableTop < tdHeight) {
                tableDivRef.current.scrollTop = tableDivRef.current.scrollTop - tdHeight + (tdTop - tableTop);
            }
        }
    }

    /**
     * 输入框聚焦时触发
     */
    const handleInputFocus = (axis: IFocusAxis) => {
        focusAxisRef.current = axis;
    };

    /**
     * 监听键盘按下
     * @param event 
     */
    const onApexTableKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event: any) => {
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
        const indexUp = focusAxisRef.current.rowIndex - 1;
        if (indexUp < 0) {
            focusAxisRef.current.rowIndex = 0;
        } else {
            focusAxisRef.current.rowIndex -= 1;
        }
        handleFocusEditAbleCell(focusAxisRef.current);
    }

    /**
     * 监听键盘按键 ↓
     */
    const onArrowDown = () => {
        const indexDown = focusAxisRef.current.rowIndex + 1;
        if (indexDown > pageDataSource.length - 1) {
            focusAxisRef.current.rowIndex = pageDataSource.length - 1;
        } else {
            focusAxisRef.current.rowIndex += 1;
        }
        handleFocusEditAbleCell(focusAxisRef.current);
    }

    /**
     * 监听键盘按键 ←
     * @param cursorPosition 光标位置
     */
    const onArrowLeft = (cursorPosition: number) => {
        if (cursorPosition === 0) {
            const findIndex = apexColumns.findIndex(item => item.name === focusAxisRef.current.columnName);
            if (findIndex > 0) {
                let findColumn;
                for (let i = findIndex - 1; i > -1; i--) {
                    const item = apexColumns[i];
                    if ((item.columnType !== 'customer' || !item.columnType) && !item.readOnly) {
                        findColumn = item;
                        break;
                    }
                }
                if (!findColumn) {
                    for (let i = apexColumns.length - 1; i > findIndex; i--) {
                        const item = apexColumns[i];
                        if ((item.columnType !== 'customer' || !item.columnType) && !item.readOnly) {
                            findColumn = item;
                            break;
                        }
                    }
                }
                if (findColumn) {
                    focusAxisRef.current.columnName = findColumn.name;
                }
            } else {
                if (focusAxisRef.current.rowIndex > 0) {
                    focusAxisRef.current.rowIndex -= 1;
                }
                let findColumn;
                for (let i = apexColumns.length - 1; i > findIndex; i--) {
                    const item = apexColumns[i];
                    if ((item.columnType !== 'customer' || !item.columnType) && !item.readOnly) {
                        findColumn = item;
                        break;
                    }
                }
                if (findColumn) {
                    focusAxisRef.current.columnName = findColumn.name;
                }
            }
        }
        handleFocusEditAbleCell(focusAxisRef.current);
    }

    /**
     * 监听键盘按键 →
     * @param cursorPosition    光标位置
     * @param eventValue        输入框的值
     */
    const onArrowRight = (cursorPosition: number, eventValue: any) => {
        if (cursorPosition === eventValue.length) {
            const findIndex = apexColumns.findIndex(item => {
                return item.name === focusAxisRef.current.columnName;
            });

            // 最后一个可编辑列
            let findLastEditIndex = -1;
            for (let i = apexColumns.length - 1; i > -1; i--) {
                const item = apexColumns[i];
                if ((item.columnType !== 'customer' || !item.columnType) && !item.readOnly) {
                    findLastEditIndex = i;
                    break;
                }
            }
            if (findIndex === findLastEditIndex) {
                if (focusAxisRef.current.rowIndex === pageDataSource.length - 1) {
                    focusAxisRef.current.rowIndex = 0;
                } else {
                    focusAxisRef.current.rowIndex += 1;
                }
                let findColumn;
                for (let i = 0; i < apexColumns.length - 1; i++) {
                    const item = apexColumns[i];
                    if ((item.columnType !== 'customer' || !item.columnType) && !item.readOnly) {
                        findColumn = item;
                        break;
                    }
                }
                if (findColumn) {
                    focusAxisRef.current.columnName = findColumn.name;
                }
            } else {
                let findColumn;
                for (let i = findIndex + 1; i < apexColumns.length; i++) {
                    const item = apexColumns[i];
                    if ((item.columnType !== 'customer' || !item.columnType) && !item.readOnly) {
                        findColumn = item;
                        break;
                    }
                }
                if (!findColumn) {
                    for (let i = 0; i < findIndex; i++) {
                        const item = apexColumns[i];
                        if ((item.columnType !== 'customer' || !item.columnType) && !item.readOnly) {
                            findColumn = item;
                            break;
                        }
                    }
                }
                if (findColumn) {
                    focusAxisRef.current.columnName = findColumn.name;
                }
            }
        }
        handleFocusEditAbleCell(focusAxisRef.current);
    }

    /**
     * 监听鼠标滚轮
     * @param event 
     */
    const onWheel = (event: any) => {
        event.preventDefault();
        const direction = event.deltaY > 0 ? 'ArrowDown' : 'ArrowUp';
        if (direction === 'ArrowUp') {
            onArrowUp();
        } else {
            onArrowDown();
        }
    }


    /***** Start  表格向外暴露的事件 Start *****/
    /**
     * 获取列集合
     */
    const getColumns = () => {
        return apexColumns;
    }

    /**
     * 设置列集合
     * @param columns 
     */
    const setColumns = (columns: IApexTableColumns<any>[]) => {
        setApexColumns(columns);
    }

    /**
     * 重置列集合 根据传入的columns进行重置
     */
    const resetColumns = () => {
        setApexColumns([...columns]);
    }

    /**
     * 获取表格数据源
     * @returns 
     */
    const getDataSource = () => {
        return tableDataSource;
    }

    /**
     * 在表尾新增N行，并返回所有数据
     * @param rows 
     */
    const pushRows = (rows: any[]) => {
        const rowList = Array.isArray(rows) ? rows : [rows];
        const result = [...tableDataSource, ...rowList];
        setTableDataSource(result);
        return result;
    }

    /**
     * 在指定的行ID后，批量插入数据。
     * @param uniqueId 行ID
     * @param rows      插入数据
     */
    const insertRows = (uniqueId: string, rows: any[]) => {
        const rowList = Array.isArray(rows) ? rows : [rows];
        const findIndex = tableDataSource.findIndex((item) => item[rowKey] === uniqueId);
        if (findIndex > -1) {
            const cloneTable = structuredClone(tableDataSource);
            cloneTable.splice(findIndex + 1, 0, ...rowList);
            setTableDataSource(cloneTable);
        }
    }

    /**
     * 更新指定行的数据
     * @param uniqueId 
     * @param row 
     */
    const updateRow = (uniqueId: string, row: any) => {
        const cloneTable = structuredClone(tableDataSource);
        let findIndex = cloneTable.findIndex((item) => item[rowKey] === uniqueId);
        if (findIndex > -1) {
            cloneTable[findIndex] = {
                ...cloneTable[findIndex],
                ...row,
            }
            setTableDataSource(cloneTable);
        }
    }

    useImperativeHandle(ref, () => {
        return {
            getColumns,
            setColumns,
            resetColumns,
            getDataSource,
            pushRows,
            insertRows,
            updateRow
        }
    }, [apexColumns, tableDataSource]);

    /***** End  ========================= End *****/

    useEffect(() => {
        setApexColumns(columns)
    }, [columns]);

    useEffect(() => {
        const element = tableDivRef.current;
        if (element) {
            element.addEventListener('wheel', onWheel, { passive: false });

            return () => {
                element.removeEventListener('wheel', onWheel);
            }
        }
    }, [pageDataSource]);

    useEffect(() => {
        handleRequestData();
    }, [currentPage, pageSize]);

    useEffect(() => {
        initOuterDataSource();
    }, [dataSource]);

    useEffect(() => {
        initPageDadaSource();
    }, [tableDataSource, currentPage, pageSize]);

    useEffect(() => {
        onChangeHeaderCheckBoxIndeter();
    }, [checkedData, dataSource]);

    return <ConfigProvider locale={zh_CN}>
        <Spin size="large" spinning={spinning}>
            <div className='apex-table-container' style={{ height: height }} onKeyDown={onApexTableKeyDown} >
                <div className='apex-table-content' ref={tableDivRef} >
                    <table className='apex-table'>
                        <colgroup>
                            {
                                showLineNumber && <col style={{ width: 50 }}></col>
                            }
                            {
                                allowSelect && <col style={{ width: 50 }}></col>
                            }
                            {
                                apexColumns.map((item, index) => {
                                    return <col key={`colgroup-${index}`} style={{ width: item.width || 120 }}></col>
                                })
                            }
                        </colgroup>
                        {
                            tableTitle && <caption>{tableTitle}</caption>
                        }
                        <thead className='apex-table-thead'>
                            <tr>
                                {
                                    showLineNumber ? <th className='apex-table-thead-th apex-table-thead-th-line-number-head'>
                                        <span>行号</span>
                                    </th> : null
                                }
                                {
                                    showHeaderCheckBox ? <th className='apex-table-thead-th apex-table-thead-th-checkbox'>
                                        <Checkbox disabled={isSingle} checked={headerChecked} indeterminate={indeterminate} onChange={onHeaderCheckBoxChange} />
                                    </th> : null
                                }
                                {
                                    apexColumns.map((item, index) => {
                                        if (item?.visible === false) {
                                            return null
                                        } else {
                                            return <th key={`${String(item.name)}-${index}`} className={`apex-table-thead-th ${allowFixed && item.fixed ? 'apex-table-thead-fixed-' + item.fixed : ''}`}>
                                                {item['title']}
                                            </th>;
                                        }
                                    })
                                }
                            </tr>
                        </thead>
                        <tbody className='apex-table-tbody'>
                            {
                                pageDataSource.length > 0 ? pageDataSource.map((dataSourceItem, dataSourceIndex) => {
                                    return <tr key={`apex-table-tbody-tr-${dataSourceIndex}`} className='apex-table-tbody-tr'>
                                        {
                                            showLineNumber && <td className='apex-table-tbody-td apex-table-tbody-td-line-number'>
                                                <div className={`number ${dataSourceIndex > 2 ? 'number-low' : ''}`}>{dataSourceIndex + 1}</div>
                                            </td>
                                        }
                                        {
                                            allowSelect && <td className='apex-table-tbody-td apex-table-tbody-td-checkbox'>
                                                <Checkbox checked={dataSourceItem?.['apexTableChecked']} onChange={(event) => handleRowSelected(event, dataSourceItem)} />
                                            </td>
                                        }
                                        {
                                            apexColumns.map((columnItem) => {
                                                if (columnItem?.visible === false) return;
                                                const refKey: string = `${dataSourceIndex}-${columnItem.name as string}`;
                                                return <ApexInput
                                                    key={refKey}
                                                    column={columnItem}
                                                    row={dataSourceItem}
                                                    rowIndex={dataSourceIndex}
                                                    ref={inputRef => editRefs.current[refKey] = inputRef}
                                                    onCellClick={handleInputFocus}
                                                    onChange={memoHandleChangeCellValue}
                                                    onFocus={handleInputFocus}

                                                />
                                            })
                                        }
                                    </tr>
                                }) : <tr>
                                    <td colSpan={apexColumns.length}>
                                        <Empty />
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
                {
                    showPagination && <div className='apex-table-pagination'>
                        <Pagination
                            {...pagination}
                            current={currentPage}
                            pageSize={pageSize}
                            total={total}
                            onChange={(page, pageSize) => {
                                pagination?.onChange && pagination.onChange(page, pageSize)
                                setCurrentPage(page);
                                setPageSize(pageSize);
                            }}
                        />
                    </div>
                }
            </div>
        </Spin>
    </ConfigProvider >
});

export default ApexTable;
