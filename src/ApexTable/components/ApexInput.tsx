import { Input, InputRef } from "antd";
import React, { Ref, memo, useImperativeHandle, useRef, useState } from "react";
import { forwardRef } from "react";
import { IApexTableColumns, IRow } from "..";
import ApexShowCellChildren from "./ApexShowCellChildren";

interface IProps {
    children?: React.ReactNode;
    column: IApexTableColumns<any>;
    defaultValue?: string;
    row: any;
    rowIndex: number;
    onCellClick: (rowInfo: IRow) => void;
    onFocus?: (rowInfo: IRow) => void;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>, row: any, columnName: any) => void;
}

export interface IApexInput {
    focus: () => void;
    blur: () => void;
}

const ApexInput = memo(forwardRef((props: IProps, ref: Ref<IApexInput>) => {
    console.log("渲染")
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
        blur();
        props.onBlur && props.onBlur(event)
    }

    /**
     * 输入框值的改变
     * @param event 
     */
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange && onChange(event, row, name)
    }

    const focus = () => {
        setFocusState(true);
        requestAnimationFrame(() => {
            inputRef.current?.focus();
            inputRef.current?.select();
        })
    }

    const blur = () => {
        setFocusState(false);
    }

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
            /> : <div className="apex-show-cell" onClick={hanldeCellClick}>
                {onRender ? onRender(column, row[name]) : <ApexShowCellChildren columnItem={column} dataSourceItem={row} />}
            </div>
        }
    </td>
}))

export default ApexInput;