import { Input, InputRef } from "antd";
import React, { Ref, memo, useCallback } from "react";
import { forwardRef } from "react";
import { IApexTableColumns, IRow } from "..";
import ApexShowCellChildren from "./ApexShowCellChildren";

interface IProps {
    children?: React.ReactNode;
    column: IApexTableColumns<any>;
    defaultValue?: string;
    focusRowIndex: number;
    focusColumnName: string;
    row: any;
    rowIndex: number;
    onCellClick: (rowInfo: IRow) => void;
    onFocus?: (rowInfo: IRow, refKey: string) => void;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const ApexInput = memo(forwardRef((props: IProps, ref: Ref<InputRef>) => {
    console.log("渲染")
    const {
        column,
        defaultValue,
        focusRowIndex,
        focusColumnName,
        row,
        rowIndex,
        onChange,
        onBlur,
        onCellClick
    } = props;
    const { name, onRender } = column;
    const refKey = `${rowIndex}-${name as string}`;
    const showKey = `${focusRowIndex}-${focusColumnName}`;

    const hanldeCellClick = useCallback(() => {
        onCellClick({
            rowIndex: rowIndex,
            columnName: name
        })
    }, [])

    const handleFocus = useCallback((event: React.FocusEvent<HTMLInputElement, Element>) => {
        props.onFocus && props.onFocus({
            rowIndex: rowIndex,
            columnName: name
        }, refKey)
    }, [])

    return <td className={`apex-table-tbody-td`} id={`td-${refKey}`}>
        {
            refKey === showKey ?
                <Input
                    defaultValue={defaultValue || row[name]}
                    ref={ref}
                    onBlur={onBlur}
                    onFocus={handleFocus}
                    onChange={onChange}
                />
                :
                <div className="apex-show-cell" onClick={hanldeCellClick}>
                    {onRender ? onRender(column, row[name]) : <ApexShowCellChildren columnItem={column} dataSourceItem={row} />}
                </div>
        }
    </td>
}), arePropsEqual)

function arePropsEqual(oldProps: IProps, newProps: IProps) {
    const refKey = `${oldProps.rowIndex}-${String(oldProps.column.name)}`;
    const showKey = `${newProps.focusRowIndex}-${newProps.focusColumnName}`;
    return true;
}

export default ApexInput;