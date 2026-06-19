import {cleanup, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, it, expect, vi } from 'vitest'

import TodoForm from './TodoForm.jsx'

afterEach(() => {
    cleanup()
})

describe('TodoForm', () => {
    it('submits a valid todo', async () => {
        const user = userEvent.setup()

        const mockAddTodo = vi.fn()

        render(<TodoForm onAddTodo={mockAddTodo} />)

        const input = screen.getByRole('textbox')

        await user.type(input, 'Learn Vitest')

        const button = screen.getByRole('button', {
            name: /add/i
        })

        await user.click(button)

        expect(mockAddTodo).toHaveBeenCalledTimes(1)

        expect(mockAddTodo).toHaveBeenCalledWith(
            'Learn Vitest',
        )
    })

    it('does not submit an invalid todo', () => {

        const mockAddTodo = vi.fn()

        render(<TodoForm onAddTodo={mockAddTodo} />)

        const button = screen.getByRole('button', {
            name: /add/i
        })

        expect(button.disabled).toBe(true)
        expect(mockAddTodo).not.toHaveBeenCalled()
    })
})