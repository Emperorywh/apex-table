import { Input, InputRef } from "antd";
import React, { Ref } from "react";
import { forwardRef } from "react";
import { IApexTableColumns } from "..";
import ApexShowCellChildren from "./ApexShowCellChildren";

interface IProps {
    children?: React.ReactNode;
    column: IApexTableColumns<any>;
    defaultValue?: string;
    focusRowIndex: number;
    focusColumnName: string;
    row: any;
    rowIndex: number;
    onCellClick: () => void;
    onFocus?: React.FocusEventHandler<HTMLInputElement>;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const ApexInput = forwardRef((props: IProps, ref: Ref<InputRef>) => {
    console.log("渲染")
    const {
        column,
        defaultValue,
        focusRowIndex,
        focusColumnName,
        row,
        rowIndex,
        onChange,
        onFocus,
        onBlur,
        onCellClick
    } = props;
    const { name, onRender } = column;
    const refKey = `${rowIndex}-${String(name)}`;
    const showKey = `${focusRowIndex}-${focusColumnName}`;

    return <td className={`apex-table-tbody-td`} id={`td-${refKey}`}>
        {
            refKey === showKey ?
                <Input
                    defaultValue={defaultValue || row[name]}
                    ref={ref}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    onChange={onChange}
                />
                :
                <div className="apex-show-cell" onClick={onCellClick}>
                    {onRender ? onRender(column, row[name]) : <ApexShowCellChildren columnItem={column} dataSourceItem={row} />}
                </div>
        }
    </td>
});

export default ApexInput;