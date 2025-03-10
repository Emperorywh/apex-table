import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from 'react';
import "./index.less"
import { ConfigProvider, Spin } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import zh_CN from 'antd/es/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import { flushSync } from 'react-dom';
import { ApexColgroup, ApexPagination, ApexTbody, ApexThead, ApexTrSummary } from './components';
import { ApexTableProps, IApexTableColumns, IFocusAxis } from './index.types';


const ApexTable = forwardRef((props: ApexTableProps<any, any>, ref) => {
    
    const {
        allowSelect = false,
        allowResize = false,
        allowFixed = false,
        allowRowDrag = false,
        allowColumnDrag = false,
        allowRowAddDel = false,
        allowSort = false,
        columns = [],
        dataSource = [],
        showHeaderCheckBox = false,
        showSummary = false,
        tableTitle = false,
        showPagination = false,
        pagination = {},
        height = 450,
        rowHeight = 45,
        isSingle = false,
        showLineNumber = true,
        showColumnConfig = false,
        rowKey,
        readOnly = false,
        onColumnWidthChange
    } = props;
    
    /**
     * 可编辑单元格的 Ref
     */
    const editRefs = useRef<any>({});
    
    const tableDivRef = useRef<HTMLDivElement>(null);
    
    const [apexColumns, setApexColumns] = useState<IApexTableColumns<any>[]>([]);
    const [apexBodyColumns, setApexBodyColumns] = useState<IApexTableColumns<any>[]>([]);
    
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
    
    const [summaryData, setSummaryData] = useState<any>({});
    
    /**
     * 计算列合计
     */
    const handleCalculate = () => {
        if (!showSummary) return;
        const result: any = {};
        columns.forEach(columnItem => {
            if (columnItem.showSummary) {
                result[columnItem.name] = tableDataSource.reduce((sum, tabItem) => {
                    const formatValue = Number.parseFloat(tabItem[columnItem.name]);
                    return sum + formatValue;
                }, 0);
            }
        });
        setSummaryData(result);
    }
    
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
    
    /**
     * 初始化外部传入的静态数据源
     */
    const initOuterDataSource = () => {
        if (Array.isArray(dataSource) && dataSource.length > 0) {
            const data: any[] = structuredClone(dataSource);
            data.forEach((item, index) => {
                item['apexTableChecked'] = false;
            });
            initPagenation(data);
            setTableDataSource(data);
        }
    }
    
    /**
     * 重新初始化内部的数据源
     */
    const initInnerDataSource = () => {
        if (Array.isArray(tableDataSource) && tableDataSource.length > 0) {
            const data: any[] = structuredClone(tableDataSource);
            data.forEach((item, index) => {
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
            newArray.forEach((item, index) => {
                item['rowIndex'] = index;
            })
            setPageDataSource([...newArray]);
        }
        if (props.request && typeof props.request === 'function') {
            setPageDataSource([...tableDataSource]);
        }
    }
    
    /**
     * 处理 request 的数据
     */
    const handleRequestData = async (params: any = {}) => {
        if (props.request && typeof props.request === 'function') {
            setSpinning(true);
            const { data, success, total } = await props.request({ pageSize, currentPage,  ...params });
            if (success && Array.isArray(data) && data.length > 0) {
                data.forEach((item, index) => {
                    const findChecked = checkedData.find(checkItem => checkItem[rowKey] === item[rowKey]);
                    item['apexTableChecked'] = !!findChecked;
                    item['rowIndex'] = index;
                });
                setTableDataSource([...data]);
            }
            setTotal(total);
            setSpinning(false);
        }
    }
    
    /**
     * 聚焦可编辑单元格
     * @param rowInfo
     */
    const handleFocusEditAbleCell = (rowInfo: IFocusAxis) => {
        const name = `${rowInfo.rowIndex}-${rowInfo.columnName}`;
        const findRefName = Object.keys(editRefs.current).find(key => key === name);
        if (findRefName) {
            editRefs.current[findRefName]?.focus();
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
    const onArrowUp = (added = false) => {
        flushSync(() => {
            const indexUp = focusAxisRef.current.rowIndex - 1;
            if (indexUp < 0) {
                focusAxisRef.current.rowIndex = 0;
            } else {
                !added && (focusAxisRef.current.rowIndex -= 1);
            }
            handleFocusEditAbleCell(focusAxisRef.current);
        })
    }
    
    /**
     * 监听键盘按键 ↓
     */
    const onArrowDown = (added = false) => {
        flushSync(() => {
            const indexDown = focusAxisRef.current.rowIndex + 1;
            if (indexDown > pageDataSource.length - 1) {
                focusAxisRef.current.rowIndex = pageDataSource.length - 1;
            } else {
                !added && (focusAxisRef.current.rowIndex += 1);
            }
            handleFocusEditAbleCell(focusAxisRef.current);
        })
    }
    
    /**
     * 监听键盘按键 ←
     * @param cursorPosition 光标位置
     */
    const onArrowLeft = (cursorPosition: number) => {
        flushSync(() => {
            if (cursorPosition === 0) {
                const findIndex = apexBodyColumns.findIndex(item => item.name === focusAxisRef.current.columnName);
                if (findIndex > 0) {
                    let findColumn;
                    for (let i = findIndex - 1; i > -1; i--) {
                        const item = apexBodyColumns[i];
                        if ((item.columnType !== 'customer' || !item.columnType) && !item.readOnly) {
                            findColumn = item;
                            break;
                        }
                    }
                    if (!findColumn) {
                        for (let i = apexBodyColumns.length - 1; i > findIndex; i--) {
                            const item = apexBodyColumns[i];
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
                    for (let i = apexBodyColumns.length - 1; i > findIndex; i--) {
                        const item = apexBodyColumns[i];
                        if ((item.columnType !== 'customer' || !item.columnType) && !item.readOnly) {
                            findColumn = item;
                            break;
                        }
                    }
                    if (findColumn) {
                        focusAxisRef.current.columnName = findColumn.name;
                    }
                }
                handleFocusEditAbleCell(focusAxisRef.current);
            }
        })
    }
    
    /**
     * 监听键盘按键 →
     * @param cursorPosition    光标位置
     * @param eventValue        输入框的值
     */
    const onArrowRight = (cursorPosition: number, eventValue: any) => {
        flushSync(() => {
            if (cursorPosition === eventValue.length) {
                const findIndex = apexBodyColumns.findIndex(item => {
                    return item.name === focusAxisRef.current.columnName;
                });
                // 最后一个可编辑列
                let findLastEditIndex = -1;
                for (let i = apexBodyColumns.length - 1; i > -1; i--) {
                    const item = apexBodyColumns[i];
                    if ((item.columnType !== 'customer' || !item.columnType) && !item.readOnly) {
                        findLastEditIndex = i;
                        break;
                    }
                }
                if (findIndex === findLastEditIndex) {
                    if (focusAxisRef.current.rowIndex === pageDataSource.length - 1) {
                        // focusAxisRef.current.rowIndex = 0;
                    } else {
                        focusAxisRef.current.rowIndex += 1;
                    }
                    let findColumn;
                    for (let i = 0; i < apexBodyColumns.length - 1; i++) {
                        const item = apexBodyColumns[i];
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
                    for (let i = findIndex + 1; i < apexBodyColumns.length; i++) {
                        const item = apexBodyColumns[i];
                        if ((item.columnType !== 'customer' || !item.columnType) && !item.readOnly) {
                            findColumn = item;
                            break;
                        }
                    }
                    if (!findColumn) {
                        for (let i = 0; i < findIndex; i++) {
                            const item = apexBodyColumns[i];
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
                handleFocusEditAbleCell(focusAxisRef.current);
            }
        })
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
            initPagenation(cloneTable);
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
    
    /**
     * 删除一行数据
     * @param uniqueId
     */
    const deleteRow = (uniqueId: string) => {
        const cloneTable = structuredClone(tableDataSource);
        let findIndex = cloneTable.findIndex((item) => item[rowKey] === uniqueId);
        if (findIndex > -1) {
            const cloneTable = structuredClone(tableDataSource);
            cloneTable.splice(findIndex, 1);
            setTableDataSource(cloneTable);
        }
    }
    
    /**
     * 获取选中的数据
     */
    const getCheckedData = () => {
        return structuredClone(checkedData);
    }
    
    /**
     * 设置请求参数，并重新请求接口
     */
    const setRequestParams = (params: any) => {
        handleRequestData(params);
    }
    
    useImperativeHandle(ref, () => {
        return {
            getColumns,
            setColumns,
            resetColumns,
            getDataSource,
            pushRows,
            insertRows,
            updateRow,
            deleteRow,
            getCheckedData,
            setRequestParams
        }
    });
    
    /***** End  ========================= End *****/
    
    const onSetBodyColumns = () => {
        const result: IApexTableColumns<any>[] = [];
        onGetTreeColumns(apexColumns, result);
        setApexBodyColumns([...result])
    }
    
    const onGetTreeColumns = (columns: IApexTableColumns<any>[], result: IApexTableColumns<any>[]) => {
        columns.forEach(column => {
            if (column.children && column.children.length > 0) {
                onGetTreeColumns(column.children, result);
            } else {
                if (!column.hasOwnProperty('visible')) {
                    column.visible = true;
                }
                result.push(column);
            }
        })
    }
    
    useEffect(() => {
        const cloneColumns = [...columns];
        cloneColumns.forEach(item => {
            if (!item.hasOwnProperty('visible')) {
                item.visible = true;
            }
        });
        setApexColumns(cloneColumns);
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
    
    useEffect(() => {
        handleCalculate()
    }, [tableDataSource, columns, showSummary])
    
    useEffect(() => {
        onSetBodyColumns();
    }, [apexColumns])
    
    // 缓冲区数量
    const bufferCount = 5;
    // 渲染节点的数量
    const renderCount = Math.ceil(height / rowHeight);
    const [startIndex, setStartIndex] = useState(0);
    const [endIndex, setEndIndex] = useState(renderCount + bufferCount || 0);
    
    /**
     * 滚动时对数据源进行切片
     */
    const handleScrollBySlice = (scrollTop: number) => {
        flushSync(() => {
            let start = Math.floor(scrollTop / rowHeight);
            const startBottom = pageDataSource.length - renderCount - bufferCount;
            if (start > startBottom) {
                start = startBottom;
            }
            if (start > bufferCount) {
                start -= bufferCount;
            } else {
                start = 0;
            }
            const endBottom = pageDataSource.length;
            let end = Math.floor(start + renderCount + bufferCount) + 1;
            if (end > endBottom) {
                end = endBottom;
            }
            if (start > bufferCount) {
                end += bufferCount;
            }
            if (showSummary) {
                end++;
            }
            setStartIndex(start);
            setEndIndex(end);
        })
    }
    
    /**
     * 列宽改变
     * @param column
     * @param width
     * @returns
     */
    const handleColWidthChange = (column: IApexTableColumns<any>, width: number) => {
        if (!allowResize) return;
        const cloneColumn = [...apexColumns];
        const findColumn = cloneColumn.find(item => item.name === column.name);
        if (findColumn) {
            findColumn.width = width;
            onColumnWidthChange && onColumnWidthChange(findColumn);
            setApexColumns(cloneColumn);
        }
    }
    
    /**
     * 排序
     * @param column
     * @param sortType
     */
    const handleColumnSort = (column: IApexTableColumns<any>, sortType: '' | 'asc' | 'desc') => {
        if (sortType === '') {
            initInnerDataSource();
            return;
        }
        const _dataSource = structuredClone(tableDataSource);
        _dataSource.sort((a, b) => {
            const valueA = a[column.name];
            const valueB = b[column.name];
            if (typeof valueA === 'string' && typeof valueB === 'string') {
                if (sortType === 'asc') {
                    return valueA.localeCompare(valueB);
                } else {
                    return valueB.localeCompare(valueA);
                }
            } else if (typeof valueA === 'number' && typeof valueB === 'number') {
                if (sortType === 'asc') {
                    return valueA - valueB;
                } else {
                    return valueB - valueA;
                }
            } else {
                return 0;
            }
        });
        setTableDataSource(_dataSource)
    }
    
    return <ConfigProvider locale={zh_CN}>
        <Spin size="large" spinning={spinning}>
            <div className='apex-table-container' style={{ height: height }} onKeyDown={onApexTableKeyDown}>
                <div className='apex-table-content' ref={tableDivRef} onScroll={(event: any) => {
                    handleScrollBySlice(event?.target?.scrollTop || 0)
                }}>
                    <table className='apex-table'>
                        <ApexColgroup
                            showLineNumber={showLineNumber}
                            allowSelect={allowSelect}
                            columns={apexBodyColumns}
                        />
                        {
                            tableTitle && <caption>{tableTitle}</caption>
                        }
                        <ApexThead
                            rowHeight={rowHeight}
                            allowResize={allowResize}
                            allowSelect={allowSelect}
                            allowFixed={allowFixed}
                            allowColumnDrag={allowColumnDrag}
                            allowSort={allowSort}
                            showLineNumber={showLineNumber}
                            showHeaderCheckBox={showHeaderCheckBox}
                            indeterminate={indeterminate}
                            onHeaderCheckBoxChange={onHeaderCheckBoxChange}
                            columns={apexColumns}
                            originColumns={columns}
                            isSingle={isSingle}
                            headerChecked={headerChecked}
                            onColWidthChange={handleColWidthChange}
                            showColumnConfig={showColumnConfig}
                            onChangeColumns={columns => {
                                flushSync(() => {
                                    setApexColumns(columns)
                                })
                            }}
                            onColumnSort={(column, sortType) => {
                                handleColumnSort(column, sortType);
                            }}
                        />
                        <ApexTbody
                            {...props}
                            rowKey={rowKey}
                            startIndex={startIndex}
                            endIndex={endIndex}
                            rowHeight={rowHeight}
                            tableDataSource={tableDataSource}
                            totalHeight={(pageDataSource.length - 1) * rowHeight}
                            renderCount={renderCount}
                            tableDivRef={tableDivRef}
                            columns={apexBodyColumns}
                            apexColumns={apexColumns}
                            dataSource={pageDataSource.slice(startIndex, endIndex)}
                            showLineNumber={showLineNumber}
                            showSummary={showSummary}
                            summaryData={summaryData}
                            allowSelect={allowSelect}
                            allowFixed={allowFixed}
                            allowRowDrag={allowRowDrag}
                            allowRowAddDel={allowRowAddDel}
                            readOnly={readOnly}
                            onRowSelected={handleRowSelected}
                            onCellClick={handleInputFocus}
                            onChange={handleChangeCellValue}
                            onFocus={handleInputFocus}
                            onSetRef={(inputRef, refKey) => {
                                editRefs.current[refKey] = inputRef;
                                return inputRef;
                            }}
                            onEnter={() => onArrowRight(0, '')}
                            insertRows={insertRows}
                            deleteRow={deleteRow}
                            onChangeTableData={newTableDataSource => {
                                flushSync(() => {
                                    setTableDataSource(newTableDataSource);
                                })
                            }}
                        />
                        {
                            showSummary && <ApexTrSummary
                                {...props as any}
                                dataSourceItem={{
                                    rowIndex: tableDataSource.length
                                }}
                                summaryData={summaryData}
                            />
                        }
                    </table>
                </div>
                <ApexPagination
                    {...pagination}
                    currentPage={currentPage}
                    pageSize={pageSize}
                    total={total}
                    showPagination={showPagination}
                    pagination={pagination}
                    onChange={(page, pageSize) => {
                        pagination?.onChange && pagination.onChange(page, pageSize)
                        setCurrentPage(page);
                        setPageSize(pageSize);
                    }}
                />
            </div>
        </Spin>
    </ConfigProvider>
});

export default ApexTable;
