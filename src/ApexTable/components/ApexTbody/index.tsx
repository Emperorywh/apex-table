import React from "react";
import { IProps } from './index.types';
import { Checkbox, Empty } from "antd";
import { ApexDatePicker, ApexInput, ApexInputNumber, ApexModal, ApexSelect, ApexShowCell } from "..";
import ApexTd from "../ApexTd";
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { nanoid } from "nanoid";
function ApexTbody<T>(props: IProps<T>) {
    const {
        allowSelect,
        allowFixed,
        columns,
        dataSource,
        showLineNumber,
        tableDivRef,
        startIndex,
        endIndex,
        rowHeight,
        rowKey,
        totalHeight,
        allowRowAddDel = true,
        onRowSelected,
        onCellClick,
        onChange,
        onFocus,
        onSetRef,
        onEnter,
        insertRows,
        deleteRow
    } = props;

    const topHeight = startIndex * rowHeight;
    const bottomHeight = totalHeight - (startIndex * rowHeight) - ((endIndex - startIndex) * rowHeight);

    return <tbody className='apex-table-tbody'>
        {
            dataSource.length > 0 && topHeight > 0 && <tr style={{ height: topHeight }}></tr>
        }
        {
            dataSource.length > 0 ? dataSource.map((dataSourceItem) => {
                return <tr
                    key={`apex-table-tbody-tr-${dataSourceItem['rowIndex']}`}
                    className='apex-table-tbody-tr'
                    style={{ height: rowHeight }}
                >
                    {
                        showLineNumber && <td style={{ height: rowHeight }} className='apex-table-tbody-td apex-table-tbody-td-line-number'>
                            <div className={`number`} >{dataSourceItem['rowIndex'] + 1}</div>
                            {
                                allowRowAddDel && <div className={`insert-delete-box`}>
                                    <PlusOutlined className="icon" style={{ marginRight: 5 }} onClick={() => insertRows(dataSourceItem[rowKey], [{ [rowKey]: nanoid() }])} />
                                    <MinusOutlined className="icon" onClick={() => deleteRow(dataSourceItem[rowKey])} />
                                </div>
                            }
                        </td>
                    }
                    {
                        allowSelect && <td style={{ height: rowHeight }} className='apex-table-tbody-td apex-table-tbody-td-checkbox'>
                            <Checkbox checked={dataSourceItem?.['apexTableChecked']} onChange={(event) => onRowSelected(event, dataSourceItem)} />
                        </td>
                    }
                    {
                        columns.map((columnItem) => {
                            const { columnType = 'input', readOnly = false } = columnItem;
                            if (columnItem?.visible === false) return;
                            const refKey: string = `${dataSourceItem['rowIndex']}-${columnItem.name as string}`;
                            if (readOnly) {
                                return <ApexTd
                                    key={refKey}
                                    column={columnItem}
                                    row={dataSourceItem}
                                    columns={columns}
                                    rowHeight={rowHeight}
                                    allowFixed={allowFixed}
                                    showLineNumber={showLineNumber}
                                    allowSelect={allowSelect}>
                                    <ApexShowCell column={columnItem} row={dataSourceItem} onClick={() => { }} />
                                </ApexTd>
                            }
                            switch (columnType) {
                                case 'input':
                                    return <ApexInput
                                        allowSelect={allowSelect}
                                        allowFixed={allowFixed}
                                        tableDivRef={tableDivRef}
                                        key={refKey}
                                        column={columnItem}
                                        columns={columns}
                                        row={dataSourceItem}
                                        rowIndex={dataSourceItem['rowIndex']}
                                        rowHeight={rowHeight}
                                        showLineNumber={showLineNumber}
                                        ref={(inputRef: any) => onSetRef(inputRef, refKey)}
                                        onCellClick={onCellClick}
                                        onChange={onChange}
                                        onFocus={onFocus}
                                        onEnter={onEnter}
                                    />;
                                case 'inputNumber':
                                    return <ApexInputNumber
                                        allowFixed={allowFixed}
                                        allowSelect={allowSelect}
                                        tableDivRef={tableDivRef}
                                        key={refKey}
                                        column={columnItem}
                                        columns={columns}
                                        row={dataSourceItem}
                                        rowIndex={dataSourceItem['rowIndex']}
                                        rowHeight={rowHeight}
                                        showLineNumber={showLineNumber}
                                        ref={(inputRef: any) => onSetRef(inputRef, refKey)}
                                        onCellClick={onCellClick}
                                        onChange={onChange}
                                        onFocus={onFocus}
                                        onEnter={onEnter}
                                    />;
                                case 'modal':
                                    return <ApexModal
                                        allowFixed={allowFixed}
                                        ref={(inputRef: any) => onSetRef(inputRef, refKey)}
                                        key={refKey}
                                        allowSelect={allowSelect}
                                        column={columnItem}
                                        columns={columns}
                                        row={dataSourceItem}
                                        rowIndex={dataSourceItem['rowIndex']}
                                        rowHeight={rowHeight}
                                        tableDivRef={tableDivRef}
                                        showLineNumber={showLineNumber}
                                        onCellClick={onCellClick}
                                        onChange={onChange}
                                        onFocus={onFocus}
                                        onEnter={onEnter}
                                    />
                                case 'select':
                                    return <ApexSelect
                                        allowFixed={allowFixed}
                                        ref={(inputRef: any) => onSetRef(inputRef, refKey)}
                                        key={refKey}
                                        allowSelect={allowSelect}
                                        column={columnItem}
                                        columns={columns}
                                        row={dataSourceItem}
                                        rowIndex={dataSourceItem['rowIndex']}
                                        rowHeight={rowHeight}
                                        tableDivRef={tableDivRef}
                                        showLineNumber={showLineNumber}
                                        onCellClick={onCellClick}
                                        onChange={onChange}
                                        onFocus={onFocus}
                                        onEnter={onEnter}
                                    />
                                case 'datePicker':
                                    return <ApexDatePicker
                                        allowFixed={allowFixed}
                                        ref={(inputRef: any) => onSetRef(inputRef, refKey)}
                                        key={refKey}
                                        allowSelect={allowSelect}
                                        column={columnItem}
                                        columns={columns}
                                        row={dataSourceItem}
                                        rowIndex={dataSourceItem['rowIndex']}
                                        rowHeight={rowHeight}
                                        tableDivRef={tableDivRef}
                                        showLineNumber={showLineNumber}
                                        onCellClick={onCellClick}
                                        onChange={onChange}
                                        onFocus={onFocus}
                                        onEnter={onEnter}
                                    />
                                default:
                                    return <ApexInput
                                        allowFixed={allowFixed}
                                        ref={(inputRef: any) => onSetRef(inputRef, refKey)}
                                        allowSelect={allowSelect}
                                        tableDivRef={tableDivRef}
                                        key={refKey}
                                        column={columnItem}
                                        columns={columns}
                                        row={dataSourceItem}
                                        rowIndex={dataSourceItem['rowIndex']}
                                        rowHeight={rowHeight}
                                        showLineNumber={showLineNumber}
                                        onCellClick={onCellClick}
                                        onChange={onChange}
                                        onFocus={onFocus}
                                        onEnter={onEnter}
                                    />
                            }

                        })
                    }
                </tr>
            }) : <tr>
                <td colSpan={columns.length}>
                    <Empty />
                </td>
            </tr>
        }
        {
            dataSource.length > 0 && bottomHeight > 0 && <tr style={{ height: bottomHeight }}></tr>
        }
    </tbody>
}

export default ApexTbody;