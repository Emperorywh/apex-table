import React from "react";
import { IProps } from './index.types';
import { Checkbox } from "antd";
import ApexTh from "../ApexTh";

function ApexThead<T>(props: IProps<T>) {
    const {
        columns,
        showLineNumber = false,
        allowSelect = false,
        allowResize = false,
        showHeaderCheckBox = false,
        isSingle = false,
        headerChecked = false,
        indeterminate = false,
        rowHeight,
        onHeaderCheckBoxChange,
        onColWidthChange
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
                        return <ApexTh
                            allowResize={allowResize}
                            key={`${String(item.name)}-${index}`}
                            column={item}
                            rowHeight={rowHeight}
                            onColWidthChange={onColWidthChange}
                        ></ApexTh>
                    }
                })
            }
        </tr>
    </thead>
}

export default ApexThead;