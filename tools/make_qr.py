#!/usr/bin/env python3
"""Minimal QR encoder (version 2, ECC L, byte mode, mask 0) -> SVG/PNG.
Used to render the footer 'scan for the app' code of the BussMetrics site."""
import sys

PRIM = 0x11D

EXP = [0] * 512
_x = 1
for _i in range(255):
    EXP[_i] = _x
    EXP[_i + 255] = _x
    _x <<= 1
    if _x & 0x100:
        _x ^= PRIM

def alpha(k):
    return EXP[k % 255]

def gf_mul(a, b):
    r = 0
    while b:
        if b & 1:
            r ^= a
        a <<= 1
        if a & 0x100:
            a ^= PRIM
        b >>= 1
    return r & 0xFF

def rs_generator(deg):
    g = [1]
    for i in range(deg):
        # multiply g by (x - alpha^i)
        ng = [0] * (len(g) + 1)
        for j, c in enumerate(g):
            ng[j] ^= c
            ng[j + 1] ^= gf_mul(c, alpha(i))
        g = ng
    return g

def rs_encode(data, deg):
    g = rs_generator(deg)
    res = data + [0] * deg
    for i in range(len(data)):
        coef = res[i]
        if coef:
            for j in range(len(g)):
                res[i + j] ^= gf_mul(g[j], coef)
    return res[len(data):]

def encode_text(text):
    data = text.encode('utf-8')
    assert len(data) <= 32, "too long for v2-L byte mode"
    bits = '0100' + format(len(data), '08b')
    for b in data:
        bits += format(b, '08b')
    cap = 34 * 8
    bits += '0' * min(4, cap - len(bits))
    while len(bits) % 8:
        bits += '0'
    codewords = [int(bits[i:i + 8], 2) for i in range(0, len(bits), 8)]
    pad = [0xEC, 0x11]
    k = 0
    while len(codewords) < 34:
        codewords.append(pad[k % 2]); k += 1
    ecc = rs_encode(codewords, 10)
    return codewords + ecc

SIZE = 25

def build_matrix(codewords):
    m = [[None] * SIZE for _ in range(SIZE)]
    func = [[False] * SIZE for _ in range(SIZE)]

    def set_f(r, c, v):
        m[r][c] = v
        func[r][c] = True

    # finder patterns + separators
    for (r0, c0) in ((0, 0), (0, SIZE - 7), (SIZE - 7, 0)):
        for r in range(-1, 8):
            for c in range(-1, 8):
                rr, cc = r0 + r, c0 + c
                if 0 <= rr < SIZE and 0 <= cc < SIZE:
                    inside = 0 <= r <= 6 and 0 <= c <= 6
                    v = 0
                    if inside:
                        v = 1 if (r in (0, 6) or c in (0, 6) or (2 <= r <= 4 and 2 <= c <= 4)) else 0
                    set_f(rr, cc, v)
    # timing
    for i in range(8, SIZE - 8):
        set_f(6, i, i % 2 == 0)
        set_f(i, 6, i % 2 == 0)
    # alignment pattern centred (18,18)
    for r in range(16, 21):
        for c in range(16, 21):
            v = 1 if (r in (16, 20) or c in (16, 20) or (r, c) == (18, 18)) else 0
            set_f(r, c, v)
    # reserve format areas
    for i in range(9):
        if not func[8][i]:
            set_f(8, i, 0)
        if not func[i][8]:
            set_f(i, 8, 0)
    for i in range(8):
        set_f(8, SIZE - 1 - i, 0)
        set_f(SIZE - 1 - i, 8, 0)
    set_f(SIZE - 8, 8, 1)  # dark module

    # data bits
    bits = ''
    for cw in codewords:
        bits += format(cw, '08b')
    bits += '0' * 7  # remainder bits v2
    idx = 0
    col = SIZE - 1
    upward = True
    while col > 0:
        if col == 6:
            col -= 1
        for r in range(SIZE):
            row = (SIZE - 1 - r) if upward else r
            for c in (col, col - 1):
                if not func[row][c]:
                    v = int(bits[idx]) if idx < len(bits) else 0
                    idx += 1
                    if (row + c) % 2 == 0:  # mask 0
                        v ^= 1
                    m[row][c] = v
        upward = not upward
        col -= 2

    # format info (ECC L, mask 0)
    fmt = '111011111000100'
    pos_a = [(8, 0), (8, 1), (8, 2), (8, 3), (8, 4), (8, 5), (8, 7), (8, 8),
             (7, 8), (5, 8), (4, 8), (3, 8), (2, 8), (1, 8), (0, 8)]
    for i, (r, c) in enumerate(pos_a):
        m[r][c] = int(fmt[i])
    for i in range(7):
        m[SIZE - 1 - i][8] = int(fmt[i])
    for i in range(8):
        m[8][SIZE - 8 + i] = int(fmt[7 + i])
    return m

def to_svg(m, path, quiet=4):
    n = SIZE + quiet * 2
    out = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {n} {n}" shape-rendering="crispEdges">']
    out.append(f'<rect width="{n}" height="{n}" fill="#ffffff"/>')
    for r in range(SIZE):
        for c in range(SIZE):
            if m[r][c]:
                out.append(f'<rect x="{c + quiet}" y="{r + quiet}" width="1" height="1" fill="#0d2240"/>')
    out.append('</svg>')
    with open(path, 'w') as f:
        f.write('\n'.join(out))

def to_png(m, path, scale=8, quiet=4):
    import zlib, struct
    n = (SIZE + quiet * 2) * scale
    rows = []
    for y in range(n):
        r = y // scale - quiet
        line = bytearray([0])
        for x in range(n):
            c = x // scale - quiet
            dark = 0 <= r < SIZE and 0 <= c < SIZE and m[r][c]
            v = 13 if dark else 255  # #0d2240 approximated per-channel below
            line += bytes((13, 34, 64) if dark else (255, 255, 255))
        rows.append(bytes(line))
    raw = b''.join(rows)

    def chunk(tag, data):
        return (struct.pack('>I', len(data)) + tag + data +
                struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff))
    png = b'\x89PNG\r\n\x1a\n'
    png += chunk(b'IHDR', struct.pack('>IIBBBBB', n, n, 8, 2, 0, 0, 0))
    png += chunk(b'IDAT', zlib.compress(raw, 9))
    png += chunk(b'IEND', b'')
    open(path, 'wb').write(png)


if __name__ == '__main__':
    text = sys.argv[1] if len(sys.argv) > 1 else 'https://bussmetrics.example'
    cw = encode_text(text)
    # self-check: syndromes must be zero
    data = cw[:34]
    ok = True
    for i in range(10):
        s = 0
        for j, c in enumerate(cw):
            s ^= gf_mul(c, alpha(i * (len(cw) - 1 - j)))
        ok = ok and s == 0
    m = build_matrix(cw)
    assert all(cell is not None for row in m for cell in row), "unfilled modules"
    to_svg(m, 'assets/img/footer-qr.svg')
    to_png(m, 'assets/img/footer-qr.png')
    print('syndromes_zero:', ok, 'modules:', SIZE * SIZE)
