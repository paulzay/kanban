import { gql } from "@apollo/client";

export const LOAD_COLUMNS_AND_TASKS =  gql`
    query {
        columns {
        name,
        columnId
        tasks {
            taskId
            text
        }
    }
    }
`

export const LOAD_COLUMNS = gql`
    query {
        columns{
            name,
            columnId
        }
    }
`

export const LOAD_TASKS = gql `
query {
    tasks{
        text,
        taskId,
        createdAt,
        column {
            columnId
        }
    }
}
`