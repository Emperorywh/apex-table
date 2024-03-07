import { Input } from "antd";
import React from "react";

export interface IApexTableRenderProps {
    defaultValue?: string;
    onInputChange?: (value: string) => void;
}

/**
 * 输入框
 * @param props 
 * @returns 
 */
const ApexTableInput: React.FC<IApexTableRenderProps> = (props) => {
    const { defaultValue, onInputChange } = props;
    return <Input
        defaultValue={defaultValue}
        onBlur={inputEvent => {
            const inputValue = inputEvent.target.value;
            onInputChange && onInputChange(inputValue);
        }}
    />
}

export default ApexTableInput;