# Vũ Trụ Lý Luận — Game học tập MLN131 (Chủ nghĩa xã hội khoa học)

Web game tương tác giúp ôn tập môn **MLN131 — Chủ nghĩa xã hội khoa học**, cải tạo từ dự án "Vũ Trụ Kí Ức" (HCM202). Giữ nguyên engine 3D vũ trụ (React Three Fiber), thay toàn bộ nội dung theo giáo trình CNXH khoa học (7 chương).

## Cách chơi

- **Bản đồ sao 3D** (`#kham-pha`): 1 Mặt trời (tổng quan Chủ nghĩa Mác – Lênin) + 7 hành tinh = 7 chương giáo trình.
- Mỗi chương: đọc nội dung tóm tắt (double-click hành tinh) → **minigame** mở khóa *Luận điểm then chốt* → **Boss Quiz** (5 câu trắc nghiệm từ phần câu hỏi ôn tập cuối chương, đúng ≥ 4 là hạ boss, +150 XP).
- **Phòng ôn thi** (`#on-thi`): đề thi thử 20 câu xáo từ toàn bộ 7 chương, 10 phút, chấm điểm + gợi ý chương yếu.
- **Hồ sơ lý luận**: bộ sưu tập bài học đã mở, badge boss từng chương, điểm ôn thi cao nhất.
- Tiến trình (bài học, boss, XP, điểm thi) lưu ở `localStorage`.

## Minigame theo chương

| Chương | Hành tinh | Minigame |
|---|---|---|
| Tổng quan | Mặt trời Mác – Lênin | GravitySun — hút 3 bộ phận hợp thành vào quỹ đạo |
| 1 | Nhập môn CNXH khoa học | SortIsm — phân loại CNXH không tưởng / khoa học |
| 2 | Sứ mệnh lịch sử của GCN | BreakChains — phá xiềng, ghép từ khóa |
| 3 | CNXH và thời kỳ quá độ | GrowSeed — hành trình quá độ lên CNXH |
| 4 | Dân chủ & Nhà nước XHCN | BalanceScale — đóng dấu bản chất nhà nước XHCN |
| 5 | Cơ cấu giai cấp & liên minh | ConnectFragments — nối liên minh công - nông - trí thức |
| 6 | Dân tộc & tôn giáo | GlobalNetwork — kết nối các giá trị dân tộc/tôn giáo |
| 7 | Gia đình | HeartConstellation — chòm sao giá trị gia đình |

## Cấu trúc dữ liệu

- `src/data/curriculum.js` — 8 node hành tinh (tóm tắt, luận điểm then chốt theo mục I–II–III mỗi chương). Field `audio` đang để `null` (chưa có thuyết minh).
- `src/data/quizBank.js` — 77 câu trắc nghiệm (`allQuestions`, `questionsByChapter`).
- Cả hai file **sinh tự động** bởi `scratch/build_data.py` từ `scratch/content/*.json` (nội dung trích từ giáo trình scan). Sửa nội dung → sửa JSON rồi chạy `python -X utf8 scratch/build_data.py`.
- `src/hooks/useProgress.js` — tiến trình lưu `localStorage` (key `mln131-progress-v1`).

## Lệnh

```bash
npm run dev      # dev server
npm run build    # build production
npm run lint     # eslint
```

## Ghi chú

- File giáo trình gốc (`MLN131 - Giao trinh CNXHKH.pdf`, bản scan) được gitignore, không commit.
- Audio thuyết minh chưa có — UI tự ẩn player khi `audio: null`; bổ sung sau bằng cách import file và gán vào `curriculum.js` (hoặc JSON nguồn).
