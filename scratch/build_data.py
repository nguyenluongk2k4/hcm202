# Sinh src/data/curriculum.js + src/data/quizBank.js từ scratch/content/*.json
# Chạy: python -X utf8 scratch/build_data.py
import json, glob, io, os

META = {
    'tong-quan': dict(name='Chủ nghĩa Mác - Lênin', type='Mặt trời lý luận', concept='Triết học - Kinh tế chính trị - CNXH khoa học',
                      signal='Tổng quan', distance=0, size=1.72, orbitSpeed=0, rotationSpeed=0.22, axialTilt=0, phase=0, color='gold'),
    'chuong-1': dict(name='Nhập môn CNXH khoa học', type='Hành tinh khởi nguyên', concept='Từ không tưởng đến khoa học',
                     signal='Chương 1', distance=7.5, size=0.74, orbitSpeed=0.08, rotationSpeed=0.8, axialTilt=0.12, phase=0, color='cyan'),
    'chuong-2': dict(name='Sứ mệnh lịch sử của GCN', type='Hành tinh sứ mệnh', concept='Giai cấp công nhân và sứ mệnh lịch sử',
                     signal='Chương 2', distance=10, size=0.82, orbitSpeed=0.065, rotationSpeed=0.7, axialTilt=0.18, phase=1.1, color='red'),
    'chuong-3': dict(name='CNXH và thời kỳ quá độ', type='Hành tinh quá độ', concept='Đặc trưng bản chất của CNXH',
                     signal='Chương 3', distance=12.5, size=0.8, orbitSpeed=0.055, rotationSpeed=0.62, axialTilt=0.1, phase=2.3, color='emerald'),
    'chuong-4': dict(name='Dân chủ và Nhà nước XHCN', type='Hành tinh dân chủ', concept='Dân chủ XHCN - Nhà nước pháp quyền XHCN',
                     signal='Chương 4', distance=15, size=0.86, orbitSpeed=0.047, rotationSpeed=0.55, axialTilt=0.22, phase=3.4, color='blue'),
    'chuong-5': dict(name='Cơ cấu giai cấp và liên minh', type='Hành tinh liên minh', concept='Liên minh công - nông - trí thức',
                     signal='Chương 5', distance=17.5, size=0.78, orbitSpeed=0.041, rotationSpeed=0.5, axialTilt=0.15, phase=4.2, color='violet'),
    'chuong-6': dict(name='Dân tộc và tôn giáo', type='Hành tinh bản sắc', concept='Đoàn kết dân tộc, tự do tín ngưỡng',
                     signal='Chương 6', distance=20, size=0.76, orbitSpeed=0.036, rotationSpeed=0.46, axialTilt=0.2, phase=5.1, color='rose'),
    'chuong-7': dict(name='Gia đình thời kỳ quá độ', type='Hành tinh tổ ấm', concept='Gia đình - tế bào của xã hội',
                     signal='Chương 7', distance=22.5, size=0.72, orbitSpeed=0.032, rotationSpeed=0.42, axialTilt=0.08, phase=5.9, color='silver'),
}

INTRO_CARDS = [
    dict(id='learn', index='01', title='Học theo bản đồ sao',
         text='Mỗi chương giáo trình CNXH khoa học là một hành tinh với nội dung tóm tắt theo đúng mục I - II - III.'),
    dict(id='play', index='02', title='Chơi để mở luận điểm',
         text='Vượt minigame của từng chương để mở khóa luận điểm then chốt và trích dẫn kinh điển Mác - Lênin.'),
    dict(id='fight', index='03', title='Hạ boss, chinh phục môn học',
         text='Boss cuối chương là trắc nghiệm từ câu hỏi ôn tập giáo trình; phòng ôn thi mô phỏng đề thi tổng hợp.'),
]

PALETTE = {
    'cyan': ['#b9f7ff', '#21b8ff', '#123c76'],
    'gold': ['#fff4b8', '#f7b84d', '#8d5529'],
    'violet': ['#ead9ff', '#9f62ff', '#2a1974'],
    'emerald': ['#d5ffe9', '#45d88f', '#125b5e'],
    'red': ['#ffd0c4', '#ff715d', '#7a1a36'],
    'blue': ['#d2f3ff', '#668cff', '#25337a'],
    'rose': ['#ffe1ee', '#ff78ad', '#6b1b60'],
    'silver': ['#ffffff', '#a9c0dc', '#3d4e70'],
}

def js(obj):
    return json.dumps(obj, ensure_ascii=False, indent=2)

chapters = []
for f in sorted(glob.glob('scratch/content/*.json')):
    d = json.load(open(f, encoding='utf-8'))
    chapters.append(d)

order = ['tong-quan', 'chuong-1', 'chuong-2', 'chuong-3', 'chuong-4', 'chuong-5', 'chuong-6', 'chuong-7']
by_id = {d['id']: d for d in chapters}
missing = [i for i in order if i not in by_id]
assert not missing, f'Thiếu file: {missing}'

planets = []
all_questions = []
for pid in order:
    d = by_id[pid]
    meta = META[pid]
    lesson = d['lesson']
    quote_id = f"{pid}-lesson-01"
    planet = dict(
        id=pid,
        chapter=d['chapter'],
        name=meta['name'],
        type=meta['type'],
        concept=meta['concept'],
        signal=meta['signal'],
        distance=meta['distance'],
        size=meta['size'],
        orbitSpeed=meta['orbitSpeed'],
        rotationSpeed=meta['rotationSpeed'],
        axialTilt=meta['axialTilt'],
        phase=meta['phase'],
        color=meta['color'],
        audio=None,
        summary=d['summary'],
        details=d['details'],
        quotes=[dict(id=quote_id, title=lesson['title'], audio=None, text=lesson['text'], content=lesson['content'])],
    )
    planets.append(planet)
    for i, q in enumerate(d['questions'], 1):
        assert len(q['options']) == 4 and 0 <= q['answerIndex'] <= 3, (pid, i)
        all_questions.append(dict(
            id=f"{pid}-q{i:02d}",
            chapter=d['chapter'],
            question=q['question'],
            options=q['options'],
            answerIndex=q['answerIndex'],
            explanation=q['explanation'],
        ))

by_chapter = {}
for q in all_questions:
    by_chapter.setdefault(q['chapter'], []).append(q)

curriculum = (
    "// SINH TỰ ĐỘNG bởi scratch/build_data.py từ nội dung giáo trình MLN131 — không sửa tay.\n"
    "// Audio để trống (null): khi có file thuyết minh, import và gán lại vào field audio.\n\n"
    f"export const introCards = {js(INTRO_CARDS)}\n\n"
    f"export const planetPalette = {js(PALETTE)}\n\n"
    f"export const planets = {js(planets)}\n"
)

quiz = (
    "// SINH TỰ ĐỘNG bởi scratch/build_data.py — ngân hàng câu hỏi trắc nghiệm MLN131.\n\n"
    f"export const allQuestions = {js(all_questions)}\n\n"
    f"export const questionsByChapter = {js(by_chapter)}\n"
)

io.open('src/data/curriculum.js', 'w', encoding='utf-8').write(curriculum)
io.open('src/data/quizBank.js', 'w', encoding='utf-8').write(quiz)
print(f'OK: {len(planets)} planets, {len(all_questions)} questions, chapters: {sorted(by_chapter)}')
