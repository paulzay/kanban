import { gql } from "@apollo/client";

export const CREATE_TASK_MUTATION = gql`
    mutation createTask(
        $text: String! 
        $columnId: ID!
        ){
        createTask(
            text: $text 
            columnId: $columnId
            ){
            	task {
                    taskId,
                    text
                    column {
                            columnId
                    }}
        }
    }
`

export const UPDATE_TASK_MUTATION =gql `
    mutation updateTask(
        $text: String! 
        $columnId: ID!
        $taskId: ID
        ){
        updateTask(
            text: $text 
            columnId: $columnId
            taskId: $taskId
            ){
                task{
                    text,
                    taskId
                  column{
                    columnId,
                    name
                  }
                }
        }
    }
`

export const DELETE_TASK_MUTATION = gql `
    mutation deleteTask (
        $taskId: ID 
        ){
        deleteTask (
            taskId: $taskId
        ){
            ok
        }
    }
`