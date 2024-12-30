import { Input, InputRef, message } from "antd";
import React, { Ref, memo, useEffect, useImperativeHandle, useRef, useState } from "react";
import { forwardRef } from "react";
import { ApexShowCell } from "..";
import { IApexInput, IProps } from './index.types';
import { onSetScrollBarPosition } from "apex-table/ApexTable/utils/tools";
import ApexTd from "../ApexTd";
import useCellValidation from 'apex-table/hooks/useCellValidation'

const ApexInput = memo(forwardRef((props: IProps<any>, ref: Ref<IApexInput>) => {
    const {
        apexColumns,
        allowSelect,
        showLineNumber,
        showSummary,
        allowFixed,
        column,
        columns,
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
    
    const { name, rules } = column;
    const [focusState, setFocusState] = useState(false);
    const inputRef = useRef<InputRef>(null);
    /**
     * 是否通过单元格校验
     */
    const [isValid, setIsValid] = useCellValidation({
        rules,
        rowInfo: {
            row,
            value: row[name]
        },
        isFocus: focusState
    });
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
        if (column?.apexTableInputProps?.onFocus) {
            column?.apexTableInputProps?.onFocus?.(event)
        }
        event.preventDefault();
        setIsValid(true);
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
        if (column?.apexTableInputProps?.onBlur) {
            column?.apexTableInputProps?.onBlur?.(event)
        }
        setFocusState(false);
        onBlur && onBlur(event);
    }
    
    /**
     * 输入框值的改变
     * @param event
     */
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (column?.apexTableInputProps?.onChange) {
            column?.apexTableInputProps?.onChange?.(event)
        }
        onChange && onChange(row, name, event.target.value)
    }
    
    /**
     * 监听回车键
     * @param event
     */
    const handlePressEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (column?.apexTableInputProps?.onPressEnter) {
            column?.apexTableInputProps?.onPressEnter?.(event)
        }
    }
    
    const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event: any) => {
        if (column?.apexTableInputProps?.onKeyDown) {
            column?.apexTableInputProps?.onKeyDown?.(event)
        }
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
                },
                allowFixed,
                columns,
                showLineNumber,
                showSummary,
                apexColumns
            })
        }
    }, [focusState]);
    
    useImperativeHandle(ref, () => {
        return {
            focus,
            blur
        }
    })
    
    return <ApexTd
        row={row}
        column={column}
        columns={columns}
        rowHeight={rowHeight}
        ref={tableTdRef}
        allowSelect={allowSelect}
        allowFixed={allowFixed}
        showLineNumber={showLineNumber}
        isValid={isValid}
    >
        {
            focusState && <Input
                {...column?.apexTableInputProps}
                defaultValue={defaultValue || row[name]}
                ref={inputRef}
                onBlur={handleInputBlur}
                onFocus={handleInputFocus}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onPressEnter={handlePressEnter}
            />
        }
        {
            !focusState && <ApexShowCell column={column} row={row} onClick={hanldeCellClick}/>
        }
    </ApexTd>
}))

export default ApexInput;