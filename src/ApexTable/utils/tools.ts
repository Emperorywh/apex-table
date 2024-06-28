import { IFocusAxis } from "../index.types";

/**
 * 检查聚焦单元格是否被遮挡
 * 并设置滚动条位置
 * @param params 
 */
export const onSetScrollBarPosition = (params: {
    tableDivRef: React.RefObject<HTMLDivElement>,
    tableTdRef: React.RefObject<HTMLTableDataCellElement>,
    axis: IFocusAxis,
    allowSelect: boolean,
}) => {
    const { tableDivRef, tableTdRef, allowSelect } = params
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
        if (tdLeft - tableLeft < tdRect.width) {
            scrollAxis.x = tdLeft - tableLeft - 50;
            if (allowSelect) {
                scrollAxis.x -= 50;
            }
        }
        // 检查右侧是否在可视区域
        if (tableRight - tdRight < tdRect.width) {
            scrollAxis.x = tdRight - tableRight + 15;
        }
        if (scrollAxis.x !== 0 || scrollAxis.y !== 0) {
            tableDivRef.current.scrollBy(scrollAxis.x, scrollAxis.y);
        }
    }
}