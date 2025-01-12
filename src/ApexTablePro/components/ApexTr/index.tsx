import React, { useContext } from 'react'
import ApexContext from 'apex-table/ApexTablePro/utils/ApexContext'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { Checkbox } from 'antd'
import { IProps } from "./index.types";
import { ApexTableProps } from '../../index.types'
import ApexTd from '../ApexTd'

function ApexTr<T>(props: IProps<T>) {
    
    const { row } = props;
    
    const {
        allowRowAddDel,
        allowSelect,
        columns,
        showLineNumber,
        rowHeight,
    } = useContext<ApexTableProps<T>>(ApexContext);
    
    return <tr
        className='apex-table-tbody-tr'
    >
        {
            showLineNumber &&
            <td style={{ height: rowHeight }} className='apex-table-tbody-td apex-table-tbody-td-line-number'>
                <div
                    className={`number ${allowRowAddDel ? 'number-add-delete' : ''}`}>
                    {(row?.apexTableRowIndex || 0) + 1}
                </div>
                {
                    allowRowAddDel && <div className={`insert-delete-box`}>
                        <PlusOutlined className="icon" style={{ marginRight: 5 }}/>
                        <MinusOutlined className="icon"/>
                    </div>
                }
            </td>
        }
        {
            allowSelect &&
            <td style={{ height: rowHeight }} className='apex-table-tbody-td apex-table-tbody-td-checkbox'>
                <Checkbox/>
            </td>
        }
        {
            columns.map(column => {
                return <ApexTd<T>
                    row={row}
                    column={column}
                >
                    {
                        row?.[column.name]
                    }
                </ApexTd>
            })
        }
    </tr>
}

export default ApexTr;