import { Input, InputRef } from "antd";
import React, { Ref, forwardRef } from "react";

export interface IApexTableRenderProps {
    defaultValue?: string;
    ref?: Ref<InputRef>;
    onInputChange?: (value: string) => void;
    onFocus?: React.FocusEventHandler<HTMLInputElement>;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
}

/**
 * 输入框
 * @param props 
 * @returns 
 */
const ApexTableInput: React.FC<IApexTableRenderProps> = forwardRef((props, ref) => {
    const { defaultValue, onInputChange, onFocus, onBlur } = props;
    return <Input
        defaultValue={defaultValue}
        ref={ref}
        onBlur={inputEvent => {
            props.onBlur && props.onBlur(inputEvent);
            const inputValue = inputEvent.target.value;
            onInputChange && onInputChange(inputValue);
        }}
        onFocus={onFocus}
    />
})

export default ApexTableInput;