import { InputNumber } from "antd";
import React, { forwardRef } from "react";

export interface IApexTableRenderProps {
    defaultValue?: string;
    onInputChange?: (value: number) => void;
    onFocus?: React.FocusEventHandler<HTMLInputElement>;
    ref?: React.Ref<HTMLInputElement>
}

/**
 * 数字输入框
 * @param props 
 * @returns 
 */
const ApexTableInputNumber: React.FC<IApexTableRenderProps> = forwardRef((props, ref) => {
    const { defaultValue, onInputChange, onFocus } = props;
    return <InputNumber
        defaultValue={defaultValue}
        onBlur={inputEvent => {
            const inputValue = Number.parseFloat(inputEvent.target.value);
            const realVal = Number.isNaN(inputValue) ? 0 : inputValue;
            onInputChange && onInputChange(realVal);
        }}
        onFocus={onFocus}
        ref={ref}
    />
})

export default ApexTableInputNumber;