import React from "react";
import { IProps } from './index.types';
import { Checkbox } from "antd";

function ApexThead<T>(props: IProps<T>) {
    const {
        columns,
        showLineNumber = false,
        allowSelect = false,
        showHeaderCheckBox = false,
        isSingle = false,
        headerChecked = false,
        indeterminate = false,
        rowHeight,
        onHeaderCheckBoxChange
    } = props;

    return <thead className='apex-table-thead'>
        <tr style={{ height: rowHeight }}>
            {
                showLineNumber ? <th className='apex-table-thead-th apex-table-thead-th-line-number-head'>
                    <div >行号</div>
                </th> : null
            }
            {
                allowSelect && <th className='apex-table-thead-th apex-table-thead-th-checkbox'>
                    {
                        showHeaderCheckBox && <Checkbox disabled={isSingle} checked={headerChecked} indeterminate={indeterminate} onChange={onHeaderCheckBoxChange} />
                    }
                </th>
            }
            {
                columns.map((item, index) => {
                    if (item?.visible === false) {
                        return null
                    } else {
                        return <th key={`${String(item.name)}-${index}`} className={`apex-table-thead-th`}>
                            {item['title']}
                        </th>;
                    }
                })
            }
        </tr>
    </thead>
}

export default ApexThead;