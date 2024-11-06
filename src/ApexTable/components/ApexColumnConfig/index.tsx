import React, { useEffect, useState } from "react";
import { IProps } from 'apex-table/ApexTable/components/ApexColumnConfig/index.types'
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import DraggableColumn from 'apex-table/ApexTable/components/ApexColumnConfig/components/DraggableColumn'
import { DragEndEvent } from '@dnd-kit/core/dist/types'
import { arrayMove, sortableKeyboardCoordinates, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Button, Space } from 'antd'
import { IApexTableColumns } from 'apex-table/ApexTable/index.types'

/**
 * 列配置
 * @constructor
 */
const ApexColumnConfig = (props: IProps<any>) => {
    const { columns = [], onOk, onCancel } = props;
    const [items, setItems] = useState<string[]>([]);
    const [sortColumns, setSortColumns] = useState(columns);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );
    
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        
        if (active && over && active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.indexOf(active.id as any);
                const newIndex = items.indexOf(over.id as any);
                
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }
    
    /**
     * 初始化列
     */
    const initColumns = () => {
        setItems(columns.map(item => item.name));
    }
    
    /**
     * 点击确定
     */
    const handleOk = () => {
        onOk(sortColumns);
    }
    
    useEffect(() => {
        const sortColumnsArray:  IApexTableColumns<any>[] = [];
        items.forEach(sortName => {
            const findColumn = sortColumns.find(sortItem => sortItem.name === sortName);
            if (findColumn) {
                sortColumnsArray.push(findColumn);
            }
        })
        setSortColumns(sortColumnsArray)
    }, [items])
    
    useEffect(() => {
        initColumns();
        setSortColumns(columns);
    }, [columns])
    
    
    return <>
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items}
                strategy={verticalListSortingStrategy}
            >
                <div style={{ height: 500, overflow: 'auto', overflowX: 'hidden' }}>
                    {items.map(item => <DraggableColumn
                        key={item}
                        id={item}
                        columns={sortColumns}
                        onChangeColumn={column => {
                            const tempSort = [...sortColumns];
                            const findColumn = tempSort.find(item => item.name === column.name);
                            if (findColumn) {
                                findColumn.visible = column.visible;
                                setSortColumns(tempSort);
                            }
                        }}
                    />)}
                </div>
            </SortableContext>
        </DndContext>
        <Space style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
            <Button onClick={onCancel}>取消</Button>
            <Button type='primary' onClick={handleOk}>确定</Button>
        </Space>
    </>
}

export default ApexColumnConfig;