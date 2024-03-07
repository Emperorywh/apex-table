import { Input, InputNumber } from "antd";
import React from "react";

export interface IApexTableRenderProps {
    defaultValue?: string;
    onInputChange?: (value: number) => void;
}

/**
 * 数字输入框
 * @param props 
 * @returns 
 */
const ApexTableInputNumber: React.FC<IApexTableRenderProps> = (props) => {
    const { defaultValue, onInputChange } = props;
    return <InputNumber
        defaultValue={defaultValue}
        onBlur={inputEvent => {
            const inputValue = Number.parseFloat(inputEvent.target.value);
            const realVal = Number.isNaN(inputValue) ? 0 : inputValue;
            onInputChange && onInputChange(realVal);
        }}
    />
}

export default ApexTableInputNumber;