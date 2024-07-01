import { Ref, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { BaseSelectRef, IApexSelect, IProps } from "./index.types";
import React from "react";
import { Select } from "antd";
import { DefaultOptionType } from "antd/es/select";
import { onSetScrollBarPosition } from "apex-table/ApexTable/utils/tools";
import ApexShowCell from "../ApexShowCell";
import ApexTd from "../ApexTd";

/**
 * 下拉框组件
 * @param props 
 * @param ref 
 * @returns 
 */
function ApexSelect(props: IProps, ref: Ref<IApexSelect>) {
    const {
        allowSelect,
        showLineNumber,
        allowFixed,
        column,
        columns,
        defaultValue,
        row,
        rowIndex,
        rowHeight,
        tableDivRef,
        onChange,
        onBlur,
        onCellClick,
        onEnter
    } = props;

    const { name, options } = column;
    const [focusState, setFocusState] = useState(false);
    const tableTdRef = useRef<HTMLTableDataCellElement>(null);
    const selectRef = useRef<BaseSelectRef>(null);
    const [selectOption, setSelectOption] = useState<DefaultOptionType[]>([]);

    /**
     * 初始化下拉框
     */
    const initOptions = () => {
        if (options) {
            if (typeof options === 'function') {
                const funcOption = options(row[name], row);
                setSelectOption(funcOption);
            } else if (typeof options === 'object' && Array.isArray(options)) {
                setSelectOption(options);
            }
        }
    }

    /**
     * 点击单元格
     */
    const hanldeCellClick = () => {
        setFocusState(true);
        onCellClick({
            rowIndex: rowIndex,
            columnName: name
        });
    }

    /**
     * 下拉框聚焦
     * @param event 
     */
    const handleInputFocus = (event: React.FocusEvent<HTMLInputElement, Element>) => {
        event.preventDefault();
        setFocusState(true);
        props.onFocus && props.onFocus({
            rowIndex: rowIndex,
            columnName: name
        });
    }

    /**
     * 下拉框失去焦点
     * @param event 
     */
    const handleInputBlur = (event: React.FocusEvent<HTMLInputElement, Element>) => {
        setFocusState(false);
        onBlur && onBlur(event);
    }

    /**
     * 下拉框值的改变
     * @param event 
     */
    const handleSelectChange = (value: any) => {
        onChange && onChange(row, name, value)
    }

    const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event: any) => {
        const key = event.key;
        event.preventDefault();
        switch (key) {
            case 'ArrowUp':
                if (!row[name]) {
                    event.stopPropagation();
                }
                break;
            case 'ArrowDown':
                if (!row[name]) {
                    event.stopPropagation();
                }
                break;
            case 'ArrowLeft':
                break;
            case 'ArrowRight':
                break;
            case 'Enter':
                if (row[name]) {
                    onEnter && onEnter();
                }
                break;
        }
    }


    const focus = () => {
        setFocusState(true);
    }

    const blur = () => {
        setFocusState(false);
    }

    useEffect(() => {
        if (focusState) {
            requestAnimationFrame(() => {
                selectRef.current?.focus();
            })
            onSetScrollBarPosition({
                allowSelect: allowSelect,
                tableDivRef: tableDivRef,
                tableTdRef: tableTdRef,
                axis: {
                    rowIndex: rowIndex,
                    columnName: name
                }
            })
        }
    }, [focusState]);

    useEffect(() => {
        initOptions();
    }, [options]);

    useImperativeHandle(ref, () => {
        return {
            focus,
            blur
        }
    }, [focusState])

    return <ApexTd
        column={column}
        columns={columns}
        rowHeight={rowHeight}
        ref={tableTdRef}
        allowSelect={allowSelect}
        allowFixed={allowFixed}
        showLineNumber={showLineNumber}
    >
        {
            focusState && <Select
                defaultValue={defaultValue || row[name]}
                options={selectOption}
                ref={selectRef}
                allowClear
                onBlur={handleInputBlur}
                onFocus={handleInputFocus}
                onChange={handleSelectChange}
                onKeyDown={handleKeyDown}
            />
        }
        {
            !focusState && <ApexShowCell column={column} row={row} onClick={hanldeCellClick} />
        }
    </ApexTd>
}

export default forwardRef(ApexSelect);