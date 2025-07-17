import tkinter as tk
from tkinter.scrolledtext import ScrolledText
import serial
import threading


class SerialTerminal(tk.Frame):
    """Simple terminal widget that reads from a serial port."""

    def __init__(self, master, port="/dev/ttyUSB0", baudrate=9600):
        super().__init__(master)
        self.serial = serial.Serial(port, baudrate, timeout=1)
        self.text = ScrolledText(self, wrap="word", height=20, width=80)
        self.text.pack(expand=True, fill="both")
        self.running = True
        self.thread = threading.Thread(target=self._read_serial, daemon=True)
        self.thread.start()

    def _read_serial(self):
        while self.running:
            line = self.serial.readline().decode("utf-8", errors="replace")
            if line:
                self.text.insert("end", line)
                self.text.see("end")

    def stop(self):
        self.running = False
        if self.serial.is_open:
            self.serial.close()


def main():
    root = tk.Tk()
    root.title("Atmos Read Terminal")
    terminal = SerialTerminal(root)
    terminal.pack(expand=True, fill="both")
    def on_close():
        terminal.stop()
        root.destroy()
    root.protocol("WM_DELETE_WINDOW", on_close)
    root.mainloop()


if __name__ == "__main__":
    main()
