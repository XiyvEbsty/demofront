// 职位数据库
export const jobData = [
  // IT互联网行业 - 产品/策划类
  {
    id: 1,
    title: '产品经理',
    industry: 'IT/互联网',
    tags: [
      { text: '产品', type: 'warning' },
      { text: '互联网', type: 'success' }
    ],
    salary: '初级 10-18k/月，3-5年经验 18-30k/月',
    description: '负责产品规划和需求分析',
    technicalRequirements: '需掌握Axure、墨刀等产品设计工具，了解SQL基础、数据埋点逻辑，熟悉至少一个行业（如电商、社交等）的业务流程。',
    skillRequirements: '具备需求分析、原型设计、跨部门沟通、项目推进能力，拥有用户思维和商业敏感度。',
    requirements: ['需求分析', '原型设计', '跨团队协作', '行业业务理解'],
    hollandTypes: ['E', 'S'], // 企业型和社会型
    anchorTypes: ['GM', 'AU'], // 管理型和自主/独立型
    matchScore: 0 // 将根据用户测评结果计算
  },
  {
    id: 2,
    title: '游戏策划',
    industry: 'IT/互联网',
    tags: [
      { text: '策划', type: 'warning' },
      { text: '游戏', type: 'success' }
    ],
    salary: '初级 8-15k/月，3-5年经验 15-25k/月',
    description: '负责游戏玩法、关卡、剧情设计',
    technicalRequirements: '熟悉游戏开发流程，掌握游戏数值体系设计，了解Unity等引擎基础，具备游戏策划文档撰写能力。',
    skillRequirements: '具备游戏系统设计、数值平衡、玩家心理分析、创意构思能力，有较强的团队协作和执行能力。',
    requirements: ['游戏系统设计', '关卡设计', '数值平衡', '剧情编写'],
    hollandTypes: ['E', 'A'], // 企业型和艺术型
    anchorTypes: ['GM', 'EC'], // 管理型和创造/创业型
    matchScore: 0
  },
  
  // IT互联网行业 - 运营/数据类
  {
    id: 3,
    title: '新媒体运营',
    industry: 'IT/互联网',
    tags: [
      { text: '运营', type: 'info' },
      { text: '新媒体', type: 'primary' }
    ],
    salary: '初级 7-12k/月，3-5年经验 12-20k/月',
    description: '负责公司社交媒体内容运营',
    technicalRequirements: '熟悉微信公众号、抖音、小红书等平台操作，掌握内容发布规则和推广技巧，了解图文设计基础（PS/Canva）。',
    skillRequirements: '具备内容策划、文案撰写、活动策划、粉丝互动能力，有良好的用户洞察和热点捕捉能力。',
    requirements: ['平台运营', '内容策划', '活动策划', '文案撰写'],
    hollandTypes: ['S', 'C'], // 社会型和传统型
    anchorTypes: ['SV', 'SE'], // 服务型和安全/稳定型
    matchScore: 0
  },
  {
    id: 4,
    title: '数据分析师',
    industry: 'IT/互联网',
    tags: [
      { text: '数据', type: 'primary' },
      { text: '分析', type: 'info' }
    ],
    salary: '初级 10-18k/月，3-5年经验 18-30k/月',
    description: '负责业务数据分析与洞察',
    technicalRequirements: '掌握SQL、Python/R等数据处理工具，熟悉数据可视化（如Tableau/PowerBI），了解基础统计分析方法。',
    skillRequirements: '具备数据提取、清洗、分析能力，能够发现数据背后的业务洞察，并提出优化建议。',
    requirements: ['SQL', 'Excel高级技巧', '数据可视化', '业务分析'],
    hollandTypes: ['I', 'C'], // 研究型和传统型
    anchorTypes: ['TF', 'CH'], // 技术/职能型和挑战型
    matchScore: 0
  },
  
  // IT互联网行业 - 开发/技术类
  {
    id: 5,
    title: '前端开发工程师',
    industry: 'IT/互联网',
    tags: [
      { text: '技术', type: 'primary' },
      { text: '开发', type: 'success' }
    ],
    salary: '初级 12-20k/月，3-5年经验 20-35k/月',
    description: '负责公司产品的前端开发工作',
    technicalRequirements: '熟练掌握HTML5、CSS3、JavaScript，熟悉Vue/React等主流框架，了解小程序开发、Node.js后端基础。',
    skillRequirements: '具备页面布局能力、动态交互实现能力、兼容性调试能力，有良好的代码规范和团队协作意识。',
    requirements: ['HTML5/CSS3', 'JavaScript', 'Vue/React', '前端工程化'],
    hollandTypes: ['R', 'I'], // 现实型和研究型
    anchorTypes: ['TF', 'CH'], // 技术/职能型和挑战型
    matchScore: 0
  },
  {
    id: 6,
    title: '后端开发工程师',
    industry: 'IT/互联网',
    tags: [
      { text: '技术', type: 'primary' },
      { text: '开发', type: 'success' }
    ],
    salary: '初级 15-25k/月，3-5年经验 25-40k/月',
    description: '负责系统服务端开发与维护',
    technicalRequirements: '熟练掌握Java/Go/Python等语言，熟悉Spring Boot/Django等框架，了解MySQL/MongoDB等数据库，掌握Linux基础。',
    skillRequirements: '具备系统设计、API开发、数据库优化、问题诊断能力，有良好的代码质量和架构意识。',
    requirements: ['Java/Go/Python', '后端框架', '数据库', '系统设计'],
    hollandTypes: ['R', 'I'], // 现实型和研究型
    anchorTypes: ['TF', 'CH'], // 技术/职能型和挑战型
    matchScore: 0
  },
  
  // 电子/通信/半导体行业
  {
    id: 7,
    title: '通信技术工程师',
    industry: '电子/通信/半导体',
    tags: [
      { text: '通信', type: 'info' },
      { text: '技术', type: 'primary' }
    ],
    salary: '初级 8-15k/月，3-5年经验 15-25k/月',
    description: '负责通信网络的建设与维护',
    technicalRequirements: '掌握5G/4G通信原理、基站建设与维护、传输网络规划，熟悉华为/中兴等厂商设备调试。',
    skillRequirements: '具备现场勘测、故障排查、设备调试能力，有较强的抗压能力和应急处理能力。',
    requirements: ['通信原理', '基站维护', '设备调试', '网络规划'],
    hollandTypes: ['R'], // 现实型
    anchorTypes: ['TF', 'SE'], // 技术/职能型和安全/稳定型
    matchScore: 0
  },
  {
    id: 8,
    title: '半导体/芯片工程师',
    industry: '电子/通信/半导体',
    tags: [
      { text: '芯片', type: 'danger' },
      { text: '技术', type: 'primary' }
    ],
    salary: '初级 15-25k/月，3-5年经验 25-40k/月',
    description: '负责芯片设计与开发',
    technicalRequirements: '了解半导体工艺、器件物理，掌握Verilog/VHDL等硬件描述语言，熟悉EDA工具（如Synopsys、Cadence）。',
    skillRequirements: '具备芯片设计、仿真验证、版图规划能力，有严谨的逻辑思维和问题分析能力。',
    requirements: ['半导体工艺', 'Verilog语言', 'EDA工具', '芯片设计'],
    hollandTypes: ['I'], // 研究型
    anchorTypes: ['TF', 'CH'], // 技术/职能型和挑战型
    matchScore: 0
  },
  {
    id: 9,
    title: '硬件工程师',
    industry: '电子/通信/半导体',
    tags: [
      { text: '硬件', type: 'danger' },
      { text: '技术', type: 'primary' }
    ],
    salary: '初级 10-18k/月，3-5年经验 18-30k/月',
    description: '负责电子硬件电路设计',
    technicalRequirements: '掌握电路设计软件（如Altium Designer），熟悉嵌入式系统（如STM32），了解电路原理和硬件测试方法。',
    skillRequirements: '具备电路设计、PCB布局、硬件调试、问题分析能力，有工程实践经验和团队协作精神。',
    requirements: ['电路设计', '嵌入式系统', '硬件测试', 'PCB设计'],
    hollandTypes: ['R', 'I'], // 现实型和研究型
    anchorTypes: ['TF'], // 技术/职能型
    matchScore: 0
  },
  
  // 职能支持类 - 人力/行政类
  {
    id: 10,
    title: '人力资源专员',
    industry: '职能支持',
    tags: [
      { text: '人力资源', type: 'warning' },
      { text: '管理', type: 'info' }
    ],
    salary: '初级 6-10k/月，3-5年经验 10-18k/月',
    description: '负责公司招聘、培训和人事管理',
    technicalRequirements: '熟悉HR系统（如eHR）操作，掌握薪酬计算、社保公积金办理流程，了解劳动法律法规。',
    skillRequirements: '具备招聘渠道拓展、面试评估、员工培训组织、沟通协调能力，有亲和力和责任心。',
    requirements: ['招聘流程', '薪酬计算', '员工关系', '劳动法规'],
    hollandTypes: ['S', 'C'], // 社会型和传统型
    anchorTypes: ['SE', 'SV'], // 安全/稳定型和服务型
    matchScore: 0
  },
  {
    id: 11,
    title: '行政专员',
    industry: '职能支持',
    tags: [
      { text: '行政', type: 'info' },
      { text: '管理', type: 'warning' }
    ],
    salary: '初级 5-8k/月，3-5年经验 8-15k/月',
    description: '负责公司日常行政事务管理',
    technicalRequirements: '掌握办公软件（如Word、Excel、PPT），熟悉固定资产管理、会议组织、接待流程。',
    skillRequirements: '具备文档处理、流程优化、应急事务处理能力，有细致耐心和良好的执行力。',
    requirements: ['会议组织', '文档管理', '接待服务', '行政事务'],
    hollandTypes: ['C', 'S'], // 传统型和社会型
    anchorTypes: ['SE'], // 安全/稳定型
    matchScore: 0
  },
  
  // 职能支持类 - 财会/金融类
  {
    id: 12,
    title: '财务会计',
    industry: '职能支持',
    tags: [
      { text: '财务', type: 'warning' },
      { text: '会计', type: 'info' }
    ],
    salary: '初级 6-10k/月，3-5年经验 10-18k/月',
    description: '负责公司财务核算和报表编制',
    technicalRequirements: '掌握会计准则、税务法规，熟练使用财务软件（如用友、金蝶），能进行账务处理、报表编制。',
    skillRequirements: '具备数据核算、财务分析、预算管理能力，有严谨的逻辑思维和高度的责任心。',
    requirements: ['会计准则', '财务软件', '报表编制', '税务知识'],
    hollandTypes: ['C'], // 传统型
    anchorTypes: ['SE'], // 安全/稳定型
    matchScore: 0
  },
  {
    id: 13,
    title: '金融分析师',
    industry: '职能支持',
    tags: [
      { text: '金融', type: 'danger' },
      { text: '分析', type: 'primary' }
    ],
    salary: '初级 12-20k/月，3-5年经验 20-35k/月',
    description: '负责金融市场分析和投资建议',
    technicalRequirements: '掌握金融市场分析方法、财务建模（如DCF、PEST分析），熟悉Python/R等数据分析工具，了解金融产品（如股票、债券、基金）。',
    skillRequirements: '具备数据收集与分析、报告撰写、行业研究能力，有敏锐的市场洞察力和逻辑思维。',
    requirements: ['金融分析', '财务建模', '数据分析', '市场研究'],
    hollandTypes: ['I', 'C'], // 研究型和传统型
    anchorTypes: ['TF', 'CH'], // 技术/职能型和挑战型
    matchScore: 0
  },
  
  // 职能支持类 - 法律/翻译/咨询类
  {
    id: 14,
    title: '法务专员',
    industry: '职能支持',
    tags: [
      { text: '法律', type: 'danger' },
      { text: '咨询', type: 'warning' }
    ],
    salary: '初级 8-12k/月，3-5年经验 12-22k/月',
    description: '负责公司法律事务和合同管理',
    technicalRequirements: '熟悉公司法、合同法等相关法律法规，能处理合同审核、法律风险评估、诉讼案件跟进等事务。',
    skillRequirements: '具备法律文书撰写、法律问题分析、沟通谈判能力，有较强的法律逻辑和严谨性。',
    requirements: ['法律法规', '合同审核', '法律文书', '风险评估'],
    hollandTypes: ['C', 'S'], // 传统型和社会型
    anchorTypes: ['TF', 'SE'], // 技术/职能型和安全/稳定型
    matchScore: 0
  },
  {
    id: 15,
    title: '英语翻译',
    industry: '职能支持',
    tags: [
      { text: '翻译', type: 'info' },
      { text: '语言', type: 'success' }
    ],
    salary: '笔译约0.1-0.3元/字，商务口译约1500-3000元/天',
    description: '负责文档翻译和商务口译',
    technicalRequirements: '具备扎实的英语语言功底（如CET-8、专八），熟悉特定领域（如商务、科技、法律）的专业词汇，能进行笔译、口译工作。',
    skillRequirements: '具备语言理解与表达、跨文化沟通、快速反应能力，有良好的记忆力和信息整合能力。',
    requirements: ['英语精通', '笔译', '口译', '专业词汇'],
    hollandTypes: ['C', 'S'], // 传统型和社会型
    anchorTypes: ['TF', 'AU'], // 技术/职能型和自主/独立型
    matchScore: 0
  },
  
  // 市场/销售/服务类
  {
    id: 16,
    title: '销售经理',
    industry: '市场/销售/服务',
    tags: [
      { text: '销售', type: 'danger' },
      { text: '管理', type: 'warning' }
    ],
    salary: '初级 8-15k/月（底薪）+ 提成，3-5年经验 15-30k/月（底薪）+ 提成',
    description: '负责销售团队管理和客户开发',
    technicalRequirements: '了解所在行业的产品知识、市场动态，掌握客户管理系统（如CRM）的使用，能制定销售策略和计划。',
    skillRequirements: '具备客户开发、谈判签约、团队管理、市场拓展能力，有较强的抗压能力和目标导向。',
    requirements: ['客户开发', '谈判技巧', '团队管理', 'CRM系统'],
    hollandTypes: ['E'], // 企业型
    anchorTypes: ['GM', 'CH'], // 管理型和挑战型
    matchScore: 0
  },
  {
    id: 17,
    title: '市场营销专员',
    industry: '市场/销售/服务',
    tags: [
      { text: '市场', type: 'success' },
      { text: '营销', type: 'warning' }
    ],
    salary: '初级 8-13k/月，3-5年经验 13-25k/月',
    description: '负责市场推广和品牌宣传',
    technicalRequirements: '掌握市场调研方法、数字营销工具（如Google Analytics、SEO/SEM），了解社交媒体运营、内容营销策略。',
    skillRequirements: '具备品牌推广、活动策划、数据分析、创意文案撰写能力，有敏锐的市场感知和创新思维。',
    requirements: ['数字营销', '市场调研', '活动策划', '创意文案'],
    hollandTypes: ['A', 'E'], // 艺术型和企业型
    anchorTypes: ['EC', 'CH'], // 创造/创业型和挑战型
    matchScore: 0
  },
  {
    id: 18,
    title: '客服专员',
    industry: '市场/销售/服务',
    tags: [
      { text: '客服', type: 'info' },
      { text: '服务', type: 'success' }
    ],
    salary: '初级 5-8k/月，3-5年经验 8-12k/月',
    description: '负责客户咨询和售后服务',
    technicalRequirements: '熟悉客服系统操作，了解产品或服务的详细信息，能快速处理客户咨询、投诉、售后等问题。',
    skillRequirements: '具备良好的沟通表达、情绪管理、问题解决能力，有耐心和服务意识。',
    requirements: ['客服系统', '沟通技巧', '问题解决', '情绪管理'],
    hollandTypes: ['S'], // 社会型
    anchorTypes: ['SV', 'SE'], // 服务型和安全/稳定型
    matchScore: 0
  },
  
  // 创意/传媒行业
  {
    id: 19,
    title: 'UI/视觉设计师',
    industry: '创意/传媒',
    tags: [
      { text: '设计', type: 'primary' },
      { text: 'UI', type: 'success' }
    ],
    salary: '初级 10-18k/月，3-5年经验 18-30k/月',
    description: '负责用户界面和视觉设计',
    technicalRequirements: '熟练使用Sketch、Figma等设计工具，掌握用户体验设计（UX）、交互逻辑、动效设计，了解前端开发基础知识。',
    skillRequirements: '具备用户研究、界面设计、原型制作、沟通协作能力，有审美能力和用户思维。',
    requirements: ['Sketch/Figma', 'UI设计', '交互设计', '用户体验'],
    hollandTypes: ['A'], // 艺术型
    anchorTypes: ['EC', 'AU'], // 创造/创业型和自主/独立型
    matchScore: 0
  },
  {
    id: 20,
    title: '影视编导',
    industry: '创意/传媒',
    tags: [
      { text: '影视', type: 'danger' },
      { text: '创作', type: 'success' }
    ],
    salary: '初级单项目约5000-15000元，3-5年经验单项目约15000-30000元及以上',
    description: '负责影视内容策划和导演工作',
    technicalRequirements: '掌握剧本写作、分镜头设计、拍摄流程，熟悉拍摄设备（如摄像机、三脚架）和剪辑软件（如Premiere、Final Cut Pro）。',
    skillRequirements: '具备故事构思、导演调度、团队协作、后期制作能力，有艺术感悟力和创新思维。',
    requirements: ['剧本创作', '分镜设计', '拍摄剪辑', '团队协作'],
    hollandTypes: ['A', 'S'], // 艺术型和社会型
    anchorTypes: ['EC', 'AU'], // 创造/创业型和自主/独立型
    matchScore: 0
  },
  
  // 工程/制造行业
  {
    id: 21,
    title: '建筑设计师',
    industry: '工程/制造',
    tags: [
      { text: '建筑', type: 'primary' },
      { text: '设计', type: 'success' }
    ],
    salary: '初级 8-15k/月，3-5年经验 15-30k/月',
    description: '负责建筑方案和施工图设计',
    technicalRequirements: '掌握CAD、Revit等设计软件，熟悉建筑规范和标准，了解结构、设备等专业知识，能进行施工图深化设计。',
    skillRequirements: '具备空间规划、方案创作、图纸绘制、多专业协调能力，有审美能力和工程实践意识。',
    requirements: ['CAD/Revit', '建筑规范', '施工图设计', '方案设计'],
    hollandTypes: ['R', 'A'], // 现实型和艺术型
    anchorTypes: ['TF', 'SE'], // 技术/职能型和安全/稳定型
    matchScore: 0
  },
  {
    id: 22,
    title: '机械工程师',
    industry: '工程/制造',
    tags: [
      { text: '机械', type: 'warning' },
      { text: '工程', type: 'primary' }
    ],
    salary: '初级 7-12k/月，3-5年经验 12-22k/月',
    description: '负责机械产品设计与研发',
    technicalRequirements: '掌握CAD/CAE等设计软件，熟悉机械原理和零部件设计，了解材料力学和工艺流程，具备产品开发经验。',
    skillRequirements: '具备机械结构设计、工程分析、问题诊断、团队协作能力，有较强的工程实践和创新能力。',
    requirements: ['机械设计', '产品研发', '工艺流程', '质量控制'],
    hollandTypes: ['R', 'I'], // 现实型和研究型
    anchorTypes: ['TF', 'SE'], // 技术/职能型和安全/稳定型
    matchScore: 0
  },
  
  // 医疗/教育/生活服务类
  {
    id: 23,
    title: '医药研发工程师',
    industry: '医疗/教育/生活服务',
    tags: [
      { text: '医药', type: 'danger' },
      { text: '研发', type: 'primary' }
    ],
    salary: '初级 10-18k/月，3-5年经验 18-35k/月',
    description: '负责药品研发与实验',
    technicalRequirements: '掌握有机化学、药理学等专业知识，熟悉药物合成、分析测试方法，了解药品注册法规，能进行实验设计与数据分析。',
    skillRequirements: '具备实验操作、数据分析、报告撰写、项目管理能力，有严谨的科学态度和创新思维。',
    requirements: ['药物合成', '实验设计', '数据分析', '法规注册'],
    hollandTypes: ['I', 'R'], // 研究型和现实型
    anchorTypes: ['TF', 'SV'], // 技术/职能型和服务型
    matchScore: 0
  },
  {
    id: 24,
    title: '教师/讲师',
    industry: '医疗/教育/生活服务',
    tags: [
      { text: '教育', type: 'success' },
      { text: '教学', type: 'warning' }
    ],
    salary: '公立学校8-15k/月，培训机构底薪+课时费',
    description: '负责教学和课程开发',
    technicalRequirements: '掌握教育教学方法，熟悉学科专业知识，了解教学设计和评估方法，能运用多媒体等现代教学工具。',
    skillRequirements: '具备课程设计、知识传授、学生管理、家长沟通能力，有较强的亲和力和责任心。',
    requirements: ['教学方法', '课程开发', '学生管理', '教学评估'],
    hollandTypes: ['S'], // 社会型
    anchorTypes: ['SV', 'SE'], // 服务型和安全/稳定型
    matchScore: 0
  },
  
  // 物流/贸易类
  {
    id: 25,
    title: '物流管理师',
    industry: '物流/贸易',
    tags: [
      { text: '物流', type: 'info' },
      { text: '管理', type: 'warning' }
    ],
    salary: '初级 6-10k/月，3-5年经验 10-18k/月',
    description: '负责物流运输和仓储管理',
    technicalRequirements: '掌握物流管理系统（TMS/WMS），熟悉供应链流程，了解运输方式和成本核算，能进行物流方案优化。',
    skillRequirements: '具备仓储管理、运输调度、供应商管理、流程优化能力，有较强的组织协调和问题解决能力。',
    requirements: ['物流系统', '仓储管理', '运输调度', '成本控制'],
    hollandTypes: ['C', 'E'], // 传统型和企业型
    anchorTypes: ['SE', 'TF'], // 安全/稳定型和技术/职能型
    matchScore: 0
  },
  
  // 能源/环保/农业类
  {
    id: 26,
    title: '环保工程师',
    industry: '能源/环保/农业',
    tags: [
      { text: '环保', type: 'success' },
      { text: '工程', type: 'primary' }
    ],
    salary: '初级 8-15k/月，3-5年经验 15-25k/月',
    description: '负责环境保护与污染治理',
    technicalRequirements: '掌握环境工程原理，熟悉水、气、固废处理技术，了解环保法规标准，能进行环境影响评价和治理方案设计。',
    skillRequirements: '具备工程设计、项目管理、技术分析、报告撰写能力，有环保意识和社会责任感。',
    requirements: ['污染治理', '环境评价', '项目管理', '法规标准'],
    hollandTypes: ['I', 'R'], // 研究型和现实型
    anchorTypes: ['TF', 'SV'], // 技术/职能型和服务型
    matchScore: 0
  },
  
  // 项目管理类
  {
    id: 27,
    title: '项目经理',
    industry: '项目管理',
    tags: [
      { text: '项目', type: 'warning' },
      { text: '管理', type: 'info' }
    ],
    salary: '初级 12-20k/月，3-5年经验 20-35k/月',
    description: '负责项目全周期管理',
    technicalRequirements: '掌握项目管理方法论（如PMP、敏捷），熟悉项目管理工具（如MS Project、Jira），了解所在行业业务流程，能进行项目计划与跟踪。',
    skillRequirements: '具备团队领导、资源协调、风险管理、沟通协作能力，有较强的目标导向和问题解决能力。',
    requirements: ['项目规划', '资源协调', '风险控制', '团队管理'],
    hollandTypes: ['E'], // 企业型
    anchorTypes: ['GM', 'CH'], // 管理型和挑战型
    matchScore: 0
  }
]

