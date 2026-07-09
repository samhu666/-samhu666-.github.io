// ===================== i18n：中／英一鍵切換 =====================
const translations = {
  zh: {
    'meta.title': 'FS MEC STUDIO｜機械工程專業接案團隊',
    'meta.description': 'FS MEC STUDIO 是專注於機械工程領域的專業接案團隊，提供 3D 建模、機電整合、模擬分析與原型製作等專業服務。',

    'nav.services': '服務項目',
    'nav.work': '作品案例',
    'nav.process': '合作流程',
    'nav.team': '團隊成員',
    'nav.contact': '開始洽詢',
    'nav.toggleLabel': '開啟選單',

    'hero.eyebrow': '機械工程專業接案團隊',
    'hero.title': '把工程圖紙上的想法，<br />做成<span class="hero-title-accent">看得見、動得了</span>的實物。',
    'hero.sub': '我們是一支橫跨機構設計、控制系統與模擬分析的機械工程團隊，提供從概念設計、3D 建模到原型製作的完整接案服務。',
    'hero.ctaPrimary': '開始洽詢專案',
    'hero.ctaGhost': '查看作品案例',
    'hero.stat1': '完成專案',
    'hero.stat2': '合作單位 / 廠商',
    'hero.stat3': '核心成員',
    'hero.stat4': '準時交付率',
    'hero.scrollCue': '向下捲動',

    'services.title': '四個專長領域，<br/>涵蓋一個機構專案的完整流程',
    'services.card1.title': '3D 建模與工程圖繪製',
    'services.card1.desc': '使用 SolidWorks／Fusion 360 進行零件設計、組裝結構與公差配置，產出符合加工規範的工程圖與 BOM 表。',
    'services.card1.tag1': '零件設計',
    'services.card1.tag2': '組裝圖',
    'services.card1.tag3': '工程圖紙',
    'services.card2.title': '機電整合與自動化',
    'services.card2.desc': '感測器與控制器整合、PLC 邏輯設計、小型自動化裝置與機器人開發，串起機構與電控的最後一哩路。',
    'services.card2.tag1': 'PLC 控制',
    'services.card2.tag2': '感測整合',
    'services.card2.tag3': '自動化裝置',
    'services.card3.title': '模擬分析與數據處理',
    'services.card3.desc': 'MATLAB／ANSYS 結構與流體模擬、實驗數據整理與統計分析，並協助整理成清楚易懂的報告與圖表。',
    'services.card3.tag1': '結構模擬',
    'services.card3.tag2': '數據分析',
    'services.card3.tag3': '報告撰寫',
    'services.card4.title': '3D 列印與原型製作',
    'services.card4.desc': '從樹脂到 PLA 的多種列印工藝，快速製作小型零件與功能原型，協助驗證設計並縮短開發週期。',
    'services.card4.tag1': '原型製作',
    'services.card4.tag2': '零件列印',
    'services.card4.tag3': '設計驗證',

    'work.title': '近期作品案例',
    'work.card1.tag': '機構設計',
    'work.card1.title': '引擎機構模型設計',
    'work.card1.desc': '以 SolidWorks 完整建構渦輪噴射引擎內部機構，剖面呈現風扇、壓縮機與渦輪葉片的多級裝配關係，驗證複雜旋轉機構的建模與干涉檢查能力。',
    'work.card1.imgAlt': '引擎機構模型設計 SolidWorks 剖面渲染圖',
    'work.card2.tag': '模擬分析',
    'work.card2.title': '無人機機臂結構優化',
    'work.card2.desc': '使用 ANSYS 進行拓樸優化與應力模擬，機臂減重 23% 同時維持原有強度。',
    'work.card3.tag': '自動化整合',
    'work.card3.title': '桌上型循線機器人套件',
    'work.card3.desc': '為教育訓練設計的教學用循線機器人，含開源韌體與教材文件，已授權給 3 個單位使用。',
    'work.card4.tag': '原型製作',
    'work.card4.title': '義肢手部關節原型',
    'work.card4.desc': '與生醫工程團隊合作，以樹脂列印製作三代關節原型，協助驗證握力與活動範圍。',

    'process.title': '合作流程',
    'process.step1.title': '需求諮詢',
    'process.step1.desc': '透過表單或社群了解專案背景、時程與預算，初步評估可行性。',
    'process.step2.title': '報價與規劃',
    'process.step2.desc': '依專案複雜度提供報價單與時程規劃，確認後簽署合作備忘。',
    'process.step3.title': '設計與製作',
    'process.step3.desc': '依階段回報進度與草稿，重要節點皆與客戶確認方向再繼續。',
    'process.step4.title': '交付與後續支援',
    'process.step4.desc': '提供完整檔案與說明文件，並於交付後提供一段時間的免費調整。',

    'team.title': '團隊成員',
    'team.desc': '目前由胡○淳負責網站整體規劃與排版設計。',
    'team.member1.role': '網站設計 / 全案統籌',
    'team.member1.desc': '負責網站整體規劃與排版設計。',

    'testimonials.title': '合作夥伴怎麼說',
    'testimonials.quote1': '「從建模到交付都很有效率，工程圖標註也很清楚，幫我們省下不少溝通成本。」',
    'testimonials.footer1': '— 合作廠商研發主管',
    'testimonials.quote2': '「原本還在猶豫要不要找外部團隊，結果比外包廠商還細心，還會主動提醒設計上的風險。」',
    'testimonials.footer2': '— 新創公司創辦人',
    'testimonials.quote3': '「模擬報告做得很扎實，圖表清楚到可以直接放進技術文件。」',
    'testimonials.footer3': '— 合作專案經理',

    'contact.title': '聊聊你的專案',
    'contact.desc': '不論是概念驗證、新創原型還是量產前置作業，都歡迎先告訴我們需求，我們會在 1–2 個工作天內回覆。',

    'form.websiteLabel': '網站',
    'form.nameLabel': '姓名',
    'form.namePlaceholder': '你的稱呼',
    'form.emailLabel': 'Email',
    'form.serviceLabel': '需求類型',
    'form.serviceOption.modeling': '3D 建模與工程圖',
    'form.serviceOption.automation': '機電整合與自動化',
    'form.serviceOption.simulation': '模擬分析與數據處理',
    'form.serviceOption.prototype': '3D 列印與原型製作',
    'form.serviceOption.other': '其他 / 尚未確定',
    'form.messageLabel': '專案內容',
    'form.messagePlaceholder': '簡單描述你的需求、時程與預算範圍',
    'form.submitButton': '送出需求',
    'form.note.invalid': '請確認姓名、Email 與專案內容都已填寫。',
    'form.note.sending': '送出中…',
    'form.note.success': '謝謝 {name}！我們已收到你的需求，會盡快透過 Email 與你聯繫。',
    'form.note.error': '送出失敗，請稍後再試，或直接寄信到 xiageemail@gmail.com。',

    'footer.brandDesc': '機械工程專業接案團隊<br/>讓專業的機構設計，也能被準時交付。',
    'footer.navHeading': '網站導覽',
    'footer.contactHeading': '聯絡方式',
    'footer.backToTop': '回到頂部',
  },

  en: {
    'meta.title': 'FS MEC STUDIO | Professional Mechanical Engineering Studio',
    'meta.description': 'FS MEC STUDIO is a professional studio focused on mechanical engineering, offering 3D modeling, mechatronics, simulation analysis, and prototyping services.',

    'nav.services': 'Services',
    'nav.work': 'Work',
    'nav.process': 'Process',
    'nav.team': 'Team',
    'nav.contact': 'Start a Project',
    'nav.toggleLabel': 'Open menu',

    'hero.eyebrow': 'Professional Mechanical Engineering Studio',
    'hero.title': 'From engineering blueprints<br />to something <span class="hero-title-accent">real and working</span>.',
    'hero.sub': 'We are a mechanical engineering team spanning mechanism design, control systems, and simulation analysis — offering end-to-end services from concept design and 3D modeling to prototyping.',
    'hero.ctaPrimary': 'Start a Project',
    'hero.ctaGhost': 'View Our Work',
    'hero.stat1': 'Projects Completed',
    'hero.stat2': 'Partner Organizations',
    'hero.stat3': 'Core Members',
    'hero.stat4': 'On-Time Delivery',
    'hero.scrollCue': 'Scroll down',

    'services.title': 'Four core disciplines,<br/>covering the full lifecycle of a mechanical project',
    'services.card1.title': '3D Modeling & Engineering Drawings',
    'services.card1.desc': 'Part design, assembly structures, and tolerance stacking using SolidWorks / Fusion 360, producing manufacturing-ready drawings and BOMs.',
    'services.card1.tag1': 'Part Design',
    'services.card1.tag2': 'Assembly Drawings',
    'services.card1.tag3': 'Engineering Drawings',
    'services.card2.title': 'Mechatronics & Automation',
    'services.card2.desc': 'Sensor and controller integration, PLC logic design, and development of small-scale automation devices and robotics — bridging mechanism and electrical control.',
    'services.card2.tag1': 'PLC Control',
    'services.card2.tag2': 'Sensor Integration',
    'services.card2.tag3': 'Automation Devices',
    'services.card3.title': 'Simulation & Data Analysis',
    'services.card3.desc': 'Structural and fluid simulation in MATLAB / ANSYS, experimental data processing and statistical analysis, delivered as clear, presentation-ready reports.',
    'services.card3.tag1': 'Structural Simulation',
    'services.card3.tag2': 'Data Analysis',
    'services.card3.tag3': 'Report Writing',
    'services.card4.title': '3D Printing & Prototyping',
    'services.card4.desc': 'Multiple printing processes from resin to PLA for rapid production of small parts and functional prototypes, helping validate designs and shorten development cycles.',
    'services.card4.tag1': 'Prototyping',
    'services.card4.tag2': 'Part Printing',
    'services.card4.tag3': 'Design Validation',

    'work.title': 'Recent Work',
    'work.card1.tag': 'Mechanism Design',
    'work.card1.title': 'Turbojet Engine Model',
    'work.card1.desc': 'A complete internal mechanism of a turbojet engine modeled in SolidWorks, with sectional views showing the multi-stage assembly of fan, compressor, and turbine blades — demonstrating advanced modeling and interference-checking capability for complex rotating assemblies.',
    'work.card1.imgAlt': 'Sectional rendering of a SolidWorks turbojet engine mechanism model',
    'work.card2.tag': 'Simulation Analysis',
    'work.card2.title': 'Drone Arm Structural Optimization',
    'work.card2.desc': 'Topology optimization and stress simulation in ANSYS reduced arm weight by 23% while maintaining original strength.',
    'work.card3.tag': 'Automation Integration',
    'work.card3.title': 'Desktop Line-Following Robot Kit',
    'work.card3.desc': 'A line-following robot kit designed for training purposes, including open-source firmware and course materials, licensed to 3 organizations.',
    'work.card4.tag': 'Prototyping',
    'work.card4.title': 'Prosthetic Hand Joint Prototype',
    'work.card4.desc': 'Developed with a biomedical engineering team, resin-printed through three generations of joint prototypes to validate grip strength and range of motion.',

    'process.title': 'Our Process',
    'process.step1.title': 'Consultation',
    'process.step1.desc': 'We learn about your project background, timeline, and budget through a form or community channels, then provide an initial feasibility assessment.',
    'process.step2.title': 'Quote & Planning',
    'process.step2.desc': 'We provide a quote and timeline based on project complexity, and sign a collaboration agreement once confirmed.',
    'process.step3.title': 'Design & Production',
    'process.step3.desc': 'We report progress and drafts at each stage, confirming direction with you at key milestones before proceeding.',
    'process.step4.title': 'Delivery & Support',
    'process.step4.desc': 'We provide complete files and documentation, with a period of free adjustments after delivery.',

    'team.title': 'Our Team',
    'team.desc': 'Website planning and layout design is currently led by 胡○淳.',
    'team.member1.role': 'Website Design / Project Lead',
    'team.member1.desc': 'Responsible for overall website planning and layout design.',

    'testimonials.title': 'What Our Partners Say',
    'testimonials.quote1': '"Efficient from modeling to delivery, with clear drawing annotations that saved us a lot of communication overhead."',
    'testimonials.footer1': '— R&D Manager, Partner Manufacturer',
    'testimonials.quote2': '"We were hesitant about working with an outside team at first, but they turned out to be more meticulous than our usual contractors, proactively flagging design risks."',
    'testimonials.footer2': '— Founder, Startup Company',
    'testimonials.quote3': '"The simulation reports were solid and clear enough to drop straight into our technical documentation."',
    'testimonials.footer3': '— Project Manager, Partner Company',

    'contact.title': "Let's Talk About Your Project",
    'contact.desc': "Whether it's a proof of concept, a startup prototype, or pre-production work, feel free to tell us your needs — we'll get back to you within 1–2 business days.",

    'form.websiteLabel': 'Website',
    'form.nameLabel': 'Name',
    'form.namePlaceholder': 'How should we address you?',
    'form.emailLabel': 'Email',
    'form.serviceLabel': 'Project Type',
    'form.serviceOption.modeling': '3D Modeling & Drawings',
    'form.serviceOption.automation': 'Mechatronics & Automation',
    'form.serviceOption.simulation': 'Simulation & Data Analysis',
    'form.serviceOption.prototype': '3D Printing & Prototyping',
    'form.serviceOption.other': 'Other / Not Sure Yet',
    'form.messageLabel': 'Project Details',
    'form.messagePlaceholder': 'Briefly describe your needs, timeline, and budget range',
    'form.submitButton': 'Submit Request',
    'form.note.invalid': 'Please make sure your name, email, and project details are filled in.',
    'form.note.sending': 'Sending…',
    'form.note.success': 'Thank you, {name}! We\'ve received your request and will reach out via email soon.',
    'form.note.error': 'Something went wrong. Please try again later, or email us directly at xiageemail@gmail.com.',

    'footer.brandDesc': 'Professional Mechanical Engineering Studio<br/>Making professional mechanism design deliverable, on time.',
    'footer.navHeading': 'Site Navigation',
    'footer.contactHeading': 'Contact',
    'footer.backToTop': 'Back to top',
  },
};

function t(key) {
  const lang = window.currentLang || 'zh';
  return (translations[lang] && translations[lang][key]) || (translations.zh[key] || key);
}

function applyLanguage(lang) {
  window.currentLang = lang;
  document.documentElement.lang = lang === 'en' ? 'en' : 'zh-Hant';

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const text = translations[lang][key];
    if (text !== undefined) el.innerHTML = text;
  });

  document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    el.getAttribute('data-i18n-attr').split('|').forEach((pair) => {
      const [attr, key] = pair.split(':');
      const text = translations[lang][key];
      if (text !== undefined) el.setAttribute(attr, text);
    });
  });

  const langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.textContent = lang === 'zh' ? 'EN' : '中文';
    langToggle.setAttribute('aria-label', lang === 'zh' ? 'Switch to English' : '切換為中文');
  }

  localStorage.setItem('site-lang', lang);
}

document.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('site-lang');
  applyLanguage(saved === 'en' ? 'en' : 'zh');

  const langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      applyLanguage(window.currentLang === 'en' ? 'zh' : 'en');
    });
  }
});
