import os
import sys
import psutil

def find_python_processes():
    python_processes = []
    for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
        try:
            if 'python' in proc.info['name'].lower():
                cmdline = proc.info['cmdline']
                if cmdline:
                    cmd_str = ' '.join(cmdline)
                    python_processes.append((proc.info['pid'], cmd_str))
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass
    return python_processes

def main():
    print("Checking for running Python processes...")
    processes = find_python_processes()
    
    if not processes:
        print("No Python processes found.")
        return
    
    print(f"Found {len(processes)} Python processes:")
    for i, (pid, cmd) in enumerate(processes):
        print(f"{i+1}. PID: {pid}, Command: {cmd}")
    
    # Ask user which process to kill
    try:
        choice = input("\nEnter the number of the process to kill (or 'all' to kill all, 'none' to exit): ")
        if choice.lower() == 'all':
            for pid, _ in processes:
                try:
                    psutil.Process(pid).terminate()
                    print(f"Terminated process {pid}")
                except:
                    print(f"Failed to terminate process {pid}")
        elif choice.lower() == 'none':
            print("No processes killed.")
        else:
            idx = int(choice) - 1
            if 0 <= idx < len(processes):
                pid = processes[idx][0]
                try:
                    psutil.Process(pid).terminate()
                    print(f"Terminated process {pid}")
                except:
                    print(f"Failed to terminate process {pid}")
            else:
                print("Invalid choice.")
    except ValueError:
        print("Invalid input. Please enter a number, 'all', or 'none'.")

if __name__ == "__main__":
    main() 