import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { InputField } from './InputField'
import { describe, it, expect, vi } from 'vitest'

describe('InputField', () => {
  it('renders label and accepts input', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<InputField label="Name" placeholder="Type..." onChange={onChange} />)
    const input = screen.getByPlaceholderText('Type...')
    await user.type(input, 'Imran')
    expect(onChange).toHaveBeenCalled()
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
  })

  it('shows error state', () => {
    render(<InputField label="Email" errorMessage="Invalid email" />)
    expect(screen.getByText('Invalid email')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})
