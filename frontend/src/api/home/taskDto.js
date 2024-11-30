import formatDate from "../../util/formatDate"

const TaskDto = (title, description, finishDate, completed = null) => {
  return {
      title,
      description,
      finishDate: formatDate(finishDate),
      completed
    }
}

export default TaskDto;