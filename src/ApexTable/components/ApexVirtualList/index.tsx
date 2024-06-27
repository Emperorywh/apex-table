import React, { useEffect, useState } from "react";
import { IProps } from "./index.types";
import { flushSync } from 'react-dom';
// 可视区域总高度
const viewableAreaHeight = 500;
// 单行高度
const rowHeight = 45;
// 缓冲区数量
const bufferCount = 5;
// 渲染节点的数量
const renderCount = Math.ceil(viewableAreaHeight / rowHeight);
/**
 * 虚拟列表
 * @returns 
 */
function ApexVirtualList(props: IProps) {
    const { dataSource = [], rowKey = 'id' } = props;
    const [startIndex, setStartIndex] = useState(0);
    const [endIndex, setEndIndex] = useState(0);
    const [renderDataSource, setRenderDataSource] = useState<any[]>([]);
    const [offSet, setOffSet] = useState(0)

    const handleScroll = (event: any) => {
        flushSync(() => {
            const scrollTop = event.target.scrollTop;
            const start = Math.floor(scrollTop / rowHeight);
            const end = Math.floor(start + renderCount);
            const currentOffSet = scrollTop - (scrollTop % rowHeight);
            setStartIndex(start - bufferCount > 0 ? start - bufferCount : 0);
            setEndIndex(end);
            setOffSet(currentOffSet);
        })
    }

    useEffect(() => {
        setEndIndex(renderCount);
    }, [])

    useEffect(() => {
        setRenderDataSource(dataSource);
    }, [dataSource]);

    return <div style={{ height: viewableAreaHeight, overflow: 'auto', position: 'relative' }} onScroll={handleScroll}>
        <div style={{ height: startIndex * rowHeight }}></div>
        {/* <div style={{
            height: rowHeight * renderDataSource.length,
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0
        }}></div>
        <div style={{
            transform: `translate3d(0,${offSet}px, 0)`,
            position: 'relative',
            left: 0,
            top: 0,
            right: 0
        }}> */}
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
        <div style={{ height: (renderDataSource.length * rowHeight) - (startIndex * rowHeight) - ((endIndex - startIndex) * rowHeight) }}></div>
        {/* </div> */}
    </div>
}

export default ApexVirtualList;