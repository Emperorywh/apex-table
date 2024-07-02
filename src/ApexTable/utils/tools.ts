import { IApexTableColumns, IFocusAxis } from "../index.types";

/**
 * 检查聚焦单元格是否被遮挡
 * 并设置滚动条位置
 * @param params 
 */
export const onSetScrollBarPosition = (params: {
    tableDivRef: React.RefObject<HTMLDivElement>;
    tableTdRef: React.RefObject<HTMLTableDataCellElement>;
    axis: IFocusAxis;
    allowSelect: boolean;
    allowFixed: boolean;
    columns: IApexTableColumns<any>[];
    showLineNumber: boolean;
}) => {
    const { axis, tableDivRef, tableTdRef, allowSelect, allowFixed, showLineNumber, columns } = params
    // 容器相关信息
    const tableRect = tableDivRef.current?.getBoundingClientRect();
    const tableTop = tableRect?.top || 0;
    const tableBottom = tableRect?.bottom || 0;
    const tableLeft = tableRect?.left || 0;
    const tableRight = tableRect?.right || 0;

    // 聚焦单元格相关信息
    const tdRect = tableTdRef.current?.getBoundingClientRect();
    const tdHeight = tdRect?.height || 0;
    const tdTop = tdRect?.top || 0;
    const tdBottom = tdRect?.bottom || 0;
    const tdLeft = tdRect?.left || 0;
    const tdRight = tdRect?.right || 0;

    if (tableDivRef.current && tdRect) {
        const scrollAxis = {
            x: 0,
            y: 0
        }
        // 检查顶部是否在可视区域
        if (tdTop - tableTop < tdHeight) {
            scrollAxis.y = tdTop - tableTop - tdHeight;
        }
        // 检查底部是否在可视区域
        if (tdBottom > tableBottom) {
            scrollAxis.y = tdBottom - tableBottom + 15;
        }
        // 检查左侧是否在可视区域 
        let fixedLeft = 0;
        if (showLineNumber) {
            fixedLeft += 50;
        }
        if (allowSelect) {
            fixedLeft += 50;
        }
        if (allowFixed) {
            for (let i = 0; i < columns.length; i++) {
                const item = columns[i];
                if (item.name === axis.columnName) break;
                if (item?.fixed === 'right') continue;
                const itemFixedLeft = handleSetFixedPosition({
                    styles: {},
                    column: item,
                    columns: columns,
                    fixed: item.fixed,
                    allowSelect,
                    showLineNumber
                })
                const td = document.getElementById(`td-${0}-${item.name}`)?.getBoundingClientRect();
                if (td && itemFixedLeft.left && (itemFixedLeft.left > (td.left - tableLeft) || itemFixedLeft.left === (td.left - tableLeft))) {
                    fixedLeft += td.width;
                }
            }
        }
        if (tdLeft - tableLeft - fixedLeft < tdRect.width) {
            scrollAxis.x = tdLeft - tableLeft - fixedLeft;
        }
        // 检查右侧是否在可视区域
        let fixedRight = 0;
        if (allowFixed) {
            for (let i = columns.length - 1; i > -1; i--) {
                const item = columns[i];
                if (item.name === axis.columnName) break;
                if (item?.fixed === 'left') continue;
                const itemFixedRight = handleSetFixedPosition({
                    styles: {},
                    column: item,
                    columns: columns,
                    fixed: item.fixed,
                    allowSelect,
                    showLineNumber
                })
                const td = document.getElementById(`td-${0}-${item.name}`)?.getBoundingClientRect();
                if (td && itemFixedRight?.right !== undefined && (itemFixedRight.right < (tableRight - 15 - td.right) || itemFixedRight.right === (tableRight - 15 - td.right))) {
                    fixedRight += td.width;
                }
            }
        }
        if (tableRight - tdRight - fixedRight < tdRect.width) {
            scrollAxis.x = tdRight - tableRight + 15 + fixedRight;
        }
        if (scrollAxis.x !== 0 || scrollAxis.y !== 0) {
            tableDivRef.current.scrollBy(scrollAxis.x, scrollAxis.y);
        }
    }
}

/**
 * 设置固定列位置
 * @param params 
 */
export const handleSetFixedPosition = (params: {
    styles: any;
    column: IApexTableColumns<any>;
    columns: IApexTableColumns<any>[];
    fixed?: 'left' | 'right';
    allowSelect: boolean;
    showLineNumber: boolean;
}) => {
    const { styles, fixed, allowSelect, showLineNumber, columns, column } = params;
    const style: any = Object.assign({}, styles);
    if (fixed === 'left') {
        style.left = 0;
        if (allowSelect) {
            style.left += 50;
        }
        if (showLineNumber) {
            style.left += 50;
        }
        for (let i = 0; i < columns.length; i++) {
            const item = columns[i];
            if (item.name !== column.name && item.fixed === 'left') {
                style.left += (item.width || 120)
            }
            if (item.name === column.name) {
                break;
            }
        }
    } else if (fixed === 'right') {
        style.right = 0;
        for (let i = columns.length - 1; i > -1; i--) {
            const item = columns[i];
            if (item.name !== column.name && item.fixed === 'right') {
                style.right += (item.width || 120)
            }
            if (item.name === column.name) {
                break;
            }
        }
    }
    return style;
}