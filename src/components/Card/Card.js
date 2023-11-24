import React from "react";
import delicon from '../../delete.svg'
import editicon from '../../edit.svg'
import { useDrag } from 'react-dnd'
import './card.css';

export const ItemTypes = {
    CARD: 'card',
    COLUMN: 'column'
}

export default function Card({text, taskId, deleteTask, editTask}){
    const [{ opacity }, dragRef] = useDrag(
        () => ({
          type: ItemTypes.CARD,
          item: {taskId: taskId, text:text},
          collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
            opacity: monitor.isDragging() ? 0.5 : 1
          }),
        }),
        []
      )

    return (
        <div style={{ opacity }} className="card" 
        ref={dragRef}
        id={taskId} >
            {text}
            <div>
            <img src={editicon} onClick={editTask} alt='edit'/>
              <img src={delicon} onClick={deleteTask} alt='delete'/>
            </div>
        </div>
    )
}