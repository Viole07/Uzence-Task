import { useState } from 'react'
import { InputField } from './components/InputField'
import { DataTable } from './components/DataTable'
import type { Column } from './components/DataTable'

type User = { id:number; name:string; email:string; role:string }

const seed: User[] = [
  { id:1, name:'Aman', email:'aman@example.com', role:'Admin' },
  { id:2, name:'Bhavya', email:'bhavya@example.com', role:'User' },
  { id:3, name:'Chirag', email:'chirag@example.com', role:'Manager' },
]

const columns: Column<User>[] = [
  { key:'name', title:'Name', dataIndex:'name', sortable:true },
  { key:'email', title:'Email', dataIndex:'email', sortable:true },
  { key:'role', title:'Role', dataIndex:'role', sortable:true },
]

export default function App() {
  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('')

  return (
    <main className="min-h-dvh bg-white text-zinc-900 p-6 space-y-8">
      <header>
        <h1 className="text-2xl font-bold">Frontend Assignment Demo</h1>
        <p className="text-zinc-500">InputField + DataTable (React + TS + Tailwind v4 + Storybook)</p>
      </header>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <InputField
            label="Email"
            placeholder="you@example.com"
            helperText="We’ll never share your email."
            value={email}
            onChange={(e)=>setEmail((e.target as HTMLInputElement).value)}
            variant="outlined"
            size="md"
            clearable
          />
          <InputField
            label="Password"
            type="password"
            passwordToggle
            value={pwd}
            onChange={(e)=>setPwd((e.target as HTMLInputElement).value)}
            variant="filled"
            size="md"
          />
          <InputField label="Loading Example" placeholder="Fetching..." loading helperText="Simulated async state" variant="ghost" />
          <InputField label="Invalid Example" invalid errorMessage="Please fix this field" />
        </div>
        <div>
          <DataTable<User> data={seed} columns={columns} selectable />
        </div>
      </section>
    </main>
  )
}
