e = 10**18
c = [2,9,72,1008,30240]
a = [int(e / c[i]) for i in range(5)]
b = ['{0:0{1}x}'.format(k, 16) for k in a]
c = ''.join(b)
bytes = "\\x" + '\\x'.join([c[i:i+2] for i in range(0, len(c), 2)])
print(bytes)