import React from "react";
import TaskDto from "../../api/home/taskDto";
import "./modal.css"
import PropTypes from "prop-types";

const AddTaskModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (e.target.className === "modal-overlay") {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal">
                <h2>{initialData ? "Update Task" : "Add New Task"}</h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const taskDto = new TaskDto(
                            formData.get('title'),
                            formData.get('description'),
                            formData.get('finishDate'),
                        );
                        
                        initialData ? onSubmit(initialData.id, taskDto) : onSubmit(taskDto);
                        onClose();
                    }}
                >
                    <div>
                        <label>Title:</label>
                        <input type="text" name="title" required defaultValue={initialData?.title || ""}/>
                    </div>
                    <div>
                        <label>Description:</label>
                        <textarea name="description" defaultValue={initialData?.description || ""}></textarea>
                    </div>
                    <div>
                        <label>Finish Date:</label>
                        <input type="date" name="finishDate" required defaultValue={initialData?.finishDate || ""} />
                    </div>
                    <button type="submit">{initialData ? "Save" : "Add"}</button>
                    <button type="button" onClick={onClose}>
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

AddTaskModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    initialData: PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      finishDate: PropTypes.string.isRequired,
    }).isRequired,
};

export default AddTaskModal;