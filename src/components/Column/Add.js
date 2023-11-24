import React, { useEffect } from 'react'
import { CREATE_TASK_MUTATION } from '../../Graphql/Mutations';
import { useMutation } from '@apollo/client';

function Add({columnId, handleCallback, showForm, setShowForm, text, setText, taskId, handleUpdate }) {
	const [createTask, {error, data}] = useMutation(CREATE_TASK_MUTATION);
	useEffect(()=> {
		if(data){
			handleCallback(data.createTask.task)
		}
	  },[data])

	function handleSubmit(event){
		if (event.key === "Enter" && text.length > 0) {
			if (taskId){
				handleUpdate()
			}else {
				createTask({
					variables: {
						text: text,
						columnId: columnId
					}
				})
			}
			setShowForm(false);
			setText('')
		}

		if(error) {
		throw new Error(error)}
	}

	return (
		<div className='input-container'>
			{showForm && 			
				<input
				placeholder='Add Task' 
				value={text}
				onChange={e => setText(e.target.value)}
				onKeyDown={handleSubmit}
				/>
				
			}
			{ !showForm && <button onClick={() => setShowForm(true)}>Create Task</button>}
		</div> 
	)
}

export default Add;
