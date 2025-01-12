import React, { useContext } from 'react'
import ApexContext from '../../utils/ApexContext';
import { Checkbox } from 'antd'
import ApexTh from '../ApexTh';
import { ApexTableProps } from '../../index.types';

/**
 * 头部
 * @constructor
 */
function ApexThead<T>() {
    
    const {
        columns,
        allowSelect,
        rowHeight,
        showHeaderCheckBox,
        showLineNumber
    } = useContext<ApexTableProps<T>>(ApexContext);
    
    return <thead className='apex-table-thead'>
        <tr style={{ height: rowHeight }}>
            {
                showLineNumber ? <th className='apex-table-thead-th apex-table-thead-th-line-number-head'>
                    <div>行号</div>
                </th> : null
            }
            {
                allowSelect && <th className='apex-table-thead-th apex-table-thead-th-checkbox'>
                    {
                        showHeaderCheckBox &&
                        <Checkbox />
                    }
                </th>
            }
            {
                columns.map((column, columnIndex) => {
                    if (column?.visible === false) {
                        return null
                    } else {
                        return <ApexTh
                            column={column}
                            key={`${String(column?.name)}-${columnIndex}`}
                        />
                    }
                })
            }
            
        </tr>
    </thead>
    
}

export default ApexThead;