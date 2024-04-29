import React, { ReactNode, type FC, useState, useEffect, useRef } from 'react';
import "./index.less"
import { Checkbox, ConfigProvider, DatePicker, Empty, Input, ModalFuncProps, Pagination, PaginationProps, message } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import dayjs from 'dayjs';
import zh_CN from 'antd/es/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import { ApexModalRef } from './types/ApexModal';
import ApexTdWrap from './components/ApexTdWrap';
import ApexTableInput from './components/ApexTableInput';
import ApexTableSelect from './components/ApexTableSelect';
import ApexModal from './components/ApexModal';
import ApexShowCell from './components/ApexShowCell';
import ApexShowCellChildren from './components/ApexShowCellChildren';

export interface ApexTableProps<T> {
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
    dataSource: T[];

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

}

/**
 * 表格列的配置描述
 */
export interface IApexTableColumns<T> {
    title: string;
    name: keyof T;
    columnType?: IColumnType;
    options?: any[] | ((value: any, row: any) => any);
    defaultValue?: any;
    width?: number;
    showTime?: boolean;
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

export interface IRow {
    rowIndex: number;
    columnName: unknown;
}

const ApexTable: FC<ApexTableProps<any>> = (props) => {


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
        allowFixed = false
    } = props;

    /**
     * 可编辑单元格的 Ref
     */
    const editRefs = useRef<any>({});

    const tableDivRef = useRef<HTMLDivElement>(null);

    /**
     * 当前聚焦的行
     */
    const [focusRowIndex, setFocusRowIndex] = useState(-1);

    /**
     * 当前聚焦的列名
     */
    const [focusColumnName, setFocusColumnName] = useState<any>('');

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
        const findRowIndex = tempCheck.findIndex(item => item['apexTableId'] === row['apexTableId']);
        const findTableIndex = tempTableDataSource.findIndex(item => item['apexTableId'] === row['apexTableId']);
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
            if (checkedData.length === dataSource.length) {
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
        handleChangeCellValue(row, columnName, date);
        onChange && onChange(date, dateString);
    }

    const handleRangePickerChange = (row: any, columnName: any, date: any, dateString: [string, string], onChange?: (date: dayjs.Dayjs | null, dateString: [string, string]) => void) => {
        handleChangeCellValue(row, columnName, date);
        onChange && onChange(date, dateString);
    }

    /**
     * 改变单元格的值
     * @param row           当前行信息
     * @param columnName    单元格列名
     * @param value         新值
     */
    const handleChangeCellValue = (row: any, columnName: any, value: any) => {
        const tempTableDataSource: any[] = [...tableDataSource];
        const findIndex = tempTableDataSource.findIndex((item: any) => item?.apexTableId === row?.apexTableId);
        if (findIndex > -1) {
            tempTableDataSource[findIndex][columnName] = value;
            setTableDataSource(tempTableDataSource);
        }
    }

    /**
     * 初始化外部传入的数据源
     */
    const initOuterDataSource = () => {
        const data: any[] = [...dataSource];
        data.forEach((item, index) => {
            item['apexTableId'] = index;
            item['apexTableChecked'] = false;
        });
        setCurrentPage(1);
        if (showPagination) {
            setTotal(data.length);
            setPageSize(pagination?.pageSize ? pagination.pageSize : 10);
        } else {
            setPageSize(data.length);
        }
        setTableDataSource(data);
    }

