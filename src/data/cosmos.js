import daiDoanKetAudio from '../assets/Audio/Dai_doan_ket_dan_toc.wav'
import daoDucAudio from '../assets/Audio/Dao_duc_cach_mang.wav'
import docLapAudio from '../assets/Audio/Doc_lap_dan_toc.wav'
import nguonGocAudio from '../assets/Audio/Nguon_goc_tu_tuong.wav'
import nhaNuocAudio from '../assets/Audio/Nha_nuoc_cua_dan_do_dan_vi_dan.wav'
import phongCachAudio from '../assets/Audio/Phong_cach_Ho_Chi_Minh.wav'
import quocTeAudio from '../assets/Audio/Quoc_te_va_thoi_dai.wav'
import tongQuanAudio from '../assets/Audio/Tong_quan_tu_tuong_Ho_Chi_Minh.wav'
import nhanVanAudio from '../assets/Audio/Tu_tuong_nhan_van.wav'
import vanHoaAudio from '../assets/Audio/Van_hoa_va_con_nguoi.wav'

export const introCards = [
  {
    id: 'memory',
    index: '01',
    title: 'Mở khóa ký ức',
    text: 'Mỗi chủ đề được đặt thành một hành tinh để người học khám phá theo hành trình trực quan.',
  },
  {
    id: 'quotes',
    index: '02',
    title: 'Bookmark câu nói',
    text: 'Mỗi bookmark mở ra một câu nói tiêu biểu và nội dung chuyên đề về tư tưởng Hồ Chí Minh.',
  },
  {
    id: 'reflection',
    index: '03',
    title: 'Kết nối tư tưởng',
    text: 'Các hành tinh liên kết thành hệ thống quan điểm toàn diện về cách mạng Việt Nam.',
  },
]

export const planetPalette = {
  cyan: ['#b9f7ff', '#21b8ff', '#123c76'],
  gold: ['#fff4b8', '#f7b84d', '#8d5529'],
  violet: ['#ead9ff', '#9f62ff', '#2a1974'],
  emerald: ['#d5ffe9', '#45d88f', '#125b5e'],
  red: ['#ffd0c4', '#ff715d', '#7a1a36'],
  blue: ['#d2f3ff', '#668cff', '#25337a'],
  rose: ['#ffe1ee', '#ff78ad', '#6b1b60'],
  silver: ['#ffffff', '#a9c0dc', '#3d4e70'],
}

