import { DatePicker, DatePickerProps } from "antd";
import React, { Ref, memo, useEffect, useImperativeHandle, useRef, useState } from "react";
import { forwardRef } from "react";
import { ApexShowCell } from "..";
import { IApexDatePicker, IProps } from './index.types';
import { onSetScrollBarPosition } from "apex-table/ApexTable/utils/tools";
import dayjs from "dayjs";
import ApexTd from "../ApexTd";
import useCellValidation from 'apex-table/hooks/useCellValidation'

const ApexDatePicker = memo(forwardRef((props: IProps<any>, ref: Ref<IApexDatePicker>) => {
    const {
        allowSelect,
        showLineNumber,
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
    const inputRef = useRef<any>(null);
    const tableTdRef = useRef<HTMLTableDataCellElement>(null);
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
        setIsValid(true);
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
    const handleInputChange: DatePickerProps['onChange'] = (date, dateString) => {
        onChange && onChange(row, name, dateString)
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
                inputRef.current?.focus();
                document.execCommand('selectAll', false, undefined);
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
                showLineNumber
            })
        }
    }, [focusState]);

    useImperativeHandle(ref, () => {
        return {
            focus,
            blur
        }
    }, [focusState])

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
            focusState && <DatePicker
                defaultValue={defaultValue && dayjs(defaultValue) || row[name] ? dayjs(row[name]) : row[name]}
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

export default ApexDatePicker;