    /**
     * 初始化分页数据
     */
    const initPageDadaSource = () => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = currentPage * pageSize;
        const newArray: any[] = tableDataSource.slice(startIndex, endIndex);
        setPageDataSource(newArray);
    }

    /**
     * 聚焦可编辑单元格
     * @param rowIndex  行号
     * @param rowName   列名
     */
    const handleFocusEditAbleCell = (rowInfo: IRow) => {
        const name = `${rowInfo.rowIndex}-${rowInfo.columnName}`;
        const findRefName = Object.keys(editRefs.current).find(key => key === name);
        if (findRefName) {
            editRefs.current?.[findRefName]?.input?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            editRefs.current?.[findRefName]?.focus({ preventScroll: true });
            const tableTop = tableDivRef.current?.getBoundingClientRect().top;
            const td = document.getElementById(`td-${findRefName}`);
            const tdHeight = td?.getBoundingClientRect().height || 0;
            const tdTop = td?.getBoundingClientRect().top || 0;
            if (tableTop && td && tdTop - tableTop < tdHeight) {
                debugger;
                tableDivRef.current.scrollTop = tableDivRef.current.scrollTop - tdHeight;
            }
        }
    }

    /**
     * 组件聚焦时触发
     * @param rowIndex   行下标
     * @param columnName 列名
     */
    const handleFocus = (rowInfo: IRow, columnType: IColumnType) => {
        setFocusRowIndex(rowInfo.rowIndex)
        setFocusColumnName(rowInfo.columnName);
    }

    /**
     * 组件失焦时触发
     * @param rowInfo 
     * @param columnType 
     */
    const handleBlur = (rowInfo: IRow, columnType: IColumnType) => {
        onCheckAllLoseFocus();
    }

    /**
     * 检查是否所有组件都失去焦点
     */
    const onCheckAllLoseFocus = () => {
        const activeElement = document.activeElement;
        const findFocus = Object.keys(editRefs.current).find(item => editRefs.current[item] === activeElement);
        if (!findFocus) {
            setFocusRowIndex(-1);
            setFocusColumnName("");
        }
    }

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
                const indexUp = focusRowIndex - 1;
                if (indexUp < 0) {
                    setFocusRowIndex(0);
                } else {
                    setFocusRowIndex(prev => prev - 1);
                }
                break;
            case 'ArrowDown':
                const indexDown = focusRowIndex + 1;
                if (indexDown > pageDataSource.length - 1) {
                    setFocusRowIndex(pageDataSource.length - 1);
                } else {
                    setFocusRowIndex(prev => prev + 1);
                }
                break;
            case 'ArrowLeft':
                if (cursorPosition === 0) {
                    const findIndex = columns.findIndex(item => item.name === focusColumnName);
                    if (findIndex > 0) {
                        let findColumn;
                        for (let i = findIndex - 1; i > -1; i--) {
                            const item = columns[i];
                            if ((item.columnType !== 'customer' || !item.columnType) && !item.readOnly) {
                                findColumn = item;
                                break;
                            }
                        }
                        if (!findColumn) {
                            for (let i = columns.length - 1; i > findIndex; i--) {
                                const item = columns[i];
                                if ((item.columnType !== 'customer' || !item.columnType) && !item.readOnly) {
                                    findColumn = item;
                                    break;
                                }
                            }
                        }
                        if (findColumn) {
                            setFocusColumnName(findColumn.name);
                        }
                    } else {
                        if (focusRowIndex > 0) {
                            setFocusRowIndex(prev => prev - 1);
                        }
                        let findColumn;
                        for (let i = columns.length - 1; i > findIndex; i--) {
                            const item = columns[i];
                            if ((item.columnType !== 'customer' || !item.columnType) && !item.readOnly) {
                                findColumn = item;
                                break;
                            }
                        }
                        if (findColumn) {
                            setFocusColumnName(findColumn.name);
                        }
                    }
                }
                break;
            case 'ArrowRight':
                if (cursorPosition === eventValue.length) {
                    const findIndex = columns.findIndex(item => {
                        return item.name === focusColumnName;
                    });

                    // 最后一个可编辑列
                    let findLastEditIndex = -1;
                    for (let i = columns.length - 1; i > -1; i--) {
                        const item = columns[i];
                        if ((item.columnType !== 'customer' || !item.columnType) && !item.readOnly) {
                            findLastEditIndex = i;
                            break;
                        }
                    }
                    if (findIndex === findLastEditIndex) {
                        if (focusRowIndex === pageDataSource.length - 1) {
                            setFocusRowIndex(0);
                        } else {
                            setFocusRowIndex(prev => prev + 1);
                        }
                        let findColumn;
                        for (let i = 0; i < columns.length - 1; i++) {
                            const item = columns[i];
                            if ((item.columnType !== 'customer' || !item.columnType) && !item.readOnly) {
                                findColumn = item;
                                break;
                            }
                        }
                        if (findColumn) {
                            setFocusColumnName(findColumn.name);
                        }
                    } else {
                        let findColumn;
                        for (let i = findIndex + 1; i < columns.length; i++) {
                            const item = columns[i];
                            if ((item.columnType !== 'customer' || !item.columnType) && !item.readOnly) {
                                findColumn = item;
                                break;
                            }
                        }
                        if (!findColumn) {
                            for (let i = 0; i < findIndex; i++) {
                                const item = columns[i];
                                if ((item.columnType !== 'customer' || !item.columnType) && !item.readOnly) {
                                    findColumn = item;
                                    break;
                                }
                            }
                        }
                        if (findColumn) {
                            setFocusColumnName(findColumn.name);
                        }
                    }
                }
                break;
        }
    }

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
        handleFocusEditAbleCell({ rowIndex: focusRowIndex, columnName: focusColumnName });
    }, [focusRowIndex, focusColumnName]);

    return <ConfigProvider locale={zh_CN}>
        <div className='apex-table-container' style={{ height: height }} onKeyDown={onApexTableKeyDown}>
            <div className='apex-table-content' ref={tableDivRef}>
                <table className='apex-table'>
                    <colgroup>
                        {
                            allowSelect && <col style={{ width: 50 }}></col>
                        }
                        {
                            columns.map((item, index) => {
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
                                showHeaderCheckBox ? <th className='apex-table-thead-th apex-table-thead-th-checkbox'>
                                    <Checkbox disabled={isSingle} checked={headerChecked} indeterminate={indeterminate} onChange={onHeaderCheckBoxChange} />
                                </th> : null
                            }
                            {
                                columns.map((item, index) => {
                                    return <th key={`${String(item.name)}-${index}`} className={`apex-table-thead-th ${allowFixed && item.fixed ? 'apex-table-thead-fixed-' + item.fixed : ''}`}>
                                        {item['title']}
                                    </th>
                                })
                            }
                        </tr>
                    </thead>
                    <tbody className='apex-table-tbody'>
                        {
                            pageDataSource.length > 0 ? pageDataSource.map((dataSourceItem, dataSourceIndex) => {
                                return <tr key={`apex-table-tbody-tr-${dataSourceIndex}`} className='apex-table-tbody-tr'>
                                    {
                                        allowSelect && <td className='apex-table-tbody-td apex-table-tbody-td-checkbox'>
                                            <Checkbox checked={dataSourceItem?.['apexTableChecked']} onChange={(event) => handleRowSelected(event, dataSourceItem)} />
                                        </td>
                                    }
                                    {
                                        columns.map((columnItem, columnIndex) => {
                                            const { columnType = 'input', showTime = false, onRender } = columnItem;
                                            const readOnlyResult = columnItem.hasOwnProperty("readOnly") ? columnItem.readOnly : readOnly;
                                            const columnValue = dataSourceItem[columnItem['name']];
                                            const refKey = `${dataSourceIndex}-${String(columnItem.name)}`;
                                            const showKey = `${focusRowIndex}-${focusColumnName}`;
                                            if (showKey !== refKey && columnType !== 'customer') {
                                                return <ApexTdWrap id={`td-${refKey}`} apexTableProps={props} apexColumn={columnItem} key={`${String(columnItem.name)}-${columnIndex}`}>
                                                    <ApexShowCell key={`${String(columnItem.name)}-${columnIndex}`} onClick={() => {
                                                        if (!readOnlyResult) {
                                                            handleFocus({ rowIndex: dataSourceIndex, columnName: columnItem.name }, 'input')
                                                        }
                                                    }}>
                                                        {onRender ? onRender(columnItem, columnValue) : <ApexShowCellChildren columnItem={columnItem} dataSourceItem={dataSourceItem} />}
                                                    </ApexShowCell>
                                                </ApexTdWrap>
                                            }
                                            switch (columnType) {
                                                case 'input':
                                                    return <ApexTdWrap id={`td-${refKey}`} apexTableProps={props} apexColumn={columnItem} key={`${String(columnItem.name)}-${columnIndex}`}>
                                                        <ApexTableInput
                                                            ref={inputRef => {
                                                                if (!readOnlyResult) {
                                                                    editRefs.current[refKey] = inputRef;
                                                                }
                                                            }}
                                                            defaultValue={columnValue}
                                                            onInputChange={inputValue => {
                                                                handleChangeCellValue(dataSourceItem, columnItem['name'], inputValue);
                                                            }}
                                                            onFocus={() => {
                                                                requestAnimationFrame(() => {
                                                                    editRefs.current?.[refKey]?.select();
                                                                })
                                                                handleFocus({ rowIndex: dataSourceIndex, columnName: columnItem.name }, 'input')
                                                            }}
                                                            onBlur={() => {
                                                                handleBlur({ rowIndex: dataSourceIndex, columnName: columnItem.name }, 'input')
                                                            }}
                                                        />
                                                    </ApexTdWrap>
                                                case 'inputNumber':
                                                    return <ApexTdWrap id={`td-${refKey}`} apexTableProps={props} apexColumn={columnItem} key={`${String(columnItem.name)}-${columnIndex}`}>
                                                        <ApexTableInput
                                                            ref={inputRef => {
                                                                if (!readOnlyResult) {
                                                                    editRefs.current[refKey] = inputRef;
                                                                }
                                                            }}
                                                            defaultValue={columnValue}
                                                            onInputChange={inputValue => {
                                                                handleChangeCellValue(dataSourceItem, columnItem['name'], inputValue);
                                                            }}
                                                            onFocus={() => {
                                                                requestAnimationFrame(() => {
                                                                    editRefs.current?.[refKey]?.select();
                                                                })
                                                                handleFocus({ rowIndex: dataSourceIndex, columnName: columnItem.name }, 'inputNumber')
                                                            }}
                                                            onBlur={() => {
                                                                handleBlur({ rowIndex: dataSourceIndex, columnName: columnItem.name }, 'input')
                                                            }}
                                                        />
                                                    </ApexTdWrap>;
                                                case 'select':
                                                    return <ApexTableSelect
                                                        tdId={`td-${refKey}`}
                                                        key={`${String(columnItem.name)}-${columnIndex}`}
                                                        ref={inputRef => {
                                                            if (!readOnlyResult) {
                                                                editRefs.current[refKey] = inputRef;
                                                            }
                                                        }}
                                                        columnItem={columnItem}
                                                        apexTableProps={props}
                                                        dataSourceItem={dataSourceItem}
                                                        onSelectChange={handleSelectChange}
                                                        onFocus={() => {
                                                            requestAnimationFrame(() => {
                                                                document.execCommand('selectAll', false, undefined);
                                                            })
                                                            handleFocus({ rowIndex: dataSourceIndex, columnName: columnItem.name }, 'select')
                                                        }}
                                                        onBlur={() => {
                                                            handleBlur({ rowIndex: dataSourceIndex, columnName: columnItem.name }, 'input')
                                                        }}
                                                    />
                                                case 'datePicker':
                                                    return <ApexTdWrap id={`td-${refKey}`} apexTableProps={props} apexColumn={columnItem} key={`${String(columnItem.name)}-${columnIndex}`}>
                                                        <DatePicker
                                                            showTime={showTime}
                                                            defaultValue={dayjs(columnValue)}
                                                            onChange={(date, dateString) => handleDatePickerChange(dataSourceItem, columnItem.name, date, dateString)}
                                                            ref={inputRef => {
                                                                if (!readOnlyResult) {
                                                                    editRefs.current[refKey] = inputRef;
                                                                }
                                                            }}
                                                            onFocus={() => {
                                                                requestAnimationFrame(() => {
                                                                    document.execCommand('selectAll', false, undefined);
                                                                })
                                                                handleFocus({ rowIndex: dataSourceIndex, columnName: columnItem.name }, 'datePicker')
                                                            }}
                                                            onBlur={() => {
                                                                handleBlur({ rowIndex: dataSourceIndex, columnName: columnItem.name }, 'input')
                                                            }}
                                                        />
                                                    </ApexTdWrap>
                                                case 'rangePicker':
                                                    return <ApexTdWrap id={`td-${refKey}`} apexTableProps={props} apexColumn={columnItem} key={`${String(columnItem.name)}-${columnIndex}`} >
                                                        <DatePicker.RangePicker
                                                            showTime={showTime}
                                                            defaultValue={[dayjs(columnValue[0]), dayjs(columnValue[1])]} onChange={(date, dateString) => handleRangePickerChange(dataSourceItem, columnItem.name, date, dateString)}
                                                            ref={inputRef => {
                                                                if (!readOnlyResult) {
                                                                    editRefs.current[refKey] = inputRef;
                                                                }
                                                            }}
                                                            onFocus={() => {
                                                                requestAnimationFrame(() => {
                                                                    document.execCommand('selectAll', false, undefined);
                                                                })
                                                                handleFocus({ rowIndex: dataSourceIndex, columnName: columnItem.name }, 'rangePicker')
                                                            }}
                                                            onBlur={() => {
                                                                handleBlur({ rowIndex: dataSourceIndex, columnName: columnItem.name }, 'input')
                                                            }}
                                                        />
                                                    </ApexTdWrap>
                                                case 'modal':
                                                    return <ApexModal
                                                        tdId={`td-${refKey}`}
                                                        ref={inputRef => {
                                                            if (!readOnlyResult) {
                                                                editRefs.current[refKey] = inputRef;
                                                            }
                                                        }}
                                                        key={`${String(columnItem.name)}-${columnIndex}`}
                                                        columnItem={columnItem}
                                                        apexTableProps={props}
                                                        dataSourceItem={dataSourceItem}
                                                        columnValue={columnValue}
                                                        onInputChange={inputValue => {
                                                            handleChangeCellValue(dataSourceItem, columnItem['name'], inputValue);
                                                        }}
                                                        onFocus={() => {
                                                            requestAnimationFrame(() => {
                                                                editRefs.current?.[refKey]?.select();
                                                            })
                                                            handleFocus({ rowIndex: dataSourceIndex, columnName: columnItem.name }, 'modal')
                                                        }}
                                                        onBlur={() => {
                                                            handleBlur({ rowIndex: dataSourceIndex, columnName: columnItem.name }, 'input')
                                                        }}
                                                    />
                                                case 'customer':
                                                    const { onFormatter } = columnItem;
                                                    return <ApexTdWrap id={`td-${refKey}`} apexTableProps={props} apexColumn={columnItem} key={`${String(columnItem.name)}-${columnIndex}`}>
                                                        {
                                                            onFormatter?.(dataSourceItem, dataSourceItem[columnItem.name])
                                                        }
                                                    </ApexTdWrap>
                                                default:
                                                    return <ApexTdWrap id={`td-${refKey}`} apexTableProps={props} apexColumn={columnItem} key={`${String(columnItem.name)}-${columnIndex}`}>
                                                        <Input
                                                            ref={inputRef => {
                                                                if (!readOnlyResult) {
                                                                    editRefs.current[refKey] = inputRef;
                                                                }
                                                            }}
                                                            value={columnValue}
                                                            onFocus={() => {
                                                                requestAnimationFrame(() => {
                                                                    editRefs.current?.[refKey]?.select();
                                                                })
                                                                handleFocus({ rowIndex: dataSourceIndex, columnName: columnItem.name }, 'input')
                                                            }}
                                                            onBlur={() => {
                                                                handleBlur({ rowIndex: dataSourceIndex, columnName: columnItem.name }, 'input')
                                                            }}
                                                        />
                                                    </ApexTdWrap>
                                            }
                                        })
                                    }
                                </tr>
                            }) : <tr>
                                <td colSpan={columns.length}>
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
    </ConfigProvider >
};

export default ApexTable;
