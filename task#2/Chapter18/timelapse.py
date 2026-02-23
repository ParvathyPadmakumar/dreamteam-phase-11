import time
from anyio import current_time
import sys
import threading
import subprocess

if len(sys.argv)<2:
    print("Use function as python timer.py <program.py>")
    sys.exit(1)

program=sys.argv[1]
print('Press ENTER to begin and to mark laps. Ctrl-C quits.')
input()
print('Started.')
threshold=float(input("Enter maximum allowed runtime in seconds: "))
starttime=time.time() 
lasttime=starttime
lap_number=1

event=threading.Event()
def runtimecheck():
    while event.is_set()==False:
        input() 
        currenttime=time.time()
        totaltime=round(currenttime-starttime,2)
        if totaltime> threshold:
            choice=input(f"\nProgram has been running for {totaltime} seconds. Cancel execution=>(y/n)")
            if choice.lower()=='y':
                print("Exec canceled")
                event.set()
                break
        time.sleep(2)

thread=threading.Thread(target=runtimecheck,daemon=True)
thread.start()
try:
    subprocess.run(["python",program])
except KeyboardInterrupt:
    print("\nExited")
    event.set()

thread.join()
print("Exec finished.")
