import numpy as np

# fungsi dari papan
def f(x):
    return -0.1*x**4 - 0.5*x**3 - 0.5*x**2 - 0.4*x + 1.2

# central difference
def phi(x, h):
    return (f(x + h) - f(x - h)) / (2*h)

# titik dan step
x = 0.5
h = 0.5

# hitung
phi_h = phi(x, h)
phi_h2 = phi(x, h/2)

# Richardson extrapolation
f_prime = (4/3)*phi_h2 - (1/3)*phi_h

print("phi(h)     =", phi_h)
print("phi(h/2)   =", phi_h2)
print("f'(x) approx =", f_prime)