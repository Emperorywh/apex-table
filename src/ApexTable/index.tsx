import React, { ReactNode, type FC, useState, useEffect } from 'react';
import "./index.less"
import { Checkbox, Input } from 'antd';
import { apexDeepClone } from './utils/tool';

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

    const [tableDataSource, setTableDataSource] = useState<any[]>(dataSource);

    useEffect(() => {
        console.log("tableDataSource 改变");
    }, [tableDataSource]);

    useEffect(() => {
        console.log("组件加载");
        return () => {
            console.log("组件卸载");
        }
    }, []);

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
                                <Checkbox onChange={() => { }} />
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
                                        <Checkbox onChange={() => { }} />
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
