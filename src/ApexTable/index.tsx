import React, { ReactNode, type FC, useState, useEffect, useRef } from 'react';
import "./index.less"
import { Checkbox, ConfigProvider, DatePicker, Input, ModalFuncProps, Pagination, PaginationProps } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import dayjs from 'dayjs';
import zh_CN from 'antd/es/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import { ApexModalRef } from './types/ApexModal';
import ApexTdWrap from './components/ApexTdWrap';
import ApexTableInput from './components/ApexTableInput';
import ApexTableSelect from './components/ApexTableSelect';
import ApexModal from './components/ApexModal';
import hotkeys from 'hotkeys-js';
export interface ApexTableProps<T> {
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

}

/**
 * 表格列的配置描述
 */
export interface IApexTableColumns<T> {
    title: string;
    name: keyof T;
    columnType?: 'input' | 'inputNumber' | 'datePicker' | 'rangePicker' | 'select' | 'modal' | 'customer';
    options?: any[] | ((value: any, row: any) => any);
    defaultValue?: any;
    width?: number;
    showTime?: boolean;
    onChange?: (value: any, option?: any, options?: any) => void;
    onFormatter?: (row?: any, value?: any) => React.ReactNode;
    modalOptions?: (row: any, value: any, modalRef: React.RefObject<ApexModalRef>) => ModalFuncProps;
}

