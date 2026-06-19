import TextInputWithLabel from "../../../shared/TextInputWithLabel.jsx";
import { isValidTodoTitle } from "../../../utils/todoValidation.js";
import { useEditableTitle } from "../../../hooks/useEditableTitle.js";
import styles from "./TodoListItem.module.css";

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
    const {
        isEditing,
        workingTitle,
        startEditing,
        cancelEdit,
        updateTitle,
        finishEdit,
    } = useEditableTitle(todo.title);

    function handleUpdate(event) {
        event.preventDefault();

        if (!isEditing) {
            return;
        }

        const finalTitle = finishEdit();
        onUpdateTodo({ ...todo, title: finalTitle });
    }

    return (
        <li className={styles.item}>
            <form className={styles.form} onSubmit={handleUpdate}>
                {isEditing ? (
                    <>
                        <div className={styles.editField}>
                            <TextInputWithLabel
                                elementId={`editTodo-${todo.id}`}
                                labelText="Edit todo"
                                value={workingTitle}
                                onChange={(event) => updateTitle(event.target.value)}
                            />
                        </div>

                        <div className={styles.actions}>
                            <button
                                className={`${styles.button} ${styles.cancelButton}`}
                                type="button"
                                onClick={cancelEdit}
                            >
                                Cancel
                            </button>

                            <button
                                className={`${styles.button} ${styles.updateButton}`}
                                type="submit"
                                disabled={!isValidTodoTitle(workingTitle)}
                            >
                                Update
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <label className={styles.checkboxLabel} htmlFor={`checkbox${todo.id}`}>
                            <input
                                className={styles.checkbox}
                                type="checkbox"
                                id={`checkbox${todo.id}`}
                                checked={todo.isCompleted}
                                onChange={() => onCompleteTodo(todo.id)}
                            />

                            <span className={styles.customCheckbox} />
                        </label>

                        <button
                            className={`${styles.titleButton} ${
                                todo.isCompleted ? styles.completed : ""
                            }`}
                            type="button"
                            onClick={startEditing}
                        >
                            {todo.title}
                        </button>
                    </>
                )}
            </form>
        </li>
    );
}

export default TodoListItem;