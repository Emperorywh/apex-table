import { Input, InputRef } from "antd";
import React, { Ref } from "react";
import { forwardRef } from "react";

interface IProps {
    defaultValue?: string;
    children?: React.ReactNode;
    onFocus?: React.FocusEventHandler<HTMLInputElement>;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const ApexInput = forwardRef((props: IProps, ref: Ref<InputRef>) => {
    const { defaultValue, onChange, onFocus, onBlur } = props;
    return <td className={`apex-table-tbody-td`}>
        <Input
            defaultValue={defaultValue}
            ref={ref}
            onBlur={onBlur}
            onFocus={onFocus}
            onChange={onChange}
        />
    </td>
});

export default ApexInput;