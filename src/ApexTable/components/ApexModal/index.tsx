import { Input, InputRef } from "antd";
import React, { useRef, useState } from "react";
import { IProps } from "./index.types";
import ApexShowCellChildren from "../ApexShowCellChildren/index.tsx";

function ApexModal(props: IProps) {
    const {
        allowSelect,
        column,
        defaultValue,
        row,
        rowIndex,
        tableDivRef,
        onChange,
        onBlur,
        onCellClick
    } = props;
    const { name, onRender } = column;
    const inputRef = useRef<InputRef>(null);
    const [focusState, setFocusState] = useState(false);
    const tableTdRef = useRef<HTMLTableDataCellElement>(null);

    /**
     * 点击单元格
     */
    const hanldeCellClick = () => {
        setFocusState(true);
        onCellClick({
            rowIndex: rowIndex,
            columnName: name
        });
    }

    /**
     * 输入框失去焦点
     * @param event 
     */
    const handleInputBlur = (event: React.FocusEvent<HTMLInputElement, Element>) => {
        setFocusState(false);
        onBlur && onBlur(event);
    }

    /**
     * 输入框值的改变
     * @param event 
     */
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange && onChange(event, row, name)
    }

    /**
     * 输入框聚焦
     * @param event 
     */
    const handleInputFocus = (event: React.FocusEvent<HTMLInputElement, Element>) => {
        event.preventDefault();
        setFocusState(true);
        props.onFocus && props.onFocus({
            rowIndex: rowIndex,
            columnName: name
        });
    }

    const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event: any) => {
        const key = event.key;
        const cursorPosition = event.target.selectionStart;
        const selectionEnd = event.target.selectionEnd;
        switch (key) {
            case 'ArrowUp':
                break;
            case 'ArrowDown':
                break;
            case 'ArrowLeft':
                if (cursorPosition !== selectionEnd) {
                    event.stopPropagation();
                }
                break;
            case 'ArrowRight':
                if (cursorPosition < selectionEnd) {
                    event.stopPropagation();
                }
                break;
        }
    }

    return <td className={`apex-table-tbody-td`} ref={tableTdRef}>
        {
            focusState && <Input
                defaultValue={defaultValue || row[name]}
                ref={inputRef}
                onBlur={handleInputBlur}
                onFocus={handleInputFocus}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
            />
        }
        {
            !focusState && <div className="apex-show-cell" onClick={hanldeCellClick} >
                {onRender ? onRender(column, row[name]) : <ApexShowCellChildren columnItem={column} dataSourceItem={row} />}
            </div>
        }
    </td>
}


export default ApexModal;