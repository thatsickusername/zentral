export interface Task {
    id?: string
    content: string
    completed: boolean
    createdAt: any
    updatedLocally?: boolean
    isNew?: boolean
    deleted?: boolean
}