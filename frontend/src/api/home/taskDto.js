import formatDate from "../../util/formatDate"

export class TaskDto {
    constructor(title, description, finishDate, completed = null) {
      this.title = title;
      this.description = description;
      this.finishDate = formatDate(finishDate);
      this.completed = completed;
    }
}
  
export default TaskDto;