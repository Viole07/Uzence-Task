import type { Meta, StoryObj } from '@storybook/react'
import { DataTable } from './DataTable'
import type { Column } from './DataTable'   // <-- type-only import (important)


type User = { id: number; name: string; email: string; role: string }

const rows: User[] = [
  { id: 1, name: 'Aman', email: 'aman@example.com', role: 'Admin' },
  { id: 2, name: 'Bhavya', email: 'bhavya@example.com', role: 'User' },
  { id: 3, name: 'Chirag', email: 'chirag@example.com', role: 'Manager' },
]

const columns: Column<User>[] = [
  { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
  { key: 'email', title: 'Email', dataIndex: 'email', sortable: true },
  { key: 'role', title: 'Role', dataIndex: 'role', sortable: true },
]

const meta: Meta<typeof DataTable<User>> = {
  title: 'Components/DataTable',
  component: DataTable<User>,
  args: { data: rows, columns, selectable: true }
}
export default meta
type Story = StoryObj<typeof DataTable<User>>

export const Basic: Story = {}
export const Loading: Story = { args: { loading: true } }
export const Empty: Story = { args: { data: [] } }
