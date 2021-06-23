import math
a = ['{0:0{1}}'.format(round(math.pow(2, 2**-(i+1))*10**18), 16)
     for i in range(64)]

# 16 hex is 8 bytes = 64 bits :)
a = ['{0:0{1}}'.format(round(math.pow(2, 2**-(i+1))*10**18), 16)
     for i in range(64)]

b = ''.join(a)
bytes = "\x" + '\\x'.join([b[i:i+2] for i in range(0, len(b), 2)])
