import React from "react";
import ApexTd from 'apex-table/ApexTable/components/ApexTd'
import { IProps } from 'apex-table/ApexTable/components/ApexTrSummary/index.types'

const ApexTrSummary = (props: IProps<any>) => {
    
    const {
        allowSelect,
        allowFixed,
        columns,
        showLineNumber = true,
        rowHeight,
        dataSourceItem,
        summaryData
    } = props;
    
    
    return <tfoot className='apex-table-tfoot'>
    <tr
        key={`apex-table-tbody-tr-summary}`}
        className='apex-table-tbody-tr apex-table-tbody-tr-summary'
        style={{
            height: rowHeight
        }}
    >
        {
            showLineNumber &&
            <td style={{ height: rowHeight }} className='apex-table-tbody-td apex-table-tbody-td-line-number'>
                <div
                    className={`number summary`}>合计
                </div>
            </td>
        }
        {
            allowSelect &&
            <td style={{ height: rowHeight }} className='apex-table-tbody-td apex-table-tbody-td-checkbox'/>
        }
        {
            columns.map((columnItem) => {
                const { showSummary = false, visible = true } = columnItem;
                const refKey: string = `summary-${columnItem.name as string}`;
                if (!visible) return;
                return <ApexTd
                    key={refKey}
                    column={columnItem}
                    row={dataSourceItem}
                    columns={columns}
                    rowHeight={rowHeight}
                    allowFixed={allowFixed}
                    showLineNumber={showLineNumber}
                    allowSelect={allowSelect}>
                    {showSummary && <div className="apex-table-tbody-tr-summary-box">
                        <span className="apex-table-tbody-tr-summary-content">
                            {summaryData?.[columnItem.name]}
                        </span>
                    </div>}
                </ApexTd>
            })
        }
    </tr>
    </tfoot>
}

export default ApexTrSummary;