const ApexTable: FC<ApexTableProps<any>> = (props) => {


    const {
        allowSelect = false,
        columns = [],
        dataSource = [],
        showHeaderCheckBox = false,
        tableTitle = false,
        showPagination = false,
        pagination = {}
    } = props;

    /**
     * 可编辑单元格的 Ref
     */
    const editRefs = useRef<any>({});

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
        const tempCheck: any[] = [...checkedData];
        const tempTableDataSource: any[] = [...tableDataSource];
        const findRowIndex = tempCheck.findIndex(item => item['apexTableId'] === row['apexTableId']);
        const findTableIndex = tempTableDataSource.findIndex(item => item['apexTableId'] === row['apexTableId']);
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
        const find = columns.find(item => !item.columnType || item.columnType !== 'customer');
        if (find) {
            setFocusRowIndex(0);
            setFocusColumnName(find.name)
        }
    }, []);

    useEffect(() => {
        const key = `${focusRowIndex}-${String(focusColumnName)}`;
        console.log("key", key, editRefs)
        editRefs.current?.[key]?.focus();
    }, [focusRowIndex, focusColumnName]);



    return <ConfigProvider locale={zh_CN}>
        <div className='apex-table-container' tabIndex={0} onKeyDown={event => {
            console.log("111111111", event)
        }}>
            <div className='apex-table-content'>
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
                                showHeaderCheckBox ? <th className='apex-table-thead-th'>
                                    <Checkbox checked={headerChecked} indeterminate={indeterminate} onChange={onHeaderCheckBoxChange} />
                                </th> : <th>

                                </th>
                            }
                            {
                                columns.map((item, index) => {
                                    return <th key={`${String(item.name)}-${index}`} className='apex-table-thead-th'>
                                        {item['title']}
                                    </th>
                                })
                            }
                        </tr>
                    </thead>
                    <tbody className='apex-table-tbody'>
                        {
                            pageDataSource.map((dataSourceItem, dataSourceIndex) => {
                                return <tr key={`apex-table-tbody-tr-${dataSourceIndex}`} className='apex-table-tbody-tr'>
                                    {
                                        allowSelect && <td className='apex-table-tbody-td apex-table-tbody-td-checkbox'>
                                            <Checkbox checked={dataSourceItem?.['apexTableChecked']} onChange={(event) => handleRowSelected(event, dataSourceItem)} />
                                        </td>
                                    }
                                    {
                                        columns.map((columnItem, columnIndex) => {
                                            const { columnType = 'input', showTime = false } = columnItem;
                                            const columnValue = dataSourceItem[columnItem['name']];
                                            const refKey = `${dataSourceIndex}-${String(columnItem.name)}`;
                                            switch (columnType) {
                                                case 'input':
                                                    return <ApexTdWrap key={`${String(columnItem.name)}-${columnIndex}`}>
                                                        <ApexTableInput
                                                            ref={inputRef => editRefs.current[refKey] = inputRef}
                                                            defaultValue={columnValue}
                                                            onInputChange={inputValue => {
                                                                handleChangeCellValue(dataSourceItem, columnItem['name'], inputValue);
                                                            }}
                                                            onFocus={() => {
                                                                editRefs.current?.[refKey]?.select();
                                                            }}
                                                        />
                                                    </ApexTdWrap>;
                                                case 'inputNumber':
                                                    return <ApexTdWrap key={`${String(columnItem.name)}-${columnIndex}`}>
                                                        <ApexTableInput
                                                            ref={inputRef => editRefs.current[refKey] = inputRef}
                                                            defaultValue={columnValue}
                                                            onInputChange={inputValue => {
                                                                handleChangeCellValue(dataSourceItem, columnItem['name'], inputValue);
                                                            }}
                                                            onFocus={() => {
                                                                editRefs.current?.[refKey]?.select();
                                                            }}
                                                        />
                                                    </ApexTdWrap>;
                                                case 'select':
                                                    return <ApexTableSelect
                                                        key={`${String(columnItem.name)}-${columnIndex}`}
                                                        ref={inputRef => editRefs.current[refKey] = inputRef}
                                                        columnItem={columnItem}
                                                        dataSourceItem={dataSourceItem}
                                                        onSelectChange={handleSelectChange}
                                                    />
                                                case 'datePicker':
                                                    return <ApexTdWrap key={`${String(columnItem.name)}-${columnIndex}`}>
                                                        <DatePicker
                                                            showTime={showTime}
                                                            defaultValue={dayjs(columnValue)}
                                                            onChange={(date, dateString) => handleDatePickerChange(dataSourceItem, columnItem.name, date, dateString)}
                                                            ref={inputRef => editRefs.current[refKey] = inputRef}
                                                        />
                                                    </ApexTdWrap>
                                                case 'rangePicker':
                                                    return <ApexTdWrap key={`${String(columnItem.name)}-${columnIndex}`} >
                                                        <DatePicker.RangePicker
                                                            showTime={showTime}
                                                            defaultValue={[dayjs(columnValue[0]), dayjs(columnValue[1])]} onChange={(date, dateString) => handleRangePickerChange(dataSourceItem, columnItem.name, date, dateString)}
                                                            ref={inputRef => editRefs.current[refKey] = inputRef}
                                                        />
                                                    </ApexTdWrap>
                                                case 'modal':
                                                    return <ApexModal
                                                        ref={(modalRef: any) => editRefs.current[refKey] = modalRef}
                                                        key={`${String(columnItem.name)}-${columnIndex}`}
                                                        columnItem={columnItem}
                                                        dataSourceItem={dataSourceItem}
                                                        columnValue={columnValue}
                                                        onInputChange={inputValue => {
                                                            handleChangeCellValue(dataSourceItem, columnItem['name'], inputValue);
                                                        }}
                                                        onFocus={() => {
                                                            editRefs.current?.[refKey]?.select();
                                                        }}
                                                    />
                                                case 'customer':
                                                    const { onFormatter } = columnItem;
                                                    return <ApexTdWrap key={`${String(columnItem.name)}-${columnIndex}`}>
                                                        {
                                                            onFormatter?.(dataSourceItem, dataSourceItem[columnItem.name])
                                                        }
                                                    </ApexTdWrap>
                                                default:
                                                    return <ApexTdWrap key={`${String(columnItem.name)}-${columnIndex}`}>
                                                        <Input value={columnValue} />
                                                    </ApexTdWrap>
                                            }
                                        })
                                    }
                                </tr>
                            })
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
