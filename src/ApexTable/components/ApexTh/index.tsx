import React, { useEffect, useRef, useState } from "react";
import { IProps } from "./index.types";


function ApexTh<T>(props: IProps<T>) {
    const { allowResize = false, column, rowHeight, onColWidthChange } = props;
    const thRef = useRef<HTMLTableHeaderCellElement>(null);
    const resizeFather = useRef<HTMLDivElement>(null);
    const resizeRef = useRef<HTMLDivElement>(null);
    const startPosition = useRef(0);
    const [dragging, setDragging] = useState(false);

    /**
     * 鼠标按下时触发
     * @param event 
     */
    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();
        startPosition.current = event.clientX;
        setDragging(true);
    }

    /**
     * 鼠标放开时触发
     * @param event 
     */
    const handleMouseUp = (event: MouseEvent) => {
        if (dragging) {
            const distance = startPosition.current - event.clientX;
            const originWidth = thRef.current?.getBoundingClientRect().width || 0;
            onColWidthChange(column, originWidth - distance)
            setDragging(false);
        }
    }

    /**
     * 拖动时触发
     * @param event 
     */
    const handleMouseMove = (event: MouseEvent) => {
        if (dragging) {
            let distance = startPosition.current - event.clientX;
            if (resizeRef.current) {
                const width = resizeFather.current?.getBoundingClientRect().width || 0;
                if (distance < width) {
                    resizeRef.current.style.right = distance + 'px';
                }
            }
        }
    }

    useEffect(() => {
        if (dragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            if (resizeRef.current) {
                resizeRef.current.style.right = '-8px';
            }
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging]);

    return <th className={`apex-table-thead-th`} style={{ height: rowHeight }} ref={thRef}>
        <div className={`apex-table-thead-th-content`} ref={resizeFather}>
            <span className={`apex-table-thead-th-text overflow-hidden-one`}>{column['title']}</span>
            {
                allowResize && <div
                    ref={resizeRef}
                    className={`apex-table-thead-th-resize`}
                    onMouseDown={handleMouseDown}
                ></div>
            }
        </div>
    </th>
}

export default ApexTh;