import tkinter as tk
from tkinter import messagebox, simpledialog
import json
import os

TASKS_FILE = 'tasks.json'

def load_tasks():
    if os.path.exists(TASKS_FILE):
        with open(TASKS_FILE, 'r') as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                return []
    return []

def save_tasks(tasks):
    with open(TASKS_FILE, 'w') as f:
        json.dump(tasks, f)

class TaskApp(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title('Task Manager')
        self.geometry('300x400')

        self.tasks = load_tasks()

        self.task_listbox = tk.Listbox(self, selectmode=tk.SINGLE)
        self.task_listbox.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)

        button_frame = tk.Frame(self)
        button_frame.pack(fill=tk.X, padx=10)

        add_btn = tk.Button(button_frame, text='Add Task', command=self.add_task)
        add_btn.pack(side=tk.LEFT, expand=True, fill=tk.X)

        remove_btn = tk.Button(button_frame, text='Remove', command=self.remove_task)
        remove_btn.pack(side=tk.LEFT, expand=True, fill=tk.X)

        done_btn = tk.Button(button_frame, text='Mark Done', command=self.mark_done)
        done_btn.pack(side=tk.LEFT, expand=True, fill=tk.X)

        self.refresh_tasks()

    def add_task(self):
        task = simpledialog.askstring('New Task', 'Enter task description:')
        if task:
            self.tasks.append({'description': task, 'done': False})
            self.refresh_tasks()
            save_tasks(self.tasks)

    def remove_task(self):
        idx = self.task_listbox.curselection()
        if not idx:
            messagebox.showwarning('Remove Task', 'No task selected')
            return
        self.tasks.pop(idx[0])
        self.refresh_tasks()
        save_tasks(self.tasks)

    def mark_done(self):
        idx = self.task_listbox.curselection()
        if not idx:
            messagebox.showwarning('Mark Done', 'No task selected')
            return
        self.tasks[idx[0]]['done'] = True
        self.refresh_tasks()
        save_tasks(self.tasks)

    def refresh_tasks(self):
        self.task_listbox.delete(0, tk.END)
        for task in self.tasks:
            desc = task['description']
            if task.get('done'):
                desc += ' [DONE]'
            self.task_listbox.insert(tk.END, desc)

if __name__ == '__main__':
    app = TaskApp()
    app.mainloop()
