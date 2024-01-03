import React, { ReactNode, type FC, useState, useEffect } from 'react';
import "./index.less"
import { Checkbox, Input } from 'antd';
import { apexDeepClone } from './utils/tool';
import { CheckboxChangeEvent } from 'antd/es/checkbox';

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
    columnType?: 'input' | 'date' | 'dropdown' | 'customer'
}

const ApexTable: FC<ApexTableProps<any>> = (props) => {

    const {
        allowSelect = false,
        columns = [],
        dataSource = [],
        showHeaderCheckBox = false,
        tableTitle = false
    } = props;

    /**
     * 表格数据源
     */
    const [tableDataSource, setTableDataSource] = useState<any[]>([]);

    /**
     * 表格选中的数据
     */
    const [checkedData, setCheckedData] = useState<any[]>([]);

    /**
     * 表头复选框改变事件
     * @param event 
     */
    const onHeaderCheckBoxChange = (event: CheckboxChangeEvent) => {
        const eventValue = event.target.checked;
        if (eventValue) {
            setCheckedData(tableDataSource);
        } else {
            setCheckedData([]);
        }
    }

    /**
     * 行选中事件
     */
    const handleRowSelected = (event: CheckboxChangeEvent, row: any) => {
        const eventValue = event.target.checked;
        const tempCheck: any[] = apexDeepClone(checkedData);
        const findRowIndex = tempCheck.findIndex(item => item['apexTableId'] === row['apexTableId']);
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
    }

    /**
     * 初始化外部传入的数据源
     */
    const initOuterDataSource = () => {
        const data: any[] = apexDeepClone(dataSource);
        data.forEach((item, index) => {
            item['apexTableId'] =  index;
        });
        setTableDataSource(data);
    }

    useEffect(() => {
        initOuterDataSource();
    }, [dataSource]);

    return <div className='apex-table-container'>
        <div className='apex-table-content'>
            <table className='apex-table'>
                <colgroup>

                </colgroup>
                {
                    tableTitle && <caption>{tableTitle}</caption>
                }
                <thead className='apex-table-thead'>
                    <tr>
                        {
                            showHeaderCheckBox ? <th>
                                <Checkbox onChange={onHeaderCheckBoxChange} />
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
                            return <tr key={dataSourceIndex} className='apex-table-tbody-tr'>
                                {
                                    allowSelect && <td className='apex-table-tbody-td'>
                                        <Checkbox onChange={(event) => handleRowSelected(event, dataSourceItem)} />
                                    </td>
                                }
                                {
                                    columns.map((columnItem, columnIndex) => {
                                        const { columnType = 'input' } = columnItem;
                                        const columnValue = dataSourceItem[columnItem['name']];
                                        switch (columnType) {
                                            case 'input':
                                                return <td key={`${String(columnItem.name)}-${columnIndex}`} className='apex-table-tbody-td'>
                                                    <Input
                                                        defaultValue={columnValue}
                                                        onBlur={inputEvent => {
                                                            const inputValue = inputEvent.target.value;
                                                            const tempDataSource: any[] = apexDeepClone(tableDataSource);
                                                            if (inputValue !== tempDataSource[dataSourceIndex][columnItem['name']]) {
                                                                tempDataSource[dataSourceIndex][columnItem['name']] = inputValue;
                                                                setTableDataSource(tempDataSource);
                                                            }
                                                        }}
                                                    />
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
