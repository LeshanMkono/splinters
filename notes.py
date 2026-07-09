import tkinter as tk
from tkinter import filedialog
import os

class NotesApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Notes App")
        self.root.geometry("800x600")
        self.current_file = None

        toolbar = tk.Frame(root, bg="#333")
        toolbar.pack(fill=tk.X)

        for label, cmd in [("New", self.new_note), ("Open", self.open_note),
                            ("Save", self.save_note), ("Save As", self.save_as)]:
            tk.Button(toolbar, text=label, command=cmd,
                      bg="#555", fg="white", relief=tk.FLAT,
                      padx=10, pady=5).pack(side=tk.LEFT, padx=2, pady=2)

        self.text = tk.Text(root, font=("Monospace", 12), wrap=tk.WORD,
                            undo=True, bg="#1e1e1e", fg="#d4d4d4",
                            insertbackground="white")
        self.text.pack(fill=tk.BOTH, expand=True)

        scrollbar = tk.Scrollbar(self.text)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        self.text.config(yscrollcommand=scrollbar.set)
        scrollbar.config(command=self.text.yview)

    def new_note(self):
        self.text.delete(1.0, tk.END)
        self.current_file = None
        self.root.title("Notes App - New Note")

    def open_note(self):
        path = filedialog.askopenfilename(
            filetypes=[("Text files", "*.txt"), ("All files", "*.*")]
        )
        if path:
            with open(path, "r") as f:
                self.text.delete(1.0, tk.END)
                self.text.insert(tk.END, f.read())
            self.current_file = path
            self.root.title(f"Notes App - {os.path.basename(path)}")

    def save_note(self):
        if self.current_file:
            with open(self.current_file, "w") as f:
                f.write(self.text.get(1.0, tk.END))
        else:
            self.save_as()

    def save_as(self):
        path = filedialog.asksaveasfilename(
            defaultextension=".txt",
            filetypes=[("Text files", "*.txt")]
        )
        if path:
            self.current_file = path
            self.save_note()
            self.root.title(f"Notes App - {os.path.basename(path)}")


root = tk.Tk()
NotesApp(root)
root.mainloop()
