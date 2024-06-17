import React from "react";
import { IPorps } from './index.types';
import { Checkbox, Empty } from "antd";
import ApexInput from "../ApexInput";

function ApexTbody<T>(props: IPorps<T>) {
    const {
        allowSelect,
        columns,
        dataSource,
        showLineNumber,
        onRowSelected,
        onCellClick,
        onChange,
        onFocus,
        onSetRef
    } = props;

    return <tbody className='apex-table-tbody'>
        {
            dataSource.length > 0 ? dataSource.map((dataSourceItem, dataSourceIndex) => {
                return <tr key={`apex-table-tbody-tr-${dataSourceIndex}`} className='apex-table-tbody-tr'>
                    {
                        showLineNumber && <td className='apex-table-tbody-td apex-table-tbody-td-line-number'>
                            <div className={`number ${dataSourceIndex > 2 ? 'number-low' : ''}`}>{dataSourceIndex + 1}</div>
                        </td>
                    }
                    {
                        allowSelect && <td className='apex-table-tbody-td apex-table-tbody-td-checkbox'>
                            <Checkbox checked={dataSourceItem?.['apexTableChecked']} onChange={(event) => onRowSelected(event, dataSourceItem)} />
                        </td>
                    }
                    {
                        columns.map((columnItem) => {
                            if (columnItem?.visible === false) return;
                            const refKey: string = `${dataSourceIndex}-${columnItem.name as string}`;
                            return <ApexInput
                                key={refKey}
                                column={columnItem}
                                row={dataSourceItem}
                                rowIndex={dataSourceIndex}
                                ref={inputRef => onSetRef(inputRef, refKey)}
                                onCellClick={onCellClick}
                                onChange={onChange}
                                onFocus={onFocus}
                            />
                        })
                    }
                </tr>
            }) : <tr>
                <td colSpan={columns.length}>
                    <Empty />
                </td>
            </tr>
        }
    </tbody>
}

export default ApexTbody;