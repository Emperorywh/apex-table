import { Input, InputRef } from "antd";
import React, { Ref, memo, useEffect, useImperativeHandle, useRef, useState } from "react";
import { forwardRef } from "react";
import { ApexShowCell } from "..";
import { IApexInput, IProps } from './index.types';
import { onSetScrollBarPosition } from "apex-table/ApexTable/utils/tools";
import ApexTd from "../ApexTd";

const ApexInput = memo(forwardRef((props: IProps, ref: Ref<IApexInput>) => {
    const {
        allowSelect,
        column,
        defaultValue,
        row,
        rowIndex,
        rowHeight,
        tableDivRef,
        onChange,
        onBlur,
        onCellClick,
        onEnter
    } = props;

    const { name } = column;
    const [focusState, setFocusState] = useState(false);
    const inputRef = useRef<InputRef>(null);
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
        onChange && onChange(row, name, event.target.value)
    }

    const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event: any) => {
        const key = event.key;
        const cursorPosition = event.target.selectionStart;
        const selectionEnd = event.target.selectionEnd;
        const value = event?.target?.value || '';
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
                if (cursorPosition < value.length) {
                    event.stopPropagation();
                }
                break;
            case 'Enter':
                onEnter && onEnter();
                break;
        }
    }

    const focus = () => {
        setFocusState(true);
    }

    const blur = () => {
        setFocusState(false);
    }


    useEffect(() => {
        if (focusState) {
            requestAnimationFrame(() => {
                inputRef.current?.select();
            })
            onSetScrollBarPosition({
                allowSelect: allowSelect,
                tableDivRef: tableDivRef,
                tableTdRef: tableTdRef,
                axis: {
                    rowIndex: rowIndex,
                    columnName: name
                }
            })
        }
    }, [focusState]);

    useImperativeHandle(ref, () => {
        return {
            focus,
            blur
        }
    }, [focusState])

    return <ApexTd rowHeight={rowHeight} ref={tableTdRef}>
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
            !focusState && <ApexShowCell column={column} row={row} onClick={hanldeCellClick} />
        }
    </ApexTd>
}))

export default ApexInput;