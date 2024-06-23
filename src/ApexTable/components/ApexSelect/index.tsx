import { Ref, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { BaseSelectRef, IApexSelect, IProps } from "./index.types";
import React from "react";
import ApexShowCellChildren from "../ApexShowCellChildren/index.tsx";
import { Select } from "antd";
import { DefaultOptionType } from "antd/es/select";
import { onSetScrollBarPosition } from "apex-table/ApexTable/utils/tools";

/**
 * 下拉框组件
 * @param props 
 * @param ref 
 * @returns 
 */
function ApexSelect(props: IProps, ref: Ref<IApexSelect>) {
    const {
        allowSelect,
        column,
        defaultValue,
        row,
        rowIndex,
        tableDivRef,
        onChange,
        onBlur,
        onCellClick,
        onEnter
    } = props;

    const { name, onRender, options } = column;
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
        const cursorPosition = event.target.selectionStart;
        const selectionEnd = event.target.selectionEnd;
        const value = event?.target?.value || '';
        switch (key) {
            case 'ArrowUp':
                break;
            case 'ArrowDown':
                break;
            case 'ArrowLeft':

            case 'ArrowRight':

            case 'Enter':
                onEnter && onEnter();
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
    }, []);

    useImperativeHandle(ref, () => {
        return {
            focus,
            blur
        }
    }, [focusState])

    return <td className={`apex-table-tbody-td`} ref={tableTdRef}>
        {
            focusState && <Select
                defaultValue={defaultValue || row[name]}
                options={selectOption}
                ref={selectRef}
                onBlur={handleInputBlur}
                onFocus={handleInputFocus}
                onChange={handleSelectChange}
                onKeyDown={handleKeyDown}
            />
        }
        {
            !focusState && <div className="apex-show-cell" onClick={hanldeCellClick} >
                {onRender ? onRender(column, row[name]) : <ApexShowCellChildren columnItem={column} dataSourceItem={row} />}
            </div>
        }
    </td>
}

export default forwardRef(ApexSelect);