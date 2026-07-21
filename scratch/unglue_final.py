import io, re, sys, json

VN = 'a-zàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ'
STEM = r'(đờix|thờix|ngườix|lờix|hồix|giớix|cuốix|lỗix|mườix|Mườix)'.replace('x', '')
pat = re.compile(STEM + r'([' + VN + r']+)')
TAIL = {'củ': 'củ' + 'a', 'xã': 'đã', 'z': ''}

def rep(m):
    stem, tail = m.group(1), m.group(2)
    return stem + ' ' + TAIL.get(tail, tail)

for p in sys.argv[1:]:
    s = io.open(p, encoding='utf-8').read()
    s = s.replace('ngườit hừa', 'ngườithừa')
    s = s.replace('lột ngườicủ', 'lột ngườiz')
    s, n = pat.subn(rep, s)
    io.open(p, 'w', encoding='utf-8').write(s)
    json.load(io.open(p, encoding='utf-8'))
    print(p, 'subs', n, 'json ok')
