import React, { useEffect, useRef, useState } from "react";
import { IProps } from "./index.types";
import { handleSetFixedPosition } from "apex-table/ApexTable/utils/tools";


function ApexTh<T>(props: IProps<T>) {
    const {
        allowResize = false,
        allowFixed = false,
        column,
        columns,
        rowHeight,
        allowSelect = false,
        showLineNumber = false,
        onColWidthChange
    } = props;
    const { fixed } = column;
    const thRef = useRef<HTMLTableHeaderCellElement>(null);
    const resizeFather = useRef<HTMLDivElement>(null);
    const resizeRef = useRef<HTMLDivElement>(null);
    const startPosition = useRef(0);
    const [dragging, setDragging] = useState(false);
    const [classNames, setClassNames] = useState('');
    const [styles, setStyles] = useState<any>();

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

    /**
     * 初始化类名
     */
    const initClassNames = () => {
        let className = 'apex-table-thead-th';
        if (allowFixed && fixed) {
            className = className.concat(` apex-table-thead-th-fixed apex-table-thead-th-fixed-${fixed}`);
        }
        setClassNames(className);
    }

    /**
     * 初始化样式
     */
    const initStyles = () => {
        const style: any = {
            height: rowHeight
        }
        const newStyle = handleSetFixedPosition({
            styles: style,
            column,
            columns,
            fixed,
            allowSelect,
            showLineNumber
        });
        console.log(newStyle);
        setStyles(newStyle);
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

    useEffect(() => {
        initClassNames();
        initStyles();
    }, [column]);

    return <th
        className={classNames}
        style={styles}
        ref={thRef}
    >
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