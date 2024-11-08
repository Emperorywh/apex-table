import React, { useEffect, useState } from "react";
import { IProps } from './index.types';
import { Empty } from "antd";
import ApexTr from 'apex-table/ApexTable/components/ApexTr'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { DragEndEvent } from '@dnd-kit/core/dist/types'
import { flushSync } from 'react-dom'

function ApexTbody<T>(props: IProps<T>) {
    const {
        tableDataSource,
        dataSource,
        rowKey,
        startIndex,
        endIndex,
        rowHeight,
        totalHeight,
        allowRowAddDel,
        onChangeTableData,
        allowRowDrag
    } = props;
    
    const topHeight = startIndex * rowHeight;
    const bottomHeight = totalHeight - (startIndex * rowHeight) - ((endIndex - startIndex) * rowHeight);
    
    const [dragKeys, setDragKeys] = useState<any[]>([]);
    const [activeDragKey, setActiveDragKey] = useState<any>('');
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );
    
    const handleDragStart = (event: DragEndEvent) => {
        const { active } = event;
        flushSync(() => {
            setActiveDragKey(active.id);
        })
    }
    
    const handleDragEnd = (event: DragEndEvent) => {
        flushSync(() => {
            const { active, over } = event;
            
            if (active && over && active.id !== over.id) {
                const oldIndex = dragKeys.indexOf(active.id as any);
                const newIndex = dragKeys.indexOf(over.id as any);
                const newDragKeys = arrayMove(dragKeys, oldIndex, newIndex);
                setDragKeys(newDragKeys);
                const newDataSource: any[] = [];
                newDragKeys.forEach(item => {
                    const findData = tableDataSource.find(dataItem => dataItem[rowKey] === item);
                    if (findData) {
                        newDataSource.push(findData);
                    }
                });
                onChangeTableData(newDataSource);
                setActiveDragKey('');
            }
        })
    }
    
    useEffect(() => {
        const keys = tableDataSource.map(item => item[rowKey]);
        setDragKeys(keys);
    }, [tableDataSource])
    
    return <tbody className='apex-table-tbody'>
    {
        dataSource.length > 0 && topHeight > 0 && <tr style={{ height: topHeight }}/>
    }
    {
        allowRowDrag ? <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
        >
            <SortableContext
                items={dragKeys}
                strategy={verticalListSortingStrategy}
            >
                {
                    dataSource.map((dataSourceItem) => {
                        
                        return <ApexTr
                            key={`apex-table-tbody-tr-${dataSourceItem['rowIndex']}`}
                            {...props}
                            dataSourceItem={dataSourceItem}
                            activeDragKey={activeDragKey}
                        />
                    })
                }
            </SortableContext>
        </DndContext> : dataSource.map((dataSourceItem) => {
            
            return <ApexTr
                key={`apex-table-tbody-tr-${dataSourceItem['rowIndex']}`}
                {...props}
                dataSourceItem={dataSourceItem}
                activeDragKey={activeDragKey}
                allowRowDrag={allowRowDrag}
                allowRowAddDel={allowRowAddDel}
            />
        })
    }
    
    {
        dataSource.length > 0 && bottomHeight > 0 && <tr style={{ height: bottomHeight }}/>
    }
    </tbody>
}

export default ApexTbody;