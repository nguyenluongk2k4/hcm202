// SINH TỰ ĐỘNG bởi scratch/build_data.py từ nội dung giáo trình MLN131 — không sửa tay.
// Audio để trống (null): khi có file thuyết minh, import và gán lại vào field audio.

export const introCards = [
  {
    "id": "learn",
    "index": "01",
    "title": "Học theo bản đồ sao",
    "text": "Mỗi chương giáo trình CNXH khoa học là một hành tinh với nội dung tóm tắt theo đúng mục I - II - III."
  },
  {
    "id": "play",
    "index": "02",
    "title": "Chơi để mở luận điểm",
    "text": "Vượt minigame của từng chương để mở khóa luận điểm then chốt và trích dẫn kinh điển Mác - Lênin."
  },
  {
    "id": "fight",
    "index": "03",
    "title": "Hạ boss, chinh phục môn học",
    "text": "Boss cuối chương là trắc nghiệm từ câu hỏi ôn tập giáo trình; phòng ôn thi mô phỏng đề thi tổng hợp."
  }
]

export const planetPalette = {
  "cyan": [
    "#b9f7ff",
    "#21b8ff",
    "#123c76"
  ],
  "gold": [
    "#fff4b8",
    "#f7b84d",
    "#8d5529"
  ],
  "violet": [
    "#ead9ff",
    "#9f62ff",
    "#2a1974"
  ],
  "emerald": [
    "#d5ffe9",
    "#45d88f",
    "#125b5e"
  ],
  "red": [
    "#ffd0c4",
    "#ff715d",
    "#7a1a36"
  ],
  "blue": [
    "#d2f3ff",
    "#668cff",
    "#25337a"
  ],
  "rose": [
    "#ffe1ee",
    "#ff78ad",
    "#6b1b60"
  ],
  "silver": [
    "#ffffff",
    "#a9c0dc",
    "#3d4e70"
  ]
}

