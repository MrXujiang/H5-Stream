import React, { memo, useEffect, useState, useMemo, useCallback } from 'react';
import { useDrop } from 'react-dnd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import classnames from 'classnames';
import DynamicEngine from '@/core/DynamicEngine';
import { uuid } from '@/utils/tool';
import styles from './index.less';

interface SourceBoxProps {
  canvasId: string;
  allType: string[];
  pointData: { id: string; item: any; point: any; isMenu?: any }[];
  curPoint: any;
  pageConfig: any;
  addPointData: (data: any) => {};
  copyPointData: (data: any) => {};
  delPointData: (data: any) => {};
  modPointData: (data: any) => {};
  changePointData: (data: any) => {};
  onCurPointClick: (data: any) => {};
}

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: 0,
  margin: `0 0 0 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'transparent',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'transparent',
  padding: 0,
  width: '100%',
});

const SourceBox = memo((props: SourceBoxProps) => {
  const {
    pointData,
    pageConfig,
    canvasId,
    allType,
    addPointData,
    copyPointData,
    delPointData,
    changePointData,
    onCurPointClick,
  } = props;

  const [canvasRect, setCanvasRect] = useState([]);

  const [curSelected, setCurSelected] = useState(-1);

  const [{ isOver }, drop] = useDrop({
    accept: allType,
    drop: (item, monitor) => {
      let parentDiv = document.getElementById(canvasId),
        pointRect = parentDiv.getBoundingClientRect(),
        top = pointRect.top,
        pointEnd = monitor.getSourceClientOffset();
      // y = pointEnd.y < top ? 0 : pointEnd.y - top;
      addPointData({
        id: uuid(6, 10),
        item,
        status: 'inToCanvas',
      });
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      item: monitor.getItem(),
    }),
  });

  const onDragEnd = result => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      [...pointData],
      result.source.index,
      result.destination.index,
    );

    setCurSelected(-1);
    changePointData(items);
  };

  const handleItemClick = useCallback(
    (result, index) => {
      console.log(index, curSelected);
      setCurSelected(index);
      onCurPointClick(result);
    },
    [curSelected],
  );

  const handleDel = item => {
    delPointData(item);
  };

  const handleCopy = useCallback(item => {
    copyPointData(item);
  }, []);

  useEffect(() => {
    let { width, height } = document
      .getElementById(canvasId)!
      .getBoundingClientRect();
    setCanvasRect([width, height]);
  }, [canvasId]);

  const opacity = isOver ? 0.7 : 1;

  const render = useMemo(() => {
    return (
      <div className={styles.canvasBox}>
        <div
          id={canvasId}
          className={styles.canvas}
          style={{
            opacity,
            backgroundColor: pageConfig.bgColor,
            backgroundImage: pageConfig.bgImage
              ? `url(${pageConfig.bgImage[0].url})`
              : 'initial',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
          }}
          ref={drop}
        >
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {pointData.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style,
                          )}
                          onClick={() => handleItemClick(item, index)}
                          className={classnames(
                            styles.dragItem,
                            curSelected === index ? styles.selected : '',
                          )}
                        >
                          <DynamicEngine
                            {...(item.item as any)}
                            isTpl={false}
                          />
                          <div className={styles.editControl}>
                            <span
                              className={styles.del}
                              onClick={() => handleDel(item)}
                            >
                              删除
                            </span>
                            <span
                              className={styles.copy}
                              onClick={() => handleCopy(item)}
                            >
                              复制
                            </span>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    );
  }, [canvasId, canvasRect, drop, opacity, pointData, curSelected, pageConfig]);
  return render;
});

export default SourceBox;
