import React, { useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import Card from '../Card/Card';
import './column.css';
import Add from './Add';
import { UPDATE_TASK_MUTATION, DELETE_TASK_MUTATION } from '../../Graphql/Mutations';
import { useMutation, useQuery } from '@apollo/client';
import { LOAD_TASKS } from '../../Graphql/Queries';
import up from '../../sortup.svg';
import down from '../../sortdown.svg';
import neutral from'../../nosort.svg';

export default function Column({text, columnId}){
  const { data} = useQuery(LOAD_TASKS);
  const [columnTasks, setColumnTasks] = useState([]);
  const [ taskdata, setTaskdata] = useState([])
	const [updateTask, {error}] = useMutation(UPDATE_TASK_MUTATION);
  const [deleteTask] = useMutation(DELETE_TASK_MUTATION);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [currentTaskId, setCurrentTaskId] = useState('');
  const [currentColumnId, setCurrentColumnId] = useState('');
  const [sortTasks, setSortTasks] = useState("neutral")

  useEffect(()=> {
    if (data){
      setTaskdata(data.tasks)
    }
  },[data])

  useEffect(()=> {
    if(taskdata){
    setColumnTasks(taskdata.filter(task => task.column.columnId === columnId))
  }},[taskdata, columnId])

  useEffect(()=> {
  
  },[columnTasks, columnId])

  const [{isOver}, dropRef] = useDrop(() => ({
    accept: "card",
    drop: (item)=> addCardToColumn(item.taskId, item.text),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    })
  }))
  
  const addCardToColumn = (id, text) => {
    updateTask({
      variables: {
        text: text,
        columnId: columnId,
        taskId: id
      },
    })

    setTaskdata(prev => {
      const modTask = prev.map(task =>{
        if (task.taskId === id){
          return {...task, column: {columnId: columnId }}
        }else{
          return task;
        }
      })
      return modTask;
    })

    if(error) {
      throw new Error(error)}
  }

  function callBack(childData){
    const arr = [...columnTasks]
    arr.push(childData)
    setColumnTasks(arr)
  }

  function handleDelete(id){
    deleteTask({
      variables: {
        taskId: id
      },
    })
    if(error) {
      throw new Error(error)
    }else {
      setTaskdata(taskdata.filter((task)=> id !== task.taskId))
    }
  }

  function handleUpdate(id){
    const currentTask = taskdata.filter((task)=> id === task.taskId)
    setTaskdata(taskdata.filter((task)=> id !== task.taskId))
    setShowForm(true);
    setName(currentTask[0].text);
    setCurrentTaskId(currentTask[0].taskId)
    setCurrentColumnId(currentTask[0].column.columnId)
  }

  function submitUpdate(){
    updateTask({
      variables: {
        text: name,
        columnId: currentColumnId,
        taskId: currentTaskId
      },
    })

    let obj = {}

    obj = {
      text: name,
      column: {columnId:currentColumnId},
      taskId: currentTaskId 
    }

    const arr = [...taskdata]
    arr.push(obj)
    setTaskdata(arr)
  }

  function handleSort(){

    if (sortTasks === "neutral"){
      setColumnTasks([...columnTasks].sort((a,b)=> {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateA - dateB
      }))
      setSortTasks("up")
    }else if (sortTasks === "up"){
      setColumnTasks([...columnTasks].sort((a,b)=> {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA;
      }))
      setSortTasks("down")
    }else if (sortTasks === "down"){
      setSortTasks("neutral")
      setColumnTasks(taskdata.filter(task => task.column.columnId === columnId))
    }
  }

  return (
  <div className='column' ref={dropRef} >
    <div className='col-title'>
      <h2>{text}</h2>
      <img src={sortTasks == "neutral" && neutral || sortTasks === "up" && up || sortTasks === "down" && down} alt='sort' onClick={handleSort}/>
    </div>
    {columnTasks.map(task => (
      <Card text={task.text} key={task.taskId} 
        taskId={task.taskId} deleteTask={()=>handleDelete(task.taskId)}
        editTask={()=>handleUpdate(task.taskId)}
      />
    ))}
    <Add columnId={columnId} handleCallback={callBack} setShowForm={setShowForm} 
      showForm={showForm} text={name} setText={setName} handleUpdate={submitUpdate} taskId={currentTaskId}/>
  </div>
  )
}
