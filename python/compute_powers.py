from decimal import Decimal, getcontext

def power(x): 
    return getcontext().power(2,x)

e = Decimal((0, (0, 1), 18))
f = Decimal((0, (0, 1), -18))

a = ['{0:0{1}x}'.format(int(e * power(f * power(i))), 16)
     for i in range(62)]
b = ''.join(a)

bytes = "\\x" + '\\x'.join([b[i:i+2] for i in range(0, len(b), 2)])
print(bytes)