import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DataTable, Column } from './DataTable'
import { describe, it, expect } from 'vitest'

type Row = { id: number; name: string; age: number }
const rows: Row[] = [{ id:1, name:'Imran', age:30 }, { id:2, name:'Asha', age:25 }]
const cols: Column<Row>[] = [
  { key:'name', title:'Name', dataIndex:'name', sortable:true },
  { key:'age', title:'Age', dataIndex:'age', sortable:true },
]

describe('DataTable', () => {
  it('renders rows', () => {
    render(<DataTable<Row> data={rows} columns={cols} />)
    expect(screen.getByText('Imran')).toBeInTheDocument()
  })

  it('supports selection', async () => {
    const user = userEvent.setup()
    render(<DataTable<Row> data={rows} columns={cols} selectable />)
    const first = screen.getByLabelText('Select row 1')
    await user.click(first)
    expect((first as HTMLInputElement).checked).toBe(true)
  })
})
