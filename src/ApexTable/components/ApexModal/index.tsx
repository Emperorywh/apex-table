import { Input, InputRef, Modal } from "antd";
import React, { Ref, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { ApexModalRef, IProps } from "./index.types";
import ApexShowCellChildren from "../ApexShowCellChildren/index.tsx";
import { onSetScrollBarPosition } from "apex-table/ApexTable/utils/tools";
import { IApexInput } from "../ApexInput/index.types";
import { EllipsisOutlined } from '@ant-design/icons';

/**
 * 弹窗组件
 * @param props 
 * @param ref 
 * @returns 
 */
function ApexModal(props: IProps, ref: Ref<IApexInput>) {
    const {
        allowSelect,
        column,
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
    const { name, onRender, modalOptions } = column;
    const inputRef = useRef<InputRef>(null);
    const [focusState, setFocusState] = useState(false);
    const tableTdRef = useRef<HTMLTableDataCellElement>(null);
    const modalRef = useRef<ApexModalRef>();

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
     * 输入框失去焦点
     * @param event 
     */
    const handleInputBlur = (event: React.FocusEvent<HTMLInputElement, Element>) => {
        if (event.relatedTarget?.tagName === 'SPAN') {
            setTimeout(() => {
                setFocusState(false);
                onBlur && onBlur(event);
            }, 500);
        } else {
            setFocusState(false);
            onBlur && onBlur(event);
        }
    }

    /**
     * 输入框值的改变
     * @param event 
     */
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange && onChange(row, name, event.target.value)
    }

    /**
     * 输入框聚焦
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

    useEffect(() => {
        if (focusState) {
            requestAnimationFrame(() => {
                inputRef.current?.select();
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

    const focus = () => {
        setFocusState(true);
    }

    const blur = () => {
        setFocusState(false);
    }

    useImperativeHandle(ref, () => {
        return {
            focus,
            blur
        }
    }, [focusState])

    if (modalOptions) {
        const {
            title,
            content,
            icon = null,
            okText = '确定',
            cancelText = '取消',
            footer = null,
            closable = true,
            centered = true,
            onOk,
            onCancel,
            afterClose,
            ...modalProps
        } = modalOptions(row, row[name], modalRef as unknown as any);

        /**
         * 弹窗完全关闭后，需要重新聚焦
         */
        const handleAfterClose = () => {
            focus();
            afterClose && afterClose();
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
                    if (cursorPosition !== selectionEnd) {
                        event.stopPropagation();
                    }
                    break;
                case 'ArrowRight':
                    if (cursorPosition < value.length) {
                        event.stopPropagation();
                    }
                    break;
                case 'Enter':
                    if (value) {
                        onEnter && onEnter();
                    } else {
                        handleShowModal()
                    }
                    break;
            }
        }

        /**
         * 打开弹窗
         */
        const handleShowModal = () => {
            modalRef.current = Modal.info({
                title,
                icon,
                content,
                okText,
                cancelText,
                footer,
                closable,
                centered,
                onOk,
                onCancel,
                afterClose: handleAfterClose,
                ...modalProps
            });
        }


        return <td className={`apex-table-tbody-td`} style={{height: rowHeight}} ref={tableTdRef}>
            {
                focusState && <Input
                    defaultValue={defaultValue || row[name]}
                    ref={inputRef}
                    onBlur={handleInputBlur}
                    onFocus={handleInputFocus}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    suffix={<EllipsisOutlined onClick={handleShowModal} />}
                    onDoubleClick={handleShowModal}
                />
            }
            {
                !focusState && <div className="apex-show-cell" onClick={hanldeCellClick} >
                    {onRender ? onRender(column, row[name]) : <ApexShowCellChildren columnItem={column} dataSourceItem={row} />}
                </div>
            }
        </td>
    } else {
        const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event: any) => {
            const key = event.key;
            const cursorPosition = event.target.selectionStart;
            const selectionEnd = event.target.selectionEnd;
            switch (key) {
                case 'ArrowUp':
                    break;
                case 'ArrowDown':
                    break;
                case 'ArrowLeft':
                    if (cursorPosition !== selectionEnd) {
                        event.stopPropagation();
                    }
                    break;
                case 'ArrowRight':
                    if (cursorPosition < selectionEnd) {
                        event.stopPropagation();
                    }
                    break;
                case 'Enter':
                    if (event.target.value) {
                        onEnter && onEnter();
                    }
                    break;
            }
        }

        return <td className={`apex-table-tbody-td`} style={{height: rowHeight}} ref={tableTdRef}>
            {
                focusState && <Input
                    defaultValue={defaultValue || row[name]}
                    ref={inputRef}
                    onBlur={handleInputBlur}
                    onFocus={handleInputFocus}
                    onChange={handleInputChange}
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
}

export default forwardRef(ApexModal);