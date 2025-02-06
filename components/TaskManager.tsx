"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Plus, Pencil, Trash } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface Task {
  id: string
  title: string
  description: string | null
  due_date: string | null
  completed: boolean
  priority: string | null
}

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [priority, setPriority] = useState<string>("normal")

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    const { data, error } = await supabase.from("tasks").select("*").order("due_date", { ascending: true })

    if (error) {
      console.error("Error fetching tasks:", error)
    } else {
      setTasks(data || [])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (currentTask) {
      await updateTask()
    } else {
      await addTask()
    }
    setIsDialogOpen(false)
    resetForm()
    await fetchTasks()
  }

  const addTask = async () => {
    const { error } = await supabase.from("tasks").insert([
      {
        title,
        description,
        due_date: dueDate?.toISOString(),
        priority,
      },
    ])

    if (error) {
      console.error("Error adding task:", error)
    }
  }

  const updateTask = async () => {
    if (!currentTask) return

    const { error } = await supabase
      .from("tasks")
      .update({
        title,
        description,
        due_date: dueDate?.toISOString(),
        priority,
      })
      .eq("id", currentTask.id)

    if (error) {
      console.error("Error updating task:", error)
    }
  }

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id)

    if (error) {
      console.error("Error deleting task:", error)
    } else {
      await fetchTasks()
    }
  }

  const toggleTaskCompletion = async (task: Task) => {
    const { error } = await supabase.from("tasks").update({ completed: !task.completed }).eq("id", task.id)

    if (error) {
      console.error("Error toggling task completion:", error)
    } else {
      await fetchTasks()
    }
  }

  const openEditDialog = (task: Task) => {
    setCurrentTask(task)
    setTitle(task.title)
    setDescription(task.description || "")
    setDueDate(task.due_date ? new Date(task.due_date) : undefined)
    setPriority(task.priority || "normal")
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setCurrentTask(null)
    setTitle("")
    setDescription("")
    setDueDate(undefined)
    setPriority("normal")
  }

  return (
    <Card className="mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Tareas</CardTitle>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Agregar Tarea
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <Checkbox checked={task.completed} onCheckedChange={() => toggleTaskCompletion(task)} />
                <div>
                  <h3 className={`font-medium ${task.completed ? "line-through text-gray-500" : ""}`}>{task.title}</h3>
                  {task.due_date && (
                    <p className="text-sm text-gray-500">
                      Fecha límite: {format(new Date(task.due_date), "PPP", { locale: es })}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon" onClick={() => openEditDialog(task)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => deleteTask(task.id)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentTask ? "Editar Tarea" : "Agregar Nueva Tarea"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input placeholder="Título de la tarea" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <Textarea
              placeholder="Descripción (opcional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP", { locale: es }) : "Seleccionar fecha límite"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
              </PopoverContent>
            </Popover>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="low">Baja</option>
              <option value="normal">Normal</option>
              <option value="high">Alta</option>
            </select>
            <DialogFooter>
              <Button type="submit">{currentTask ? "Actualizar Tarea" : "Agregar Tarea"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