// 霍兰德类型权重 - 用于计算匹配度
export const hollandTypeWeights = {
  R: 0.167, // 现实型
  I: 0.167, // 研究型
  A: 0.167, // 艺术型
  S: 0.167, // 社会型
  E: 0.166, // 企业型
  C: 0.166  // 常规型
}

// 职业锚点类型权重 - 用于计算匹配度
export const anchorTypeWeights = {
  TF: 0.15, // 技术/职能型
  GM: 0.15, // 管理型
  AU: 0.15, // 自主/独立型
  SE: 0.15, // 安全/稳定型
  EC: 0.1,  // 创造/创业型
  SV: 0.1,  // 服务型
  CH: 0.1,  // 挑战型
  LS: 0.1   // 生活型
}

// 计算职位匹配度的函数
export const calculateJobMatch = (hollandScores, anchorScores) => {
  // 如果没有测评结果则返回空数组
  if (!hollandScores || !anchorScores) {
    return []
  }
  
  // 复制一份职位数据
  const jobsWithScore = JSON.parse(JSON.stringify(jobData))
  
  // 计算每个职位的匹配度
  jobsWithScore.forEach(job => {
    let hollandMatchScore = 0
    let anchorMatchScore = 0
    
    // 计算霍兰德类型匹配度
    job.hollandTypes.forEach(type => {
      hollandMatchScore += (hollandScores[type] || 0) * hollandTypeWeights[type]
    })
    
    // 计算职业锚点类型匹配度
    job.anchorTypes.forEach(type => {
      anchorMatchScore += (anchorScores[type] || 0) * anchorTypeWeights[type]
    })
    
    // 规范化匹配分数，确保不超过1.0
    hollandMatchScore = Math.min(hollandMatchScore, 1.0)
    anchorMatchScore = Math.min(anchorMatchScore, 1.0)
    
    // 综合匹配度 (50% 霍兰德 + 50% 职业锚点)
    job.matchScore = (hollandMatchScore * 0.5 + anchorMatchScore * 0.5) * 100
  })
  
  // 按匹配度从高到低排序
  return jobsWithScore.sort((a, b) => b.matchScore - a.matchScore)
} 