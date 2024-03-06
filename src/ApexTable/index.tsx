import React, { ReactNode, type FC, useState, useEffect, useRef } from 'react';
import "./index.less"
import { Checkbox, DatePicker, Input, Modal, ModalFuncProps, Select } from 'antd';
import { apexDeepClone } from './utils/tool';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import dayjs from 'dayjs';
import locale from 'antd/es/date-picker/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import { ApexModalRef } from './types/ApexModal';
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

}

/**
 * 表格列的配置描述
 */
export interface IApexTableColumns<T> {
    title: string;
    name: keyof T;
    columnType?: 'input' | 'datePicker' | 'rangePicker' | 'select' | 'modal' | 'customer';
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
        tableTitle = false
    } = props;

    const modalRef = useRef<ApexModalRef>();


    /**
     * 表格数据源
     */
    const [tableDataSource, setTableDataSource] = useState<any[]>([]);

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
        const tempTableDataSource: any[] = apexDeepClone(tableDataSource);
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
        const tempCheck: any[] = apexDeepClone(checkedData);
        const tempTableDataSource: any[] = apexDeepClone(tableDataSource);
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
     * 初始化外部传入的数据源
     */
    const initOuterDataSource = () => {
        const data: any[] = apexDeepClone(dataSource);
        data.forEach((item, index) => {
            item['apexTableId'] = index;
            item['apexTableChecked'] = false;
        });
        setTableDataSource(data);
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
        const tempTableDataSource: any[] = apexDeepClone(tableDataSource);
        const findIndex = tempTableDataSource.findIndex((item: any) => item?.apexTableId === row?.apexTableId);
        if (findIndex > -1) {
            tempTableDataSource[findIndex][columnName] = value;
            setTableDataSource(tempTableDataSource);
        }
    }

    useEffect(() => {
        initOuterDataSource();
    }, [dataSource]);

    useEffect(() => {
        onChangeHeaderCheckBoxIndeter();
    }, [checkedData, dataSource]);

    return <div className='apex-table-container'>
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
                        tableDataSource.map((dataSourceItem, dataSourceIndex) => {
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
                                        switch (columnType) {
                                            case 'input':
                                                return <td key={`${String(columnItem.name)}-${columnIndex}`} className='apex-table-tbody-td'>
                                                    <Input
                                                        defaultValue={columnValue}
                                                        onBlur={inputEvent => {
                                                            const inputValue = inputEvent.target.value;
                                                            handleChangeCellValue(dataSourceItem, columnItem['name'], inputValue);
                                                        }}
                                                    />
                                                </td>;
                                            case 'select':
                                                const { options, defaultValue, onChange } = columnItem;
                                                let selectOption = [];
                                                if (typeof options === 'object') {
                                                    selectOption = options;
                                                } else if (typeof options === 'function') {
                                                    selectOption = options(dataSourceItem[columnItem.name], dataSourceItem)
                                                }
                                                return <td key={`${String(columnItem.name)}-${columnIndex}`} className='apex-table-tbody-td'>
                                                    <Select
                                                        defaultValue={defaultValue}
                                                        value={dataSourceItem[columnItem.name]}
                                                        onChange={(value, option) => handleSelectChange(dataSourceItem, columnItem.name, value, option, options, onChange)}
                                                        options={selectOption}
                                                        allowClear
                                                    />
                                                </td>
                                            case 'datePicker':
                                                return <td key={`${String(columnItem.name)}-${columnIndex}`} className='apex-table-tbody-td'>
                                                    <DatePicker locale={locale} showTime={showTime} defaultValue={dayjs(columnValue)} onChange={(date, dateString) => handleDatePickerChange(dataSourceItem, columnItem.name, date, dateString)} />
                                                </td>
                                            case 'rangePicker':
                                                return <td key={`${String(columnItem.name)}-${columnIndex}`} className='apex-table-tbody-td'>
                                                    <DatePicker.RangePicker locale={locale} showTime={showTime} defaultValue={[dayjs(columnValue[0]), dayjs(columnValue[1])]} onChange={(date, dateString) => handleRangePickerChange(dataSourceItem, columnItem.name, date, dateString)} />
                                                </td>
                                            case 'modal':
                                                const { modalOptions } = columnItem;
                                                if (modalOptions) {
                                                    const {
                                                        title,
                                                        content,
                                                        icon = null,
                                                        okText = '确定',
                                                        cancelText = '取消',
                                                        footer = null,
                                                        closable = true,
                                                        onOk,
                                                        onCancel,
                                                        ...modalProps
                                                    } = modalOptions(dataSourceItem, dataSourceItem[columnItem.name], modalRef as unknown as any);
                                                    return <td key={`${String(columnItem.name)}-${columnIndex}`} className='apex-table-tbody-td'>
                                                        <Input
                                                            defaultValue={columnValue}
                                                            onBlur={inputEvent => {
                                                                const inputValue = inputEvent.target.value;
                                                                handleChangeCellValue(dataSourceItem, columnItem['name'], inputValue);
                                                            }}
                                                            onDoubleClick={() => {
                                                                modalRef.current = Modal.info({
                                                                    title,
                                                                    icon,
                                                                    content,
                                                                    okText,
                                                                    cancelText,
                                                                    footer,
                                                                    closable,
                                                                    onOk,
                                                                    onCancel,
                                                                    ...modalProps
                                                                });
                                                            }}
                                                        />
                                                    </td>
                                                } else {
                                                    return <td key={`${String(columnItem.name)}-${columnIndex}`} className='apex-table-tbody-td'>
                                                        <Input
                                                            defaultValue={columnValue}
                                                            onBlur={inputEvent => {
                                                                const inputValue = inputEvent.target.value;
                                                                handleChangeCellValue(dataSourceItem, columnItem['name'], inputValue);
                                                            }}
                                                        />
                                                    </td>
                                                }
                                            case 'customer':
                                                const { onFormatter } = columnItem;
                                                return <td key={`${String(columnItem.name)}-${columnIndex}`} className='apex-table-tbody-td'>
                                                    {
                                                        onFormatter?.(dataSourceItem, dataSourceItem[columnItem.name])
                                                    }
                                                </td>
                                            default:
                                                return <td key={`${String(columnItem.name)}-${columnIndex}`} className='apex-table-tbody-td'>
                                                    <Input value={columnValue} />
                                                </td>
                                        }
                                    })
                                }
                            </tr>
                        })
                    }
                </tbody>
            </table>
        </div>
    </div>
};

export default ApexTable;
