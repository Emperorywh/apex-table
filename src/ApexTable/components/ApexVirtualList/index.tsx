import React, { useEffect, useMemo, useRef, useState } from "react";
import { IProps } from "./index.types";

/**
 * 虚拟列表
 * @returns 
 */
function ApexVirtualList(props: IProps) {
    const { dataSource = [], rowKey = 'id' } = props;
    const [startIndex, setStartIndex] = useState(0);
    const [endIndex, setEndIndex] = useState(0);
    const [renderDataSource, setRenderDataSource] = useState<any[]>([]);

    // 可视区域总高度
    const viewableAreaHeight = 500;
    // 单行高度
    const rowHeight = 45;

    const limit = useMemo(() => {
        return Math.ceil(viewableAreaHeight / rowHeight);
    }, [])

    const handleScroll = (event: any) => {
        const scrollTop = event.target.scrollTop;
        const currentIndex = Math.floor(scrollTop / rowHeight);
        setStartIndex(currentIndex - 5 > 0 ? currentIndex - 5 : currentIndex);
    }

    useEffect(() => {
        setEndIndex(startIndex + limit + 5);
    }, [startIndex])

    useEffect(() => {
        setRenderDataSource(dataSource);
    }, [dataSource]);

    return <div style={{ height: viewableAreaHeight, overflow: 'auto' }} onScroll={handleScroll}>
        <div style={{ height: startIndex * rowHeight }}></div>
        {
            renderDataSource.slice(startIndex, endIndex).map((item, index) => {
                return <div
                    key={item[rowKey]}
                    style={{
                        backgroundColor: index % 2 === 0 ? 'rgb(252,229,214)' : 'rgb(223,235,247)',
                        height: rowHeight,
                        display: 'flex',
                        alignItems: 'center'
                    }}>{item?.num}</div>
            })
        }
        <div style={{ height: renderDataSource.length * rowHeight }}></div>
    </div>
}

export default ApexVirtualList;