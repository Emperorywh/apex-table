import React from "react";
import { IPorps } from './index.types';
import { Checkbox } from "antd";

function ApexThead<T>(props: IPorps<T>) {
    const {
        columns,
        showLineNumber = false,
        showHeaderCheckBox = false,
        isSingle = false,
        headerChecked = false,
        indeterminate = false,
        onHeaderCheckBoxChange
    } = props;

    return <thead className='apex-table-thead'>
        <tr>
            {
                showLineNumber ? <th className='apex-table-thead-th apex-table-thead-th-line-number-head'>
                    <span>行号</span>
                </th> : null
            }
            {
                showHeaderCheckBox ? <th className='apex-table-thead-th apex-table-thead-th-checkbox'>
                    <Checkbox disabled={isSingle} checked={headerChecked} indeterminate={indeterminate} onChange={onHeaderCheckBoxChange} />
                </th> : null
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