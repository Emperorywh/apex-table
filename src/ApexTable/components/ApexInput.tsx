import { Input, InputRef } from "antd";
import React, { Ref, memo, useEffect, useImperativeHandle, useRef, useState } from "react";
import { forwardRef } from "react";
import { IApexTableColumns, IFocusAxis } from "..";
import ApexShowCellChildren from "./ApexShowCellChildren";

interface IProps {
    children?: React.ReactNode;
    column: IApexTableColumns<any>;
    defaultValue?: string;
    row: any;
    rowIndex: number;
    onCellClick: (rowInfo: IFocusAxis) => void;
    onFocus?: (rowInfo: IFocusAxis) => void;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>, row: any, columnName: any) => void;
}

export interface IApexInput {
    focus: () => void;
    blur: () => void;
}

const ApexInput = memo(forwardRef((props: IProps, ref: Ref<IApexInput>) => {

    const {
        column,
        defaultValue,
        row,
        rowIndex,
        onChange,
        onBlur,
        onCellClick
    } = props;

    const { name, onRender } = column;

    const refKey = `${rowIndex}-${name as string}`;

    const [focusState, setFocusState] = useState(false);

    const inputRef = useRef<InputRef>(null);


    /**
     * 点击单元格
     */
    const hanldeCellClick = () => {
        focus();
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
        focus();
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
        onChange && onChange(event, row, name)
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

    const focus = () => {
        setFocusState(true);
    }

    const blur = () => {
        setFocusState(false);
    }

    useEffect(() => {
        if (focusState) {
            // requestAnimationFrame(() => {
            inputRef.current?.select();
            // inputRef.current?.input?.scrollIntoView({ block: 'nearest' });
            // })
        }
    }, [focusState]);

    useImperativeHandle(ref, () => {
        return {
            focus,
            blur
        }
    }, [])
    return <td className={`apex-table-tbody-td`} id={`td-${refKey}`}>
        {
            focusState ? <Input
                defaultValue={defaultValue || row[name]}
                ref={inputRef}
                onBlur={handleInputBlur}
                onFocus={handleInputFocus}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
            /> : <div className="apex-show-cell" onClick={hanldeCellClick} >
                {onRender ? onRender(column, row[name]) : <ApexShowCellChildren columnItem={column} dataSourceItem={row} />}
            </div>
        }
    </td>
}))

export default ApexInput;