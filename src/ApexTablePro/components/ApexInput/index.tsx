import { IProps } from './index.types'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Input, InputRef } from 'antd'
import ApexCell from '../ApexCell'
import { ApexTableColumnHideProps, ApexTableExtendProps, ApexTableProps } from '../../index.types'
import ApexContext from '../../utils/ApexContext'
import { flushSync } from 'react-dom'

/**
 * 表格内置输入框
 * @param props
 * @constructor
 */
function ApexInput<T extends ApexTableColumnHideProps>(props: IProps<T>) {
    const { row, column } = props;
    
    const { apexTableInputProps = {}, name } = column;
    
    const {
    } = useContext<ApexTableProps<T> & ApexTableExtendProps<T>>(ApexContext);
    
    const [focusState, setFocusState] = useState(false);
    
    const inputRef = useRef<InputRef>(null);
    
    const defaultValue = row?.[name];
    
    /**
     * 单击单元格触发
     */
    const handleClick: React.MouseEventHandler<HTMLDivElement> = () => {
        // setFocusState(true);
    }
    
    /**
     * 输入框失去焦点
     * @param event
     */
    const handleInputBlur: React.FocusEventHandler<HTMLInputElement> = (event) => {
        setFocusState(false);
    }
    
    useEffect(() => {
        if (focusState) {
            inputRef.current?.select();
        }
    }, [focusState]);
    
    return <>
        {
            focusState && <Input
                {...apexTableInputProps}
                ref={inputRef}
                defaultValue={defaultValue}
                onBlur={handleInputBlur}
            />
        }
        {
            !focusState && <ApexCell
                row={row}
                column={column}
                onClick={handleClick}
            />
        }
    </>
}

export default ApexInput;