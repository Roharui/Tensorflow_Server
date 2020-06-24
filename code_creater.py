
import random

c = list('qwertyuiopasdfghjklzxcvbnm1234567890QWERTYUIOPASDFGHJKLZXCVBNM')

def create_code():
    return ''.join(random.choices(c, k=5))
