import React, { useEffect } from "react";
import { HolderOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { nanoid } from 'nanoid'
import { Checkbox } from 'antd'
import ApexTd from 'apex-table/ApexTable/components/ApexTd'
import {
    ApexDatePicker,
    ApexInput,
    ApexInputNumber,
    ApexModal,
    ApexSelect,
    ApexShowCell
} from 'apex-table/ApexTable/components'
import { IProps } from 'apex-table/ApexTable/components/ApexTr/index.types'
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const ApexTr = (props: IProps<any>) => {
    
    const {
        activeDragKey,
        allowSelect,
        allowFixed,
        allowRowDrag,
        columns,
        showLineNumber,
        tableDivRef,
        rowHeight,
        rowKey,
        allowRowAddDel = false,
        onRowSelected,
        onCellClick,
        onChange,
        onFocus,
        onSetRef,
        onEnter,
        insertRows,
        deleteRow,
        dataSourceItem
    } = props;
    
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: dataSourceItem[rowKey] });
    
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        ...(activeDragKey === dataSourceItem[rowKey] ? {
            zIndex: 99
        } : {})
    };
    
    return <tr
        key={`apex-table-tbody-tr-${dataSourceItem['rowIndex']}`}
        className='apex-table-tbody-tr'
        ref={setNodeRef}
        style={{
            ...style,
            height: rowHeight
        }}
        {...attributes}
    >
        {
            showLineNumber &&
            <td style={{ height: rowHeight }} className='apex-table-tbody-td apex-table-tbody-td-line-number'>
                {
                    allowRowDrag ? <HolderOutlined
                            style={{
                                fontSize: 12,
                                padding: 5,
                                cursor: 'grab'
                            }}
                            {...listeners}
                        /> :
                        <div
                            className={`number ${allowRowAddDel ? 'number-add-delete' : ''}`}>{dataSourceItem['rowIndex'] + 1}</div>
                }
                {
                    allowRowAddDel && !allowRowDrag && <div className={`insert-delete-box`}>
                        <PlusOutlined className="icon" style={{ marginRight: 5 }}
                                      onClick={() => insertRows(dataSourceItem[rowKey], [{ [rowKey]: nanoid() }])}/>
                        <MinusOutlined className="icon" onClick={() => deleteRow(dataSourceItem[rowKey])}/>
                    </div>
                }
            </td>
        }
        {
            allowSelect &&
            <td style={{ height: rowHeight }} className='apex-table-tbody-td apex-table-tbody-td-checkbox'>
                <Checkbox checked={dataSourceItem?.['apexTableChecked']}
                          onChange={(event) => onRowSelected(event, dataSourceItem)}/>
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
                        <ApexShowCell column={columnItem} row={dataSourceItem} onClick={() => {
                        }}/>
                    </ApexTd>
                }
                switch (columnType) {
                    case 'input':
                        return <ApexInput
                            {...props}
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
                            {...props}
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
                            {...props}
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
                            {...props}
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
                            {...props}
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
                            {...props}
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
}

export default ApexTr;