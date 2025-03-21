import sys
srcpath = ['tiles','game','dice','utils']
testpath = ['tiles','game','dice','utils']
sys.path.extend([f"src/{dir}" for dir in srcpath])
sys.path.extend([f"../src/{dir}" for dir in srcpath])
sys.path.extend([f"../../src/{dir}" for dir in srcpath])
