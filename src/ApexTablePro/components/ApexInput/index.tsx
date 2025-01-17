import { IProps } from './index.types'
import React, { useRef } from 'react'
import { Input, InputRef } from 'antd'

/**
 * 表格内置输入框
 * @param props
 * @constructor
 */
function ApexInput<T>(props: IProps<T>) {
    const { row, column } = props;
    
    const { apexTableInputProps = {}, name } = column;
    
    const inputRef = useRef<InputRef>(null);
    
    const defaultValue = row?.[name];
    
    return <Input
        {...apexTableInputProps}
        ref={inputRef}
        defaultValue={defaultValue}
    />
}

export default ApexInput;