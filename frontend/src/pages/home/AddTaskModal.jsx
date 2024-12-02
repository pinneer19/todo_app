import React, {useRef, useEffect} from "react";
import TaskDto from "../../api/home/taskDto";
import "./modal.css"
import PropTypes from "prop-types";

const AddTaskModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const textAreaRef = useRef(null);

    const autoExpand = (e) => {
        const textarea = e.target;
        const maxScrollHeight = window.innerHeight * 0.5; // 50vh
    
        textarea.style.height = "auto";
        textarea.style.overflowY = "hidden";
        textarea.style.height = `${textarea.scrollHeight}px`;
    
        if (textarea.scrollHeight > maxScrollHeight) {
            textarea.style.height = `${maxScrollHeight}px`;
            textarea.style.overflowY = "auto";
        } else {
            textarea.style.overflowY = "hidden";
        }
    };

    useEffect(() => {
        if (isOpen && textAreaRef.current) {
            textAreaRef.current.style.height = "auto";
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>{initialData ? "Update Task" : "Add New Task"}</h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const taskDto = TaskDto(
                            formData.get('title'),
                            formData.get('description'),
                            formData.get('finishDate'),
                        );
                        
                        initialData ? onSubmit(initialData.id, taskDto) : onSubmit(taskDto);
                        onClose();
                    }}
                >
                    <div>
                        <label htmlFor="title">Title:</label>
                        <input
                            type="text"
                            id="title" 
                            name="title"
                            required
                            maxLength={255}
                            defaultValue={initialData?.title || ""}
                        />
                    </div>
                    <div>
                        <label htmlFor="description">Description:</label>
                        <textarea
                            name="description"
                            id="description"
                            maxLength={500}
                            defaultValue={initialData?.description || ""}
                            ref={textAreaRef}
                            onInput={autoExpand}
                        />
                    </div>
                    <div>
                        <label htmlFor="finishDate">Finish Date:</label>
                        <input
                            type="date"
                            id="finishDate"
                            name="finishDate"
                            required
                            defaultValue={initialData?.finishDate || ""}
                        />
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