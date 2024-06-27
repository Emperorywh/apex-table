import React, { useEffect } from "react";
import { IProps } from './index.types';
import { Checkbox, Empty } from "antd";
import { ApexDatePicker, ApexInput, ApexInputNumber, ApexModal, ApexSelect } from "..";


function ApexTbody<T>(props: IProps<T>) {
    const {
        allowSelect,
        columns,
        dataSource,
        showLineNumber,
        tableDivRef,
        startIndex,
        endIndex,
        rowHeight,
        totalHeight,
        onRowSelected,
        onCellClick,
        onChange,
        onFocus,
        onSetRef,
        onEnter
    } = props;

    return <tbody className='apex-table-tbody'>
        <tr style={{ height: startIndex * rowHeight }}></tr>
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
                            const { columnType = 'input' } = columnItem;
                            if (columnItem?.visible === false) return;
                            const refKey: string = `${dataSourceIndex}-${columnItem.name as string}`;
                            switch (columnType) {
                                case 'input':
                                    return <ApexInput
                                        allowSelect={allowSelect}
                                        tableDivRef={tableDivRef}
                                        key={refKey}
                                        column={columnItem}
                                        row={dataSourceItem}
                                        rowIndex={dataSourceIndex}
                                        ref={inputRef => onSetRef(inputRef, refKey)}
                                        onCellClick={onCellClick}
                                        onChange={onChange}
                                        onFocus={onFocus}
                                        onEnter={onEnter}
                                    />;
                                case 'inputNumber':
                                    return <ApexInputNumber
                                        allowSelect={allowSelect}
                                        tableDivRef={tableDivRef}
                                        key={refKey}
                                        column={columnItem}
                                        row={dataSourceItem}
                                        rowIndex={dataSourceIndex}
                                        ref={inputRef => onSetRef(inputRef, refKey)}
                                        onCellClick={onCellClick}
                                        onChange={onChange}
                                        onFocus={onFocus}
                                        onEnter={onEnter}
                                    />;
                                case 'modal':
                                    return <ApexModal
                                        ref={inputRef => onSetRef(inputRef, refKey)}
                                        key={refKey}
                                        allowSelect={allowSelect}
                                        column={columnItem}
                                        row={dataSourceItem}
                                        rowIndex={dataSourceIndex}
                                        tableDivRef={tableDivRef}
                                        onCellClick={onCellClick}
                                        onChange={onChange}
                                        onFocus={onFocus}
                                        onEnter={onEnter}
                                    />
                                case 'select':
                                    return <ApexSelect
                                        ref={inputRef => onSetRef(inputRef, refKey)}
                                        key={refKey}
                                        allowSelect={allowSelect}
                                        column={columnItem}
                                        row={dataSourceItem}
                                        rowIndex={dataSourceIndex}
                                        tableDivRef={tableDivRef}
                                        onCellClick={onCellClick}
                                        onChange={onChange}
                                        onFocus={onFocus}
                                        onEnter={onEnter}
                                    />
                                case 'datePicker':
                                    return <ApexDatePicker
                                        ref={inputRef => onSetRef(inputRef, refKey)}
                                        key={refKey}
                                        allowSelect={allowSelect}
                                        column={columnItem}
                                        row={dataSourceItem}
                                        rowIndex={dataSourceIndex}
                                        tableDivRef={tableDivRef}
                                        onCellClick={onCellClick}
                                        onChange={onChange}
                                        onFocus={onFocus}
                                        onEnter={onEnter}
                                    />
                                default:
                                    return <ApexInput
                                        ref={inputRef => onSetRef(inputRef, refKey)}
                                        allowSelect={allowSelect}
                                        tableDivRef={tableDivRef}
                                        key={refKey}
                                        column={columnItem}
                                        row={dataSourceItem}
                                        rowIndex={dataSourceIndex}
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
        <tr style={{ height: totalHeight - (startIndex * rowHeight) - ((endIndex - startIndex) * rowHeight) }}></tr>
    </tbody>
}

export default ApexTbody;