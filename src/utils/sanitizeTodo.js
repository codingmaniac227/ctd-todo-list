import DOMPurify from "dompurify";
import { isValidTodoTitle } from "./todoValidation.js";

export function getTodoValidationError(title) {
    if (!title || title.trim() === "") {
        return "Todo cannot be empty.";
    }

    if (!isValidTodoTitle(title)) {
        return "Todo title is not valid.";
    }

    if (title.length > 100) {
        return "Todo must be 100 characters or less.";
    }

    return "";
}

export function sanitizeTodoTitle(title) {
    return DOMPurify.sanitize(title.trim(), {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
    });
}