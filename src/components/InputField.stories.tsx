import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { InputField } from './InputField'

const meta: Meta<typeof InputField> = {
  title: 'Components/InputField',
  component: InputField,
  args: { label: 'Email', placeholder: 'you@example.com', variant: 'outlined', size: 'md' },
  parameters: { layout: 'centered' }
}
export default meta
type Story = StoryObj<typeof InputField>

export const Basic: Story = {}

export const Invalid: Story = { args: { invalid: true, errorMessage: 'This field is required' } }

export const Loading: Story = { args: { loading: true } }

export const Password: Story = {
  render: (args) => {
    const [val, setVal] = useState('')
    return (
      <InputField {...args} label="Password" type="password" passwordToggle value={val}
        onChange={(e)=>setVal((e.target as HTMLInputElement).value)} />
    )
  },
  args: { variant: 'filled' }
}

export const Clearable: Story = {
  render: (args) => {
    const [val, setVal] = useState('Clear me')
    return (
      <InputField {...args} value={val} onChange={(e)=>setVal((e.target as HTMLInputElement).value)} clearable />
    )
  }
}
