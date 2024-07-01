import React, { forwardRef, useEffect, useState } from "react";
import { IProps } from "./index.types";

function ApexTd(props: IProps<any>, ref: React.Ref<HTMLTableDataCellElement>) {
    const {
        rowHeight,
        children,
        column,
        columns,
        allowFixed,
        allowSelect,
        showLineNumber
    } = props;
    const { fixed } = column;
    const [classNames, setClassNames] = useState('');
    const [styles, setStyles] = useState<any>();
    /**
     * 初始化类名
     */
    const initClassNames = () => {
        let className = 'apex-table-tbody-td';
        if (allowFixed && fixed) {
            className = className.concat(` apex-table-tbody-td-fixed apex-table-tbody-td-fixed-${fixed}`);
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
        setStyles(style);
    }

    useEffect(() => {
        initClassNames();
        initStyles();
    }, [columns]);


    return <td
        className={classNames}
        style={styles}
        ref={ref}
    >
        {children}
    </td>
}

export default forwardRef(ApexTd);