export const planets = [
  {
    id: 'ho-chi-minh',
    name: 'Hồ Chí Minh',
    type: 'Mặt trời ký ức',
    concept: 'Độc lập, tự do và hạnh phúc',
    signal: 'Tổng quan',
    distance: 0,
    size: 1.72,
    orbitSpeed: 0,
    rotationSpeed: 0.22,
    axialTilt: 0,
    phase: 0,
    color: 'gold',
    audio: tongQuanAudio,
    summary:
      'Tư tưởng Hồ Chí Minh là hệ thống quan điểm toàn diện về cách mạng Việt Nam, được hình thành từ chủ nghĩa yêu nước, chủ nghĩa Mác - Lênin và tinh hoa văn hóa nhân loại.',
    details: [
      'Nội dung cốt lõi bao gồm độc lập dân tộc gắn liền với chủ nghĩa xã hội, đại đoàn kết toàn dân tộc và Nhà nước của dân, do dân, vì dân.',
      'Tư tưởng Hồ Chí Minh đề cao đạo đức cách mạng, phát triển văn hóa, con người, tinh thần nhân văn và đoàn kết quốc tế.',
      'Đây vẫn là nền tảng tư tưởng, kim chỉ nam cho công cuộc đổi mới, hội nhập và xây dựng đất nước.',
    ],
    quotes: [
      {
        id: 'hcm-core-01',
        title: 'Tổng quan tư tưởng Hồ Chí Minh',
        audio: tongQuanAudio,
        text: 'Tôi chỉ có một sự ham muốn, ham muốn tột bậc là làm sao cho nước ta được hoàn toàn độc lập, dân ta được hoàn toàn tự do, đồng bào ai cũng có cơm ăn áo mặc, ai cũng được học hành.',
        content: [
          'Tư tưởng Hồ Chí Minh là hệ thống quan điểm toàn diện về cách mạng Việt Nam, được hình thành từ sự kết hợp giữa chủ nghĩa yêu nước dân tộc, chủ nghĩa Mác - Lênin và tinh hoa văn hóa nhân loại.',
          'Nội dung cốt lõi của tư tưởng này bao gồm: độc lập dân tộc gắn liền với chủ nghĩa xã hội, đại đoàn kết toàn dân tộc, xây dựng Nhà nước của dân, do dân, vì dân, đề cao đạo đức cách mạng, phát triển văn hóa và con người, phát huy tinh thần nhân văn và đoàn kết quốc tế.',
          'Tư tưởng Hồ Chí Minh đã chỉ ra con đường đúng đắn cho sự nghiệp giải phóng dân tộc, góp phần đưa Việt Nam giành độc lập và phát triển đất nước. Đến nay, đây vẫn là nền tảng tư tưởng, kim chỉ nam cho công cuộc đổi mới, hội nhập và xây dựng một nước Việt Nam giàu mạnh, văn minh, hạnh phúc.',
        ],
      },
    ],
  },
  {
    id: 'nguon-goc',
    name: 'Nguồn gốc tư tưởng',
    type: 'Hành tinh khởi nguyên',
    concept: 'Yêu nước, Mác - Lênin và tinh hoa nhân loại',
    signal: 'Khởi nguyên',
    distance: 7.5,
    size: 0.74,
    orbitSpeed: 0.08,
    rotationSpeed: 0.8,
    axialTilt: 0.12,
    phase: 0,
    color: 'cyan',
    audio: nguonGocAudio,
    summary:
      'Tư tưởng Hồ Chí Minh được hình thành từ chủ nghĩa yêu nước Việt Nam, chủ nghĩa Mác - Lênin và tinh hoa văn hóa nhân loại.',
    details: [
      'Lòng yêu nước nồng nàn đã thôi thúc Nguyễn Ái Quốc ra đi tìm đường cứu nước năm 1911.',
      'Chủ nghĩa Mác - Lênin giúp Người tìm thấy con đường giải phóng dân tộc, giai cấp và con người.',
      'Người chọn lọc những giá trị tiến bộ của văn hóa Đông - Tây như nhân nghĩa, dân chủ, tự do và bình đẳng.',
    ],
    quotes: [
      {
        id: 'origin-01',
        title: 'Nguồn gốc tư tưởng Hồ Chí Minh',
        audio: nguonGocAudio,
        text: 'Lúc đầu, chính chủ nghĩa yêu nước, chứ chưa phải chủ nghĩa cộng sản, đã đưa tôi tin theo Lênin, tin theo Quốc tế thứ ba.',
        content: [
          'Chủ tịch Hồ Chí Minh khẳng định rằng chính chủ nghĩa yêu nước đã đưa Người đến với chủ nghĩa Mác - Lênin và con đường cách mạng vô sản. Tư tưởng Hồ Chí Minh được hình thành từ ba nguồn gốc chủ yếu: chủ nghĩa yêu nước Việt Nam, chủ nghĩa Mác - Lênin và tinh hoa văn hóa nhân loại.',
          'Lòng yêu nước nồng nàn đã thôi thúc Nguyễn Ái Quốc ra đi tìm đường cứu nước năm 1911. Trong quá trình hoạt động cách mạng, Người tiếp thu chủ nghĩa Mác - Lênin và nhận ra đây là con đường đúng đắn để giải phóng dân tộc, giai cấp và con người.',
          'Đồng thời, Hồ Chí Minh còn chọn lọc những giá trị tiến bộ của văn hóa Đông - Tây như nhân nghĩa, yêu thương con người, dân chủ, tự do và bình đẳng. Sự kết hợp sáng tạo các nguồn gốc đó đã tạo nên nền tảng tư tưởng, kim chỉ nam cho cách mạng Việt Nam.',
        ],
      },
    ],
  },
  {
    id: 'doc-lap',
    name: 'Độc lập dân tộc',
    type: 'Hành tinh tự do',
    concept: 'Độc lập thực sự, toàn diện',
    signal: 'Tự do',
    distance: 7.5,
    size: 0.66,
    orbitSpeed: 0.08,
    rotationSpeed: 0.7,
    axialTilt: 0.24,
    phase: 3.14,
    color: 'gold',
    audio: docLapAudio,
    summary:
      'Độc lập dân tộc là quyền thiêng liêng, bất khả xâm phạm và phải gắn liền với tự do, hạnh phúc của nhân dân.',
    details: [
      'Độc lập là điều kiện để nhân dân làm chủ vận mệnh, sống trong hòa bình, tự do và hạnh phúc.',
      'Độc lập phải thực sự, toàn diện trên các lĩnh vực chính trị, kinh tế, văn hóa và chủ quyền quốc gia.',
      'Độc lập chỉ có ý nghĩa khi nhân dân được hưởng hạnh phúc và tự do.',
    ],
    quotes: [
      {
        id: 'freedom-01',
        title: 'Độc lập dân tộc',
        audio: docLapAudio,
        text: 'Không có gì quý hơn độc lập, tự do.',
        content: [
          'Chủ tịch Hồ Chí Minh coi độc lập dân tộc là quyền thiêng liêng và bất khả xâm phạm của mọi quốc gia. Đối với Việt Nam, độc lập không chỉ là khát vọng cháy bỏng mà còn là điều kiện để nhân dân được làm chủ vận mệnh, sống trong hòa bình, tự do và hạnh phúc.',
          'Hồ Chí Minh nhấn mạnh rằng độc lập phải là độc lập thực sự, toàn diện trên các lĩnh vực chính trị, kinh tế, văn hóa và chủ quyền quốc gia.',
          'Đồng thời, độc lập dân tộc phải gắn liền với hạnh phúc của nhân dân, bởi nếu nước độc lập mà dân không được hưởng hạnh phúc, tự do thì độc lập cũng chẳng có nghĩa lý gì. Tư tưởng đó đã trở thành mục tiêu và lý tưởng mà Người suốt đời phấn đấu thực hiện.',
        ],
      },
    ],
  },
  {
    id: 'dai-doan-ket',
    name: 'Khối đại đoàn kết dân tộc',
    type: 'Hành tinh liên kết',
    concept: 'Sự đồng lòng của toàn dân',
    signal: 'Đoàn kết',
    distance: 11.0,
    size: 0.6,
    orbitSpeed: 0.06,
    rotationSpeed: 0.9,
    axialTilt: 0.18,
    phase: 1.5,
    color: 'violet',
    audio: daiDoanKetAudio,
    summary:
      'Đại đoàn kết dân tộc là nhân tố quyết định mọi thắng lợi của cách mạng Việt Nam và bắt nguồn từ sự đồng lòng của toàn dân.',
    details: [
      'Đại đoàn kết được xây dựng trên lòng yêu nước, tinh thần nhân ái và sự tôn trọng lợi ích chính đáng của nhân dân.',
      'Mọi lực lượng cùng hướng tới độc lập dân tộc và xây dựng đất nước đều cần được tập hợp.',
      'Nhân dân là gốc của khối đoàn kết và là nguồn sức mạnh to lớn của dân tộc.',
    ],
    quotes: [
      {
        id: 'unity-01',
        title: 'Khối đại đoàn kết dân tộc',
        audio: daiDoanKetAudio,
        text: 'Đoàn kết, đoàn kết, đại đoàn kết; Thành công, thành công, đại thành công.',
        content: [
          'Chủ tịch Hồ Chí Minh coi đại đoàn kết dân tộc là nhân tố quyết định mọi thắng lợi của cách mạng Việt Nam. Theo Người, sức mạnh lớn nhất của dân tộc không nằm ở vật chất hay vũ khí mà ở sự đồng lòng của toàn dân.',
          'Đại đoàn kết phải được xây dựng trên nền tảng lòng yêu nước, tinh thần nhân ái và sự tôn trọng lợi ích chính đáng của các tầng lớp nhân dân. Hồ Chí Minh chủ trương tập hợp mọi lực lượng, không phân biệt dân tộc, tôn giáo, giai cấp hay quá khứ, miễn là cùng hướng tới mục tiêu độc lập dân tộc và xây dựng đất nước.',
          'Người đặc biệt nhấn mạnh vai trò của nhân dân, coi nhân dân là gốc của khối đoàn kết và là nguồn sức mạnh to lớn của dân tộc.',
        ],
      },
    ],
  },
  {
    id: 'nha-nuoc',
    name: 'Nhà nước của dân',
    type: 'Hành tinh công quyền',
    concept: 'Của dân, do dân và vì dân',
    signal: 'Nhân dân',
    distance: 11.0,
    size: 0.68,
    orbitSpeed: 0.06,
    rotationSpeed: 0.65,
    axialTilt: 0.3,
    phase: 4.64,
    color: 'emerald',
    audio: nhaNuocAudio,
    summary:
      'Nhà nước của dân, do dân và vì dân đặt mọi quyền lực thuộc về nhân dân và lấy việc phục vụ nhân dân làm mục tiêu cao nhất.',
    details: [
      'Nhân dân có quyền tham gia quản lý, giám sát và quyết định những vấn đề quan trọng của đất nước.',
      'Nhà nước được nhân dân xây dựng, ủng hộ và giao phó trách nhiệm cho đội ngũ cán bộ, công chức.',
      'Nhà nước chỉ vững mạnh khi gắn bó mật thiết và hết lòng phục vụ nhân dân.',
    ],
    quotes: [
      {
        id: 'people-01',
        title: 'Nhà nước của dân, do dân và vì dân',
        audio: nhaNuocAudio,
        text: 'Nước ta là nước dân chủ, bao nhiêu lợi ích đều vì dân, bao nhiêu quyền hạn đều của dân.',
        content: [
          'Chủ tịch Hồ Chí Minh khẳng định tư tưởng về Nhà nước của dân, do dân và vì dân. Nhà nước của dân nghĩa là mọi quyền lực thuộc về nhân dân; nhân dân có quyền tham gia quản lý, giám sát và quyết định những vấn đề quan trọng của đất nước.',
          'Nhà nước do dân là nhà nước được nhân dân xây dựng, ủng hộ và giao phó trách nhiệm cho đội ngũ cán bộ, công chức. Nhà nước vì dân có mục tiêu cao nhất là phục vụ lợi ích, hạnh phúc của nhân dân, chăm lo đời sống vật chất và tinh thần cho dân.',
          'Hồ Chí Minh luôn coi dân là gốc, đồng thời nhấn mạnh rằng nhà nước chỉ vững mạnh khi gắn bó mật thiết với nhân dân và hết lòng phục vụ nhân dân.',
        ],
      },
    ],
  },
  {
    id: 'dao-duc',
    name: 'Đạo đức cách mạng',
    type: 'Hành tinh gương sáng',
    concept: 'Nền tảng và gốc rễ',
    signal: 'Đạo đức',
    distance: 14.5,
    size: 0.72,
    orbitSpeed: 0.04,
    rotationSpeed: 0.82,
    axialTilt: 0.38,
    phase: 0.5,
    color: 'red',
    audio: daoDucAudio,
    summary:
      'Đạo đức cách mạng là nền tảng và gốc rễ của người cách mạng, cần được rèn luyện thường xuyên, suốt đời.',
    details: [
      'Phẩm chất quan trọng là trung với nước, hiếu với dân và đặt lợi ích chung lên trên lợi ích cá nhân.',
      'Các chuẩn mực cốt lõi gồm cần, kiệm, liêm, chính, chí công vô tư.',
      'Đạo đức cách mạng được rèn luyện thường xuyên qua học tập, lao động và đấu tranh.',
    ],
    quotes: [
      {
        id: 'ethics-01',
        title: 'Tư tưởng Hồ Chí Minh về đạo đức cách mạng',
        audio: daoDucAudio,
        text: 'Cũng như sông thì có nguồn mới có nước, không có nguồn thì sông cạn. Cây phải có gốc, không có gốc thì cây héo. Người cách mạng phải có đạo đức, không có đạo đức thì dù tài giỏi mấy cũng không lãnh đạo được nhân dân.',
        content: [
          'Chủ tịch Hồ Chí Minh coi đạo đức cách mạng là nền tảng và gốc rễ của người cách mạng. Theo Người, phẩm chất quan trọng nhất là trung với nước, hiếu với dân, luôn đặt lợi ích của Tổ quốc và nhân dân lên trên lợi ích cá nhân.',
          'Hồ Chí Minh cũng đề cao các chuẩn mực đạo đức như cần, kiệm, liêm, chính, chí công vô tư; yêu cầu cán bộ sống trong sạch, ngay thẳng, chống tham ô, lãng phí và tư lợi. Bên cạnh đó, Người nhấn mạnh tinh thần yêu thương con người, đoàn kết, giúp đỡ đồng bào, đồng chí và có tinh thần quốc tế trong sáng.',
          'Đặc biệt, đạo đức cách mạng phải được rèn luyện thường xuyên, suốt đời thông qua học tập, lao động và đấu tranh. Đây là những chuẩn mực đạo đức quan trọng mà mỗi cán bộ, đảng viên và công dân cần noi theo.',
        ],
      },
    ],
  },
  {
    id: 'van-hoa',
    name: 'Văn hóa và con người',
    type: 'Hành tinh khai sáng',
    concept: 'Văn hóa và chiến lược trồng người',
    signal: 'Văn hóa',
    distance: 14.5,
    size: 0.64,
    orbitSpeed: 0.04,
    rotationSpeed: 0.72,
    axialTilt: 0.2,
    phase: 3.64,
    color: 'blue',
    audio: vanHoaAudio,
    summary:
      'Văn hóa và con người là nền tảng cho sự phát triển bền vững; giáo dục thế hệ trẻ và trồng người là chiến lược lâu dài.',
    details: [
      'Văn hóa vừa là mục tiêu vừa là động lực của xã hội, góp phần nâng cao dân trí và bồi dưỡng nhân cách.',
      'Thanh niên là chủ nhân tương lai và lực lượng quyết định sự phát triển của dân tộc.',
      'Cần giữ gìn bản sắc dân tộc và tiếp thu có chọn lọc tinh hoa văn hóa nhân loại.',
    ],
    quotes: [
      {
        id: 'culture-01',
        title: 'Tư tưởng Hồ Chí Minh về văn hóa và con người',
        audio: vanHoaAudio,
        text: 'Non sông Việt Nam có trở nên tươi đẹp hay không, dân tộc Việt Nam có bước tới đài vinh quang để sánh vai với các cường quốc năm châu được hay không, chính là nhờ một phần lớn ở công học tập của các em.',
        content: [
          'Chủ tịch Hồ Chí Minh coi văn hóa và con người là nền tảng cho sự phát triển bền vững của đất nước. Theo Người, văn hóa vừa là mục tiêu vừa là động lực của xã hội, góp phần nâng cao dân trí, bồi dưỡng nhân cách và xây dựng đời sống tinh thần lành mạnh.',
          'Hồ Chí Minh đặc biệt quan tâm đến giáo dục thế hệ trẻ, xem thanh niên là chủ nhân tương lai và lực lượng quyết định sự phát triển của dân tộc. Vì vậy, việc học tập, rèn luyện đạo đức và lý tưởng cách mạng có ý nghĩa vô cùng quan trọng. Người cũng nhấn mạnh nhiệm vụ trồng người là chiến lược lâu dài của cách mạng.',
          'Đồng thời, Hồ Chí Minh đề cao việc giữ gìn bản sắc văn hóa dân tộc và tiếp thu có chọn lọc tinh hoa văn hóa nhân loại để xây dựng một nước Việt Nam giàu mạnh, văn minh và phát triển bền vững.',
        ],
      },
    ],
  },
  {
    id: 'phong-cach',
    name: 'Phong cách Hồ Chí Minh',
    type: 'Hành tinh giản dị',
    concept: 'Nói đi đôi với làm',
    signal: 'Phong cách',
    distance: 18.0,
    size: 0.58,
    orbitSpeed: 0.025,
    rotationSpeed: 0.78,
    axialTilt: 0.34,
    phase: 0,
    color: 'silver',
    audio: phongCachAudio,
    summary:
      'Phong cách Hồ Chí Minh kết hợp hài hòa giữa đạo đức, trách nhiệm, sự giản dị và tinh thần phục vụ nhân dân.',
    details: [
      'Nói đi đôi với làm, lấy hành động và kết quả thực tế làm thước đo uy tín.',
      'Lối sống giản dị, khiêm tốn, tiết kiệm và gần gũi quần chúng.',
      'Phong cách làm việc khoa học, dân chủ, tôn trọng tập thể và học hỏi từ thực tiễn.',
    ],
    quotes: [
      {
        id: 'style-01',
        title: 'Phong cách Hồ Chí Minh',
        audio: phongCachAudio,
        text: 'Nói thì phải làm được, kiểm tra đến nơi đến chốn, như đã hứa.',
        content: [
          'Chủ tịch Hồ Chí Minh là tấm gương tiêu biểu về phong cách sống và làm việc mẫu mực. Theo Người, điều quan trọng nhất là nói đi đôi với làm, lấy hành động và kết quả thực tế làm thước đo uy tín của cán bộ. Hồ Chí Minh luôn đề cao tinh thần trách nhiệm, giữ chữ tín và thực hiện đầy đủ những điều đã hứa với nhân dân.',
          'Bên cạnh đó, Người nổi bật với lối sống giản dị, khiêm tốn, tiết kiệm và gần gũi quần chúng, dù giữ cương vị lãnh đạo cao nhất của đất nước. Trong công việc, Bác luôn làm việc khoa học, dân chủ, tôn trọng tập thể, lắng nghe ý kiến nhân dân và học hỏi từ thực tiễn.',
          'Phong cách Hồ Chí Minh là sự kết hợp hài hòa giữa đạo đức, trách nhiệm, sự giản dị và tinh thần phục vụ nhân dân, trở thành tấm gương sáng cho mọi người noi theo.',
        ],
      },
    ],
  },
  {
    id: 'nhan-van',
    name: 'Tư tưởng nhân văn',
    type: 'Hành tinh nhân ái',
    concept: 'Con người là trung tâm',
    signal: 'Nhân văn',
    distance: 18.0,
    size: 0.6,
    orbitSpeed: 0.025,
    rotationSpeed: 0.64,
    axialTilt: 0.22,
    phase: 2.1,
    color: 'rose',
    audio: nhanVanAudio,
    summary:
      'Tư tưởng nhân văn Hồ Chí Minh lấy con người làm trung tâm, hướng tới hạnh phúc của nhân dân và tin vào khả năng tiến bộ của mỗi người.',
    details: [
      'Mọi việc phải xuất phát từ lợi ích của nhân dân.',
      'Mục tiêu của cách mạng là mang lại cuộc sống ấm no, tự do và hạnh phúc cho mọi người.',
      'Tư tưởng nhân văn đề cao yêu thương, khoan dung, đoàn kết, sẻ chia và trách nhiệm cộng đồng.',
    ],
    quotes: [
      {
        id: 'humanity-01',
        title: 'Tư tưởng nhân văn Hồ Chí Minh',
        audio: nhanVanAudio,
        text: 'Việc gì có lợi cho dân thì hết sức làm, việc gì có hại cho dân thì hết sức tránh.',
        content: [
          'Tư tưởng nhân văn Hồ Chí Minh lấy con người làm trung tâm và hướng tới hạnh phúc của nhân dân. Người luôn khẳng định mọi việc phải xuất phát từ lợi ích của dân.',
          'Theo Hồ Chí Minh, mục tiêu cao nhất của cách mạng không chỉ là giành độc lập dân tộc mà còn mang lại cuộc sống ấm no, tự do và hạnh phúc cho mọi người. Tư tưởng nhân văn của Người còn thể hiện ở lòng yêu thương, khoan dung và tôn trọng con người, luôn tin vào khả năng tiến bộ của mỗi cá nhân.',
          'Đồng thời, Người đề cao tinh thần đoàn kết, sẻ chia và trách nhiệm với cộng đồng. Những giá trị nhân ái đó đã làm nên nét đẹp sâu sắc trong tư tưởng và nhân cách Hồ Chí Minh.',
        ],
      },
    ],
  },
  {
    id: 'quoc-te',
    name: 'Quốc tế và thời đại',
    type: 'Hành tinh kết nối',
    concept: 'Sức mạnh dân tộc và sức mạnh thời đại',
    signal: 'Thời đại',
    distance: 18.0,
    size: 0.56,
    orbitSpeed: 0.025,
    rotationSpeed: 0.7,
    axialTilt: 0.26,
    phase: 4.2,
    color: 'cyan',
    audio: quocTeAudio,
    summary:
      'Tư tưởng quốc tế và thời đại gắn độc lập dân tộc với đoàn kết quốc tế, kết hợp sức mạnh dân tộc với sức mạnh thời đại.',
    details: [
      'Cách mạng Việt Nam là một bộ phận của cách mạng thế giới.',
      'Cần đề cao tự lực, tự cường đồng thời xây dựng hữu nghị, hợp tác và tranh thủ sự ủng hộ quốc tế.',
      'Đoàn kết với các dân tộc bị áp bức và phong trào vì hòa bình, dân chủ, tiến bộ xã hội.',
    ],
    quotes: [
      {
        id: 'global-01',
        title: 'Quốc tế và thời đại',
        audio: quocTeAudio,
        text: 'Quan sơn muôn dặm một nhà, bốn phương vô sản đều là anh em.',
        content: [
          'Tư tưởng Hồ Chí Minh về quốc tế và thời đại thể hiện sự gắn bó chặt chẽ giữa độc lập dân tộc và đoàn kết quốc tế. Người khẳng định cách mạng Việt Nam là một bộ phận của cách mạng thế giới, vì vậy cần kết hợp sức mạnh dân tộc với sức mạnh của thời đại để tạo nên sức mạnh tổng hợp.',
          'Hồ Chí Minh luôn đề cao tinh thần tự lực, tự cường nhưng đồng thời coi trọng việc xây dựng tình hữu nghị, hợp tác với các dân tộc yêu chuộng hòa bình và tranh thủ sự ủng hộ của bạn bè quốc tế.',
          'Người cũng thể hiện sự đoàn kết, cảm thông sâu sắc với các dân tộc bị áp bức và các phong trào đấu tranh vì hòa bình, dân chủ và tiến bộ xã hội. Tư tưởng này đã góp phần quan trọng vào thắng lợi của cách mạng Việt Nam và vẫn còn nguyên giá trị trong thời đại ngày nay.',
        ],
      },
    ],
  },
]