export const planets = [
  {
    "id": "tong-quan",
    "chapter": 0,
    "name": "Chủ nghĩa Mác - Lênin",
    "type": "Mặt trời lý luận",
    "concept": "Triết học - Kinh tế chính trị - CNXH khoa học",
    "signal": "Tổng quan",
    "distance": 0,
    "size": 1.72,
    "orbitSpeed": 0,
    "rotationSpeed": 0.22,
    "axialTilt": 0,
    "phase": 0,
    "color": "gold",
    "audio": null,
    "summary": "Chủ nghĩa xã hội khoa học được hiểu theo hai nghĩa: theo nghĩa rộng là chủ nghĩa Mác - Lênin; theo nghĩa hẹp là một trong ba bộ phận hợp thành chủ nghĩa Mác - Lênin, gồm triết học Mác - Lênin, kinh tế chính trị Mác - Lênin và chủ nghĩa xã hội khoa học. Chủ nghĩa Mác là người thừa kế chính đáng những tinh hoa tư tưởng của loài người thế kỷ XIX: triết học Đức, kinh tế chính trị học Anh và chủ nghĩa xã hội Pháp.",
    "details": [
      "Triết học Mác - Lênin: bộ phận luận giải từ giác độ triết học về sự chuyển biến tất yếu của xã hội loài người từ chủ nghĩa tư bản lên chủ nghĩa xã hội và chủ nghĩa cộng sản.",
      "Kinh tế chính trị Mác - Lênin: bộ phận luận giải từ giác độ kinh tế học chính trị; V.I. Lênin đánh giá bộ Tư bản là \"tác phẩm chủ yếu và cơ bản ấy trình bày chủ nghĩa xã hội khoa học... những yếu tố từ đó nảy sinh ra chế độ tương lai\".",
      "Chủ nghĩa xã hội khoa học: bộ phận luận giải từ giác độ chính trị - xã hội; trong tác phẩm Chống Đuyrinh, Ph. Ăngghen đã viết ba phần: \"Triết học\", \"Kinh tế chính trị\" và \"Chủ nghĩa xã hội khoa học\"."
    ],
    "quotes": [
      {
        "id": "tong-quan-lesson-01",
        "title": "Luận điểm then chốt: Ba bộ phận hợp thành",
        "audio": null,
        "text": "Trong tác phẩm Ba nguồn gốc và ba bộ phận cấu thành của chủ nghĩa Mác, V.I. Lênin khẳng định: \"Nó là người thừa kế chính đáng của tất cả những cái tốt đẹp nhất mà loài người đã tạo ra hồi thế kỷ XIX, đó là triết học Đức, kinh tế chính trị học Anh và chủ nghĩa xã hội Pháp\".",
        "content": [
          "Chủ nghĩa xã hội khoa học được hiểu theo hai nghĩa. Theo nghĩa rộng, chủ nghĩa xã hội khoa học là chủ nghĩa Mác - Lênin, luận giải từ các giác độ triết học, kinh tế học chính trị và chính trị - xã hội về sự chuyển biến tất yếu của xã hội loài người từ chủ nghĩa tư bản lên chủ nghĩa xã hội và chủ nghĩa cộng sản. Theo nghĩa hẹp, chủ nghĩa xã hội khoa học là một trong ba bộ phận hợp thành chủ nghĩa Mác - Lênin; trong khuôn khổ môn học này, chủ nghĩa xã hội khoa học được nghiên cứu theo nghĩa hẹp.",
          "Ba bộ phận hợp thành chủ nghĩa Mác - Lênin gắn bó hữu cơ với nhau. Trong tác phẩm Chống Đuyrinh, Ph. Ăngghen đã trình bày hệ thống quan điểm của chủ nghĩa Mác qua ba phần: \"Triết học\", \"Kinh tế chính trị\" và \"Chủ nghĩa xã hội khoa học\". Mỗi bộ phận có đối tượng nghiên cứu riêng nhưng cùng làm nên một hệ thống lý luận thống nhất, luận giải sự chuyển biến tất yếu của xã hội loài người từ chủ nghĩa tư bản lên chủ nghĩa xã hội và chủ nghĩa cộng sản.",
          "Về nguồn gốc lý luận, V.I. Lênin chỉ ra ba nguồn gốc của chủ nghĩa Mác: triết học Đức, kinh tế chính trị học Anh và chủ nghĩa xã hội Pháp. Chủ nghĩa xã hội khoa học ra đời vào những năm 40 của thế kỷ XIX, khi cuộc cách mạng công nghiệp đã hoàn thành ở nước Anh và chuyển sang nước Pháp và Đức, làm xuất hiện nền đại công nghiệp cùng hai giai cấp có lợi ích cơ bản đối lập nhau: giai cấp tư sản và giai cấp vô sản (giai cấp công nhân) - đó là điều kiện kinh tế - xã hội làm nảy sinh chủ nghĩa xã hội khoa học."
        ]
      }
    ]
  },
  {
    "id": "chuong-1",
    "chapter": 1,
    "name": "Nhập môn CNXH khoa học",
    "type": "Hành tinh khởi nguyên",
    "concept": "Từ không tưởng đến khoa học",
    "signal": "Chương 1",
    "distance": 7.5,
    "size": 0.74,
    "orbitSpeed": 0.08,
    "rotationSpeed": 0.8,
    "axialTilt": 0.12,
    "phase": 0,
    "color": "cyan",
    "audio": null,
    "summary": "Chương 1 giới thiệu tổng quan về chủ nghĩa xã hội khoa học - một trong ba bộ phận hợp thành chủ nghĩa Mác - Lênin: hoàn cảnh lịch sử ra đời và vai trò của C. Mác, Ph. Ăngghen; các giai đoạn phát triển cơ bản qua C. Mác - Ph. Ăngghen, V.I. Lênin và sau Lênin; đồng thời xác định đối tượng, phương pháp và ý nghĩa của việc nghiên cứu, học tập môn học này.",
    "details": [
      "Chủ nghĩa xã hội khoa học ra đời vào những năm 40 của thế kỷ XIX, trên cơ sở điều kiện kinh tế - xã hội của nền đại công nghiệp tư bản chủ nghĩa và phong trào đấu tranh của giai cấp công nhân, với tiền đề khoa học tự nhiên (học thuyết tiến hóa, định luật bảo toàn và chuyển hóa năng lượng, học thuyết tế bào) và tiền đề tư tưởng - lý luận (triết học cổ điển Đức, kinh tế chính trị học cổ điển Anh, chủ nghĩa xã hội không tưởng phê phán Pháp); vai trò của C. Mác và Ph. Ăngghen là điều kiện đủ để học thuyết ra đời vào năm 1848.",
      "Chủ nghĩa xã hội khoa học được C. Mác và Ph. Ăngghen phát triển qua các thời kỳ (từ 1848 đến Công xã Pari 1871; sau Công xã Pari đến 1895); được V.I. Lênin bảo vệ, vận dụng và phát triển trong điều kiện chủ nghĩa tư bản chuyển sang giai đoạn đế quốc chủ nghĩa với Cách mạng tháng Mười và Cương lĩnh xây dựng chủ nghĩa xã hội ở nước Nga; sau Lênin được các đảng cộng sản, trong đó có Đảng Cộng sản Việt Nam, vận dụng và phát triển sáng tạo.",
      "Đối tượng nghiên cứu của chủ nghĩa xã hội khoa học là những quy luật, tính quy luật chính trị - xã hội của quá trình phát sinh, hình thành và phát triển của hình thái kinh tế - xã hội cộng sản chủ nghĩa mà giai đoạn thấp là chủ nghĩa xã hội; việc học tập môn học có ý nghĩa cả về lý luận lẫn thực tiễn, góp phần giáo dục niềm tin khoa học vào mục tiêu, lý tưởng xã hội chủ nghĩa và con đường đi lên chủ nghĩa xã hội ở Việt Nam."
    ],
    "quotes": [
      {
        "id": "chuong-1-lesson-01",
        "title": "Luận điểm then chốt chương 1",
        "audio": null,
        "text": "Ph. Ăngghen khái quát nhiệm vụ của chủ nghĩa xã hội khoa học: \"Thực hiện sự nghiệp giải phóng thế giới ấy, - đó là sứ mệnh lịch sử của giai cấp vô sản hiện đại. Nghiên cứu những điều kiện lịch sử và do đó, nghiên cứu chính ngay bản chất của sự biến đổi ấy, và bằng cách ấy làm cho giai cấp hiện nay đang bị áp bức và có sứ mệnh hoàn thành sự nghiệp ấy hiểu rõ được những điều kiện và bản chất của sự nghiệp của chính họ - đó là nhiệm vụ của chủ nghĩa xã hội khoa học, sự thể hiện về mặt lý luận của phong trào vô sản\" (Chủ nghĩa xã hội từ không tưởng đến khoa học).",
        "content": [
          "Chủ nghĩa xã hội khoa học được hiểu theo hai nghĩa: theo nghĩa rộng là chủ nghĩa Mác - Lênin; theo nghĩa hẹp là một trong ba bộ phận hợp thành chủ nghĩa Mác - Lênin, và trong khuôn khổ môn học này được nghiên cứu theo nghĩa hẹp. Nó ra đời từ điều kiện kinh tế - xã hội của nền đại công nghiệp tư bản chủ nghĩa những năm 40 thế kỷ XIX - khi mâu thuẫn giữa lực lượng sản xuất mang tính chất xã hội với quan hệ sản xuất dựa trên chế độ chiếm hữu tư nhân tư bản chủ nghĩa ngày càng quyết liệt, và phong trào đấu tranh của giai cấp công nhân (Lion 1831, 1834; Hiến chương Anh 1836 - 1848; Xilêdi 1844) đòi hỏi một hệ thống lý luận soi đường. Bằng trí tuệ uyên bác và sự dấn thân, C. Mác và Ph. Ăngghen kế thừa những hạt nhân hợp lý của triết học cổ điển Đức, kinh tế chính trị học cổ điển Anh và chủ nghĩa xã hội không tưởng Pháp để xây dựng nên học thuyết khoa học, cách mạng.",
          "Trải qua các giai đoạn phát triển, C. Mác và Ph. Ăngghen tổng kết kinh nghiệm cách mạng 1848 - 1852 và Công xã Pari 1871, bổ sung tư tưởng đập tan bộ máy nhà nước tư sản, thiết lập chuyên chính vô sản, xây dựng khối liên minh công - nông. V.I. Lênin bảo vệ và phát triển chủ nghĩa xã hội khoa học trong điều kiện đế quốc chủ nghĩa: khẳng định chuyên chính vô sản không chỉ là bạo lực mà chủ yếu là tổ chức lao động xã hội cao hơn chủ nghĩa tư bản; chỉ ra chỉ có dân chủ tư sản hoặc dân chủ vô sản, không có dân chủ thuần túy; xây dựng Cương lĩnh xây dựng chủ nghĩa xã hội ở nước Nga với những bước quá độ, điện khí hóa, phát triển kinh tế hàng hóa nhiều thành phần và ba nguyên tắc cơ bản về dân tộc.",
          "Sau V.I. Lênin, chủ nghĩa xã hội khoa học tiếp tục được vận dụng và phát triển sáng tạo. Từ thực tiễn 35 năm đổi mới, 30 năm thực hiện Cương lĩnh xây dựng đất nước trong thời kỳ quá độ lên chủ nghĩa xã hội, Đảng Cộng sản Việt Nam khẳng định: lý luận về đường lối đổi mới, về chủ nghĩa xã hội và con đường đi lên chủ nghĩa xã hội của Việt Nam ngày càng hoàn thiện và từng bước được hiện thực hóa; đất nước đạt được những thành tựu to lớn, có ý nghĩa lịch sử, phấn đấu vì mục tiêu \"dân giàu, nước mạnh, dân chủ, công bằng, văn minh\". Học tập chủ nghĩa xã hội khoa học giúp củng cố niềm tin khoa học, đấu tranh bác bỏ các trào lưu tư tưởng chống cộng, chống chủ nghĩa xã hội."
        ]
      }
    ]
  },
  {
    "id": "chuong-2",
    "chapter": 2,
    "name": "Sứ mệnh lịch sử của GCN",
    "type": "Hành tinh sứ mệnh",
    "concept": "Giai cấp công nhân và sứ mệnh lịch sử",
    "signal": "Chương 2",
    "distance": 10,
    "size": 0.82,
    "orbitSpeed": 0.065,
    "rotationSpeed": 0.7,
    "axialTilt": 0.18,
    "phase": 1.1,
    "color": "red",
    "audio": null,
    "summary": "Chương 2 trình bày quan điểm cơ bản của chủ nghĩa Mác - Lênin về giai cấp công nhân: khái niệm theo hai phương diện kinh tế - xã hội và chính trị - xã hội, đặc điểm và nội dung sứ mệnh lịch sử của giai cấp công nhân. Chương cũng phân tích giai cấp công nhân hiện nay với những điểm tương đồng và những biến đổi mới, đồng thời làm rõ đặc điểm, nội dung sứ mệnh lịch sử cùng phương hướng, giải pháp xây dựng giai cấp công nhân Việt Nam.",
    "details": [
      "Giai cấp công nhân là sản phẩm và chủ thể của nền sản xuất đại công nghiệp, lao động bằng phương thức công nghiệp ngày càng hiện đại; về phương diện chính trị - xã hội, họ là những người lao động không có sở hữu tư liệu sản xuất chủ yếu, phải bán sức lao động và bị chủ tư bản bóc lột giá trị thặng dư, vì vậy có lợi ích cơ bản đối lập với giai cấp tư sản.",
      "Sứ mệnh lịch sử tổng quát của giai cấp công nhân là thông qua chính đảng tiên phong, tổ chức, lãnh đạo nhân dân lao động đấu tranh xóa bỏ các chế độ người bóc lột người , xóa bỏ chủ nghĩa tư bản, giải phóng giai cấp công nhân và nhân dân lao động, xây dựng xã hội cộng sản chủ nghĩa văn minh; sứ mệnh ấy thể hiện trên ba nội dung: kinh tế, chính trị - xã hội và văn hóa, tư tưởng. Giai cấp công nhân hiện nay vừa có những điểm tương đồng với thế kỷ XIX, vừa có những biến đổi như xu hướng \"trí tuệ hóa\", \"trung lưu hóa\" gia tăng.",
      "Giai cấp công nhân Việt Nam ra đời trước giai cấp tư sản, gắn liền với chính sách khai thác thuộc địa của thực dân Pháp, có tinh thần cách mạng triệt để, truyền thống yêu nước và gắn bó mật thiết với các tầng lớp nhân dân; hiện nay giai cấp công nhân Việt Nam là giai cấp lãnh đạo cách mạng thông qua đội tiên phong là Đảng Cộng sản Việt Nam, lực lượng đi đầu trong sự nghiệp công nghiệp hóa, hiện đại hóa, nòng cốt trong khối liên minh công nhân - nông dân - trí thức, và cần được xây dựng lớn mạnh, hiện đại, ngày càng được trí thức hóa."
    ],
    "quotes": [
      {
        "id": "chuong-2-lesson-01",
        "title": "Luận điểm then chốt chương 2",
        "audio": null,
        "text": "C. Mác viết: \"Thực hiện sự nghiệp giải phóng thế giới ấy, - đó là sứ mệnh lịch sử của giai cấp vô sản hiện đại\". Trong Tuyên ngôn của Đảng Cộng sản, C. Mác và Ph. Ăngghen nhấn mạnh: \"các giai cấp khác đều suy tàn và tiêu vong cùng với sự phát triển của đại công nghiệp, còn giai cấp vô sản lại là sản phẩm của bản thân nền đại công nghiệp\".",
        "content": [
          "Theo chủ nghĩa Mác - Lênin, giai cấp công nhân là một tập đoàn xã hội, hình thành và phát triển cùng quá trình phát triển của nền công nghiệp hiện đại; họ lao động bằng phương thức công nghiệp ngày càng hiện đại, là đại biểu cho phương thức sản xuất mang tính xã hội hóa ngày càng cao. Họ là người làm thuê do không có tư liệu sản xuất, buộc phải bán sức lao động để sống và bị giai cấp tư sản bóc lột giá trị thặng dư; đó là giai cấp có sứ mệnh phủ định chế độ tư bản chủ nghĩa, xây dựng thành công chủ nghĩa xã hội và chủ nghĩa cộng sản trên toàn thế giới. Giai cấp công nhân là giai cấp cách mạng không phải vì nghèo khổ, mà vì là giai cấp đại diện cho lực lượng sản xuất hiện đại, đại biểu cho tương lai, cho xu thế đi lên của tiến trình phát triển lịch sử.",
          "Sứ mệnh lịch sử của giai cấp công nhân thể hiện trên ba nội dung cơ bản: nội dung kinh tế - là nhân tố hàng đầu của lực lượng sản xuất xã hội hóa cao, đại biểu cho quan hệ sản xuất mới; nội dung chính trị - xã hội - cùng nhân dân lao động, dưới sự lãnh đạo của Đảng Cộng sản, tiến hành cách mạng chính trị giành quyền lực, thiết lập nhà nước kiểu mới mang bản chất giai cấp công nhân; nội dung văn hóa, tư tưởng - xây dựng hệ giá trị mới: lao động, công bằng, dân chủ, bình đẳng và tự do. Để thực hiện sứ mệnh, ngoài điều kiện khách quan, giai cấp công nhân phải phát triển cả về số lượng và chất lượng, đặc biệt được giác ngộ lý luận Mác - Lênin, và Đảng Cộng sản là nhân tố chủ quan quan trọng nhất.",
          "Giai cấp công nhân Việt Nam ra đời và phát triển gắn liền với chính sách khai thác thuộc địa của thực dân Pháp; ra đời trước giai cấp tư sản, sớm được tôi luyện trong đấu tranh chống thực dân, đế quốc nên trưởng thành nhanh về ý thức chính trị giai cấp, có tinh thần cách mạng triệt để và lãnh đạo cách mạng thông qua đội tiên phong là Đảng Cộng sản. Hiện nay, giai cấp công nhân Việt Nam là lực lượng đi đầu trong sự nghiệp công nghiệp hóa, hiện đại hóa đất nước vì mục tiêu dân giàu, nước mạnh, xã hội công bằng, dân chủ, văn minh; là lực lượng nòng cốt trong liên minh giai cấp công nhân với giai cấp nông dân và đội ngũ trí thức dưới sự lãnh đạo của Đảng. Đảng ta chủ trương xây dựng giai cấp công nhân hiện đại, lớn mạnh, nâng cao bản lĩnh chính trị, trình độ học vấn, chuyên môn, kỹ năng nghề nghiệp, tác phong công nghiệp thích ứng với cuộc Cách mạng công nghiệp lần thứ tư."
        ]
      }
    ]
  },
  {
    "id": "chuong-3",
    "chapter": 3,
    "name": "CNXH và thời kỳ quá độ",
    "type": "Hành tinh quá độ",
    "concept": "Đặc trưng bản chất của CNXH",
    "signal": "Chương 3",
    "distance": 12.5,
    "size": 0.8,
    "orbitSpeed": 0.055,
    "rotationSpeed": 0.62,
    "axialTilt": 0.1,
    "phase": 2.3,
    "color": "emerald",
    "audio": null,
    "summary": "Chương 3 trình bày quan điểm của chủ nghĩa Mác - Lênin về chủ nghĩa xã hội - giai đoạn đầu của hình thái kinh tế - xã hội cộng sản chủ nghĩa, về tính tất yếu và đặc điểm của thời kỳ quá độ lên chủ nghĩa xã hội. Chương cũng phân tích sự vận dụng sáng tạo của Đảng Cộng sản Việt Nam: con đường quá độ lên chủ nghĩa xã hội bỏ qua chế độ tư bản chủ nghĩa cùng mô hình chủ nghĩa xã hội Việt Nam với tám đặc trưng cơ bản.",
    "details": [
      "Chủ nghĩa xã hội được tiếp cận từ bốn góc độ: phong trào thực tiễn; trào lưu tư tưởng, lý luận; khoa học về sứ mệnh lịch sử của giai cấp công nhân; và chế độ xã hội tốt đẹp - giai đoạn đầu của hình thái kinh tế - xã hội cộng sản chủ nghĩa. Sự ra đời của nó dựa trên hai tiền đề vật chất: sự phát triển của lực lượng sản xuất và sự trưởng thành của giai cấp công nhân.",
      "Từ chủ nghĩa tư bản lên chủ nghĩa xã hội tất yếu phải trải qua một thời kỳ quá độ chính trị, mà nhà nước của thời kỳ ấy là nền chuyên chính cách mạng của giai cấp vô sản. Thời kỳ quá độ là thời kỳ cải tạo cách mạng sâu sắc, lâu dài trên mọi lĩnh vực: kinh tế nhiều thành phần, tư tưởng vô sản và tư sản còn đan xen, xã hội còn nhiều giai cấp, tầng lớp.",
      "Việt Nam quá độ lên chủ nghĩa xã hội bỏ qua chế độ tư bản chủ nghĩa, tức bỏ qua việc xác lập vị trí thống trị của quan hệ sản xuất và kiến trúc thượng tầng tư bản chủ nghĩa. Đảng ta xây dựng mô hình chủ nghĩa xã hội với tám đặc trưng cơ bản, mục tiêu là dân giàu, nước mạnh, dân chủ, công bằng, văn minh."
    ],
    "quotes": [
      {
        "id": "chuong-3-lesson-01",
        "title": "Luận điểm then chốt chương 3",
        "audio": null,
        "text": "C. Mác khẳng định: \"Giữa xã hội tư bản chủ nghĩa và xã hội cộng sản chủ nghĩa là một thời kỳ cải biến cách mạng từ xã hội nọ sang xã hội kia. Thích ứng với thời kỳ ấy là một thời kỳ quá độ chính trị, và nhà nước của thời kỳ ấy không thể là cái gì khác hơn là nền chuyên chính cách mạng của giai cấp vô sản\". V.I. Lênin cũng khẳng định: \"Về lý luận, không thể nghi ngờ gì được rằng giữa chủ nghĩa tư bản và chủ nghĩa cộng sản, có một thời kỳ quá độ nhất định\".",
        "content": [
          "Chủ nghĩa xã hội là giai đoạn đầu của hình thái kinh tế - xã hội cộng sản chủ nghĩa, ra đời từ tất yếu lịch sử khi lực lượng sản xuất phát triển và giai cấp công nhân trưởng thành. Đó là chế độ xã hội do nhân dân lao động làm chủ, có nền kinh tế phát triển cao dựa trên chế độ công hữu về tư liệu sản xuất, phân phối chủ yếu theo lao động, có nhà nước kiểu mới mang bản chất giai cấp công nhân.",
          "Thời kỳ quá độ lên chủ nghĩa xã hội là thời kỳ cải tạo cách mạng sâu sắc, triệt để xã hội tư bản chủ nghĩa trên tất cả các lĩnh vực, bắt đầu từ khi giai cấp công nhân và nhân dân lao động giành được chính quyền đến khi xây dựng thành công chủ nghĩa xã hội. Đây là thời kỳ lâu dài, gian khổ, với nền kinh tế nhiều thành phần, nhiều hình thức phân phối và sự đan xen giữa tàn dư của xã hội cũ với những yếu tố mới.",
          "Đại hội IX của Đảng xác định: con đường đi lên của nước ta là sự phát triển quá độ lên chủ nghĩa xã hội bỏ qua chế độ tư bản chủ nghĩa, tức là bỏ qua việc xác lập vị trí thống trị của quan hệ sản xuất và kiến trúc thượng tầng tư bản chủ nghĩa, nhưng tiếp thu, kế thừa những thành tựu nhân loại đã đạt được dưới chủ nghĩa tư bản, đặc biệt về khoa học và công nghệ. Cương lĩnh 1991 (bổ sung, phát triển năm 2011) xây dựng mô hình chủ nghĩa xã hội Việt Nam với tám đặc trưng cơ bản, trong đó mục tiêu là dân giàu, nước mạnh, dân chủ, công bằng, văn minh."
        ]
      }
    ]
  },
  {
    "id": "chuong-4",
    "chapter": 4,
    "name": "Dân chủ và Nhà nước XHCN",
    "type": "Hành tinh dân chủ",
    "concept": "Dân chủ XHCN - Nhà nước pháp quyền XHCN",
    "signal": "Chương 4",
    "distance": 15,
    "size": 0.86,
    "orbitSpeed": 0.047,
    "rotationSpeed": 0.55,
    "axialTilt": 0.22,
    "phase": 3.4,
    "color": "blue",
    "audio": null,
    "summary": "Chương 4 phân tích bản chất của dân chủ nói chung và nền dân chủ xã hội chủ nghĩa nói riêng, sự ra đời, bản chất, chức năng của nhà nước xã hội chủ nghĩa. Chương cũng làm rõ quá trình xây dựng nền dân chủ xã hội chủ nghĩa và Nhà nước pháp quyền xã hội chủ nghĩa ở Việt Nam dưới sự lãnh đạo của Đảng Cộng sản.",
    "details": [
      "Theo chủ nghĩa Mác - Lênin, dân chủ có ba nội dung cơ bản: quyền lực thuộc về nhân dân; là một hình thức hay hình thái nhà nước (chính thể dân chủ); là một nguyên tắc trong tổ chức và quản lý xã hội. Dân chủ xã hội chủ nghĩa là nền dân chủ cao hơn về chất, có bản chất chính trị là sự lãnh đạo của giai cấp công nhân thông qua Đảng Cộng sản, bản chất kinh tế dựa trên chế độ sở hữu xã hội về tư liệu sản xuất chủ yếu.",
      "Nhà nước xã hội chủ nghĩa ra đời là kết quả của cuộc cách mạng do giai cấp vô sản và nhân dân lao động tiến hành dưới sự lãnh đạo của Đảng Cộng sản. Đó là kiểu nhà nước mà ở đó sự thống trị chính trị thuộc về giai cấp công nhân, mang bản chất giai cấp công nhân, tính nhân dân rộng rãi và tính dân tộc sâu sắc.",
      "Ở Việt Nam, Đảng ta khẳng định dân chủ xã hội chủ nghĩa là bản chất của chế độ ta, vừa là mục tiêu, vừa là động lực của sự phát triển đất nước. Việt Nam xây dựng Nhà nước pháp quyền xã hội chủ nghĩa của nhân dân, do nhân dân, vì nhân dân do Đảng Cộng sản Việt Nam lãnh đạo, quyền lực nhà nước là thống nhất với sự phân công, phối hợp, kiểm soát giữa các cơ quan lập pháp, hành pháp, tư pháp."
    ],
    "quotes": [
      {
        "id": "chuong-4-lesson-01",
        "title": "Luận điểm then chốt chương 4",
        "audio": null,
        "text": "Đảng ta khẳng định: \"Dân chủ xã hội chủ nghĩa là bản chất của chế độ ta, vừa là mục tiêu, vừa là động lực của sự phát triển đất nước\". Xây dựng và từng bước hoàn thiện nền dân chủ xã hội chủ nghĩa, bảo đảm dân chủ được thực hiện trong thực tế cuộc sống ở mỗi cấp, trên tất cả các lĩnh vực; dân chủ gắn liền với kỷ luật, kỷ cương và phải được thể chế hóa bằng pháp luật, được pháp luật bảo đảm.",
        "content": [
          "Dân chủ là sản phẩm và là thành quả của quá trình đấu tranh giai cấp cho những giá trị tiến bộ của nhân loại, là một hình thức tổ chức nhà nước của giai cấp cầm quyền. Dân chủ xã hội chủ nghĩa là nền dân chủ cao hơn về chất so với các nền dân chủ có trong lịch sử nhân loại, là nền dân chủ mà ở đó mọi quyền lực thuộc về nhân dân, dân là chủ và dân làm chủ; dân chủ và pháp luật nằm trong sự thống nhất biện chứng; được thực hiện bằng nhà nước pháp quyền xã hội chủ nghĩa, đặt dưới sự lãnh đạo của Đảng Cộng sản.",
          "Nhà nước xã hội chủ nghĩa là một kiểu nhà nước mà ở đó sự thống trị chính trị thuộc về giai cấp công nhân, do cách mạng xã hội chủ nghĩa sản sinh ra và có sứ mệnh xây dựng thành công chủ nghĩa xã hội, đưa nhân dân lao động lên địa vị làm chủ trên tất cả các mặt của đời sống xã hội. Về chính trị, nhà nước xã hội chủ nghĩa mang bản chất giai cấp công nhân; sự thống trị của giai cấp vô sản là sự thống trị của đa số đối với thiểu số giai cấp bóc lột, nhằm giải phóng giai cấp mình và giải phóng tất cả các tầng lớp nhân dân lao động.",
          "Ở Việt Nam, chế độ dân chủ nhân dân được xác lập sau Cách mạng Tháng Tám năm 1945; Đại hội VI (1986) đề ra đường lối đổi mới toàn diện, nhấn mạnh phát huy dân chủ, quán triệt tư tưởng \"lấy dân làm gốc\". Nhà nước pháp quyền xã hội chủ nghĩa ở Việt Nam phải do Đảng Cộng sản Việt Nam lãnh đạo phù hợp với Điều 4 Hiến pháp năm 2013; quyền lực nhà nước là thống nhất, có sự phân công rõ ràng, phối hợp nhịp nhàng và kiểm soát giữa các cơ quan lập pháp, hành pháp và tư pháp; hoạt động của Nhà nước được nhân dân giám sát với phương châm \"Dân biết, dân bàn, dân làm, dân kiểm tra\"."
        ]
      }
    ]
  },
  {
    "id": "chuong-5",
    "chapter": 5,
    "name": "Cơ cấu giai cấp và liên minh",
    "type": "Hành tinh liên minh",
    "concept": "Liên minh công - nông - trí thức",
    "signal": "Chương 5",
    "distance": 17.5,
    "size": 0.78,
    "orbitSpeed": 0.041,
    "rotationSpeed": 0.5,
    "axialTilt": 0.15,
    "phase": 4.2,
    "color": "violet",
    "audio": null,
    "summary": "Chương 5 trình bày khái niệm, vị trí của cơ cấu xã hội - giai cấp trong cơ cấu xã hội và sự biến đổi của nó trong thời kỳ quá độ lên chủ nghĩa xã hội. Chương phân tích tính tất yếu của liên minh giai cấp, tầng lớp - vấn đề mang tính nguyên tắc theo chủ nghĩa Mác - Lênin, và vận dụng vào Việt Nam: đặc điểm cơ cấu xã hội - giai cấp, vị trí vai trò các giai cấp, tầng lớp cùng nội dung, phương hướng tăng cường khối liên minh trong sự nghiệp công nghiệp hóa, hiện đại hóa.",
    "details": [
      "Cơ cấu xã hội - giai cấp là hệ thống các giai cấp, tầng lớp xã hội tồn tại khách quan trong một chế độ xã hội nhất định, thông qua những mối quan hệ về sở hữu tư liệu sản xuất, tổ chức quản lý quá trình sản xuất và địa vị chính trị - xã hội. Trong các loại hình cơ cấu xã hội, cơ cấu xã hội - giai cấp có vị trí quan trọng hàng đầu, chi phối các loại hình cơ cấu xã hội khác.",
      "Liên minh giai cấp, tầng lớp là vấn đề mang tính nguyên tắc: C. Mác và Ph. Ăngghen chỉ ra nhiều cuộc đấu tranh của giai cấp công nhân thất bại vì \"đơn độc\", không liên minh với \"người bạn đồng minh tự nhiên\" là giai cấp nông dân. V.I. Lênin khẳng định nguyên tắc cao nhất của chuyên chính là duy trì khối liên minh giữa giai cấp vô sản và nông dân.",
      "Ở Việt Nam, sự biến đổi cơ cấu xã hội - giai cấp bị chi phối bởi những biến đổi trong cơ cấu kinh tế, vừa đảm bảo tính quy luật phổ biến vừa mang tính đặc thù. Giai cấp công nhân là giai cấp lãnh đạo cách mạng thông qua Đảng Cộng sản Việt Nam, lực lượng đi đầu trong công nghiệp hóa, hiện đại hóa và nòng cốt trong liên minh công nhân với nông dân và đội ngũ trí thức."
    ],
    "quotes": [
      {
        "id": "chuong-5-lesson-01",
        "title": "Luận điểm then chốt chương 5",
        "audio": null,
        "text": "V.I. Lênin chỉ rõ: \"...nếu không liên minh với nông dân thì không thể có được chính quyền của giai cấp vô sản, không thể nghĩ được đến việc duy trì chính quyền đó... Nguyên tắc cao nhất của chuyên chính là duy trì khối liên minh giữa giai cấp vô sản và nông dân để giai cấp vô sản có thể giữ được vai trò lãnh đạo và chính quyền nhà nước\".",
        "content": [
          "Cơ cấu xã hội là những cộng đồng người cùng toàn bộ những mối quan hệ xã hội do sự tác động lẫn nhau của các cộng đồng ấy tạo nên. Trong thời kỳ quá độ lên chủ nghĩa xã hội, cơ cấu xã hội - giai cấp là tổng thể các giai cấp, tầng lớp, các nhóm xã hội có mối quan hệ hợp tác và gắn bó chặt chẽ, gồm: giai cấp công nhân, giai cấp nông dân, tầng lớp trí thức, tầng lớp doanh nhân, tầng lớp tiểu chủ, tầng lớp thanh niên, phụ nữ, v.v.",
          "Xét dưới góc độ chính trị, cuộc đấu tranh giai cấp đặt ra nhu cầu tất yếu khách quan: mỗi giai cấp đứng ở vị trí trung tâm đều phải tìm cách liên minh với các giai cấp, tầng lớp xã hội khác có những lợi ích phù hợp với mình để tập hợp lực lượng thực hiện những nhu cầu và lợi ích chung - đó là quy luật mang tính phổ biến. Liên minh giai cấp, tầng lớp trong thời kỳ quá độ lên chủ nghĩa xã hội là sự liên kết, hợp tác, hỗ trợ nhau giữa các giai cấp, tầng lớp xã hội nhằm thực hiện nhu cầu và lợi ích của các chủ thể trong khối liên minh, đồng thời tạo động lực thực hiện thắng lợi mục tiêu của chủ nghĩa xã hội.",
          "Từ Đại hội VI (1986), Việt Nam chuyển mạnh sang cơ chế thị trường với việc xây dựng nền kinh tế nhiều thành phần định hướng xã hội chủ nghĩa, dẫn đến sự hình thành một cơ cấu xã hội - giai cấp đa dạng thay cho cơ cấu đơn giản trước đổi mới. Giai cấp công nhân Việt Nam có vai trò quan trọng đặc biệt - giai cấp lãnh đạo cách mạng thông qua đội tiền phong là Đảng Cộng sản Việt Nam, đại diện cho phương thức sản xuất tiên tiến; giai cấp nông dân cùng nông nghiệp, nông thôn có vị trí chiến lược trong sự nghiệp công nghiệp hóa, hiện đại hóa; liên minh giai cấp công nhân với giai cấp nông dân và đội ngũ trí thức là nền tảng của khối đại đoàn kết toàn dân tộc."
        ]
      }
    ]
  },
  {
    "id": "chuong-6",
    "chapter": 6,
    "name": "Dân tộc và tôn giáo",
    "type": "Hành tinh bản sắc",
    "concept": "Đoàn kết dân tộc, tự do tín ngưỡng",
    "signal": "Chương 6",
    "distance": 20,
    "size": 0.76,
    "orbitSpeed": 0.036,
    "rotationSpeed": 0.46,
    "axialTilt": 0.2,
    "phase": 5.1,
    "color": "rose",
    "audio": null,
    "summary": "Chương trình bày quan điểm của chủ nghĩa Mác - Lênin về dân tộc (khái niệm, đặc trưng, hai xu hướng khách quan, cương lĩnh dân tộc của Lênin) và về tôn giáo (bản chất, nguồn gốc, tính chất), đồng thời phân tích đặc điểm quan hệ dân tộc và tôn giáo ở Việt Nam trong thời kỳ quá độ lên chủ nghĩa xã hội.",
    "details": [
      "Dân tộc được hiểu theo hai nghĩa: nghĩa rộng (Nation - cộng đồng người ổn định làm thành nhân dân một nước) và nghĩa hẹp (Ethnie - cộng đồng tộc người). Sự phát triển của dân tộc vận động theo hai xu hướng khách quan: tách ra thành lập dân tộc độc lập và liên hiệp lại với nhau.",
      "Tôn giáo là một hình thái ý thức xã hội phản ánh hư ảo hiện thực khách quan, có nguồn gốc tự nhiên - kinh tế xã hội, nguồn gốc nhận thức và nguồn gốc tâm lý; cần phân biệt tôn giáo với tín ngưỡng và mê tín dị đoan.",
      "Việt Nam là quốc gia đa dân tộc, đa tôn giáo; quan hệ dân tộc và tôn giáo được thiết lập trên cơ sở cộng đồng quốc gia - dân tộc thống nhất và chịu sự chi phối mạnh mẽ bởi tín ngưỡng truyền thống (thờ cúng tổ tiên, anh hùng dân tộc)."
    ],
    "quotes": [
      {
        "id": "chuong-6-lesson-01",
        "title": "Luận điểm then chốt chương 6",
        "audio": null,
        "text": "Cương lĩnh dân tộc của V.I. Lênin khái quát: \"Các dân tộc hoàn toàn bình đẳng, các dân tộc được quyền tự quyết, liên hiệp công nhân tất cả các dân tộc lại\".",
        "content": [
          "Theo chủ nghĩa Mác - Lênin, dân tộc là quá trình phát triển lâu dài của xã hội loài người, trải qua các hình thức cộng đồng từ thấp đến cao: thị tộc, bộ lạc, bộ tộc, dân tộc. Theo nghĩa rộng, dân tộc có các đặc trưng: chung lãnh thổ ổn định, chung phương thức sinh hoạt kinh tế (đặc trưng quan trọng nhất), chung ngôn ngữ, chung văn hóa và tâm lý, chung nhà nước. Theo nghĩa hẹp, dân tộc (tộc người) có các đặc trưng: cộng đồng về ngôn ngữ, cộng đồng về văn hóa và ý thức tự giác tộc người - tiêu chí quan trọng nhất để phân định một tộc người.",
          "Tôn giáo là một hiện tượng xã hội - văn hóa do con người sáng tạo ra, là hình thái ý thức xã hội phản ánh hư ảo hiện thực khách quan, trong đó các lực lượng tự nhiên và xã hội trở thành siêu nhiên, thần bí. Tôn giáo có ba nguồn gốc: tự nhiên - kinh tế xã hội, nhận thức và tâm lý. Người cộng sản luôn tôn trọng quyền tự do tín ngưỡng, theo hoặc không theo tôn giáo của nhân dân, đồng thời kiên quyết đấu tranh chống mê tín dị đoan và mọi hoạt động lợi dụng tôn giáo.",
          "Ở Việt Nam, quan hệ dân tộc và tôn giáo có những đặc điểm đặc thù: Việt Nam là quốc gia đa dân tộc, đa tôn giáo với nền tảng cộng đồng quốc gia - dân tộc thống nhất; các tôn giáo có truyền thống gắn bó, đồng hành cùng dân tộc; tín ngưỡng truyền thống (thờ cúng tổ tiên, thờ anh hùng dân tộc, thờ Thành hoàng làng) chi phối mạnh mẽ đời sống tâm linh. Dưới sự lãnh đạo của Đảng, quan hệ này nhìn chung được giải quyết khá tốt, nhưng vẫn cần đấu tranh chống mọi hành động lợi dụng dân tộc, tôn giáo gây mất ổn định chính trị - xã hội."
        ]
      }
    ]
  },
  {
    "id": "chuong-7",
    "chapter": 7,
    "name": "Gia đình thời kỳ quá độ",
    "type": "Hành tinh tổ ấm",
    "concept": "Gia đình - tế bào của xã hội",
    "signal": "Chương 7",
    "distance": 22.5,
    "size": 0.72,
    "orbitSpeed": 0.032,
    "rotationSpeed": 0.42,
    "axialTilt": 0.08,
    "phase": 5.9,
    "color": "silver",
    "audio": null,
    "summary": "Chương trình bày quan điểm của chủ nghĩa Mác - Lênin, tư tưởng Hồ Chí Minh về gia đình: khái niệm, vị trí (tế bào của xã hội, tổ ấm, cầu nối giữa cá nhân với xã hội) và các chức năng cơ bản của gia đình; phân tích cơ sở kinh tế - xã hội và chính trị - xã hội để xây dựng gia đình trong thời kỳ quá độ lên chủ nghĩa xã hội; làm rõ những biến đổi của gia đình Việt Nam hiện nay.",
    "details": [
      "Gia đình là một hình thức cộng đồng xã hội đặc biệt, được hình thành, duy trì và củng cố chủ yếu dựa trên cơ sở hôn nhân, quan hệ huyết thống và quan hệ nuôi dưỡng; gia đình có vị trí tế bào của xã hội, là tổ ấm và là cầu nối giữa cá nhân với xã hội.",
      "Cơ sở xây dựng gia đình trong thời kỳ quá độ lên chủ nghĩa xã hội gồm: cơ sở kinh tế - xã hội (quan hệ sản xuất mới xã hội chủ nghĩa với chế độ sở hữu xã hội chủ nghĩa về tư liệu sản xuất) và cơ sở chính trị - xã hội (nhà nước xã hội chủ nghĩa với hệ thống pháp luật, trong đó có Luật hôn nhân và gia đình).",
      "Gia đình Việt Nam hiện nay là \"gia đình quá độ\": mô hình gia đình đơn (hạt nhân) trở nên phổ biến, quy mô thu nhỏ, các chức năng và mối quan hệ gia đình biến đổi, đồng thời đối mặt nhiều thách thức như ly hôn, ly thân, ngoại tình, bạo hành gia đình."
    ],
    "quotes": [
      {
        "id": "chuong-7-lesson-01",
        "title": "Luận điểm then chốt chương 7",
        "audio": null,
        "text": "Chủ tịch Hồ Chí Minh khẳng định: \"... nhiều gia đình cộng lại mới thành xã hội, xã hội tốt thì gia đình càng tốt, gia đình tốt thì xã hội mới tốt. Hạt nhân của xã hội là gia đình\". Người cũng nhấn mạnh: \"Nếu không giải phóng phụ nữ là xây dựng chủ nghĩa xã hội chỉ một nửa\".",
        "content": [
          "Gia đình là một cộng đồng người đặc biệt, có vai trò quyết định đến sự tồn tại và phát triển của xã hội. Cơ sở hình thành gia đình là hai mối quan hệ cơ bản: quan hệ hôn nhân (vợ và chồng) - cơ sở, nền tảng hình thành các mối quan hệ khác - và quan hệ huyết thống (cha mẹ và con cái), cùng quan hệ nuôi dưỡng. Gia đình giữ ba vị trí: là tế bào của xã hội, là tổ ấm mang lại hạnh phúc cho mỗi thành viên, và là cầu nối giữa cá nhân với xã hội. Gia đình có bốn chức năng cơ bản: tái sản xuất ra con người (chức năng đặc thù, không cộng đồng nào thay thế được); nuôi dưỡng, giáo dục; kinh tế và tổ chức tiêu dùng; thỏa mãn nhu cầu tâm sinh lý, duy trì tình cảm gia đình.",
          "Về cơ sở kinh tế - xã hội: sự phát triển của lực lượng sản xuất và quan hệ sản xuất mới xã hội chủ nghĩa, với cốt lõi là chế độ sở hữu xã hội chủ nghĩa về tư liệu sản xuất từng bước thay thế chế độ tư hữu, là cơ sở để xóa bỏ nguồn gốc áp bức, bóc lột và bất bình đẳng trong xã hội và gia đình, xây dựng quan hệ bình đẳng và giải phóng phụ nữ. Về cơ sở chính trị - xã hội: việc thiết lập chính quyền nhà nước của giai cấp công nhân và nhân dân lao động - nhà nước xã hội chủ nghĩa - cùng hệ thống pháp luật (trong đó có Luật hôn nhân và gia đình) bảo vệ chế độ hôn nhân một vợ một chồng, bảo đảm bình đẳng, dân chủ trong gia đình.",
          "Trong thời kỳ quá độ lên chủ nghĩa xã hội, gia đình Việt Nam có sự biến đổi tương đối toàn diện: gia đình đơn (gia đình hạt nhân) với hai thế hệ cùng chung sống trở nên phổ biến, thay thế kiểu gia đình truyền thống ba, bốn thế hệ; chức năng tái sản xuất ra con người được thực hiện chủ động, tự giác qua cuộc vận động sinh đẻ có kế hoạch; kinh tế gia đình chuyển từ tự cấp tự túc sang kinh tế hàng hóa. Tuy nhiên, gia đình Việt Nam cũng đối mặt nhiều mặt trái: quan hệ vợ chồng - gia đình lỏng lẻo, gia tăng ly hôn, ly thân, ngoại tình, bạo hành trong gia đình... đòi hỏi những phương hướng, giải pháp xây dựng gia đình noi gương mẫu, hạnh phúc, bình đẳng, tiến bộ."
        ]
      }
    ]
  }
]
