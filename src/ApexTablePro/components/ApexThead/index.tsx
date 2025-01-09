import React, { useContext } from 'react'
import ApexContext from '../../utils/ApexContext';

/**
 * 头部
 * @constructor
 */
const ApexThead = () => {
    
    const {
        allowSelect,
        columns,
        showLineNumber
    } = useContext(ApexContext);
    
    return  <thead className='apex-table-thead'>
    <tr style={{ height: rowHeight }}>
        {
            showLineNumber ? <th className='apex-table-thead-th apex-table-thead-th-line-number-head'>
                {
                    showColumnConfig ? <SettingOutlined
                        style={{ fontSize: 18, cursor: 'pointer' }}
                        onClick={handleColumnConfig}
                    /> : <div>行号</div>
                }
        
            </th> : null
        }
    </thead>
    
}

export default ApexThead;