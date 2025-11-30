
import { EduData, LevelId, GameState } from './types';

// 使用穩定的維基百科/公共領域復古科學繪圖，解決載入速度問題並統一風格
export const ASSETS = {
  // 更換為 Haeckel 的 Actiniae (海葵)，風格神祕且連結穩定
  login_bg: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Haeckel_Actiniae.jpg/640px-Haeckel_Actiniae.jpg", 
  prologue: {
    // 咬人貓 (Urtica dioica) 1885年植物誌
    nettle_micro: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Urtica_dioica_F._von_Mueller.jpg/640px-Urtica_dioica_F._von_Mueller.jpg",
    // 咬人狗 (Dendrocnide) 類似物種手繪
    dog_micro: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Illustration_Dendrocnide_moroides0.jpg/640px-Illustration_Dendrocnide_moroides0.jpg",
    // 姑婆芋 (Alocasia)
    alocasia: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Alocasia_macrorrhizos_%28Schott%29_G._Don_%288094263725%29.jpg/640px-Alocasia_macrorrhizos_%28Schott%29_G._Don_%288094263725%29.jpg",
  },
  taxonomy: {
    // 秋海棠
    begonia: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Begonia_grandis_botanical_drawing.jpg/480px-Begonia_grandis_botanical_drawing.jpg",
    // 冷清草 (Pellionia)
    pellionia: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Pellionia_daveauana_Hook.f.jpg/480px-Pellionia_daveauana_Hook.f.jpg",
    // 九芎 (Lagerstroemia)
    crape: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Lagerstroemia_indica_Blanco1.229-cropped.jpg/480px-Lagerstroemia_indica_Blanco1.229-cropped.jpg",
    // 魚藤 (Derris)
    derris: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Derris_elliptica_-_Köhler–s_Medizinal-Pflanzen-052.jpg/480px-Derris_elliptica_-_Köhler–s_Medizinal-Pflanzen-052.jpg",
    // 五節芒 (Miscanthus)
    silvergrass: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Miscanthus_sinensis_-_Köhler–s_Medizinal-Pflanzen-223.jpg/480px-Miscanthus_sinensis_-_Köhler–s_Medizinal-Pflanzen-223.jpg",
    // 桂竹 (Bamboo)
    bamboo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Bambusa_vulgaris_-_Köhler–s_Medizinal-Pflanzen-017.jpg/480px-Bambusa_vulgaris_-_Köhler–s_Medizinal-Pflanzen-017.jpg",
    // 穀倉結構圖
    granary_bg: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Rice_granary_of_the_Ifugao_people.jpg/640px-Rice_granary_of_the_Ifugao_people.jpg",
  },
  trap: {
    // 森林背景 (Ernst Haeckel 蕨類植物)
    bg: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Haeckel_Filicinae_4.jpg/640px-Haeckel_Filicinae_4.jpg",
    // 野豬 (Sus scrofa)
    boar: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Sus_scrofa_scrofa.jpg/640px-Sus_scrofa_scrofa.jpg",
  },
  pharmacy: {
    // 研磨缽
    mortar: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mortar_and_pestle_03.jpg/640px-Mortar_and_pestle_03.jpg",
  },
  dye: {
    // 銅鍋/陶鍋
    pot: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Bronze_Cauldron.jpg/640px-Bronze_Cauldron.jpg",
    // 薯榔 (Dioscorea)
    shulang: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Dioscorea_alata_Blanco1.272.png/480px-Dioscorea_alata_Blanco1.272.png",
    // 薑黃
    turmeric: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Curcuma_longa_-_Köhler–s_Medizinal-Pflanzen-050.jpg/480px-Curcuma_longa_-_Köhler–s_Medizinal-Pflanzen-050.jpg",
  },
  river: {
    // 河邊洗衣古圖
    washing: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/The_Washing_Place_at_Greze_MET_DP123849.jpg/800px-The_Washing_Place_at_Greze_MET_DP123849.jpg",
  },
  final: {
    // 火炬手
    torch: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Torch_bearer_MET_176274.jpg/640px-Torch_bearer_MET_176274.jpg",
  }
};

export const EDU_DATA: Record<LevelId, EduData> = {
  prologue: {
    title: "《波送弗依：毒林中的鍊金術師》",
    text: "本關卡還原了原住民的野外急救智慧。咬人貓 (Nettle) 的刺毛含有甲酸 (Formic Acid)，會造成持續刺痛；而姑婆芋 (Alocasia) 的汁液含有生物鹼，雖然本身有毒，但適量塗抹可酸鹼中和。<br><br>這展示了科學探究的起點往往來自於對生活經驗的驗證：<b>「以毒攻毒」</b>並非迷信，而是早期的化學實踐。"
  },
  taxonomy: {
    title: "《初始台地：獵人的科學視野》",
    text: "恭喜完成初始台地的試煉！<br><br>1. <b>植物分類</b>：原住民的分類學基於「功能」與「棲地」，對應生態區位。<br>2. <b>穀倉結構</b>：防鼠板利用靜摩擦力與斜面原理，是精密的力學設計。<br>3. <b>研究提問</b>：好的科學始於對傳統智慧的好奇。將「阿嬤說的話」轉化為「可驗證的變因」，就是科展的第一步。"
  },
  trap: {
    title: "《MKBB_2.0_Rangay-致命的衝擊力》",
    text: "本關卡源自泰雅族重壓陷阱研究。獵人懂得調整<b>「石頭重量 (m)」</b>與<b>「架設高度 (h)」</b>來控制衝擊力。<br><br>這完美體現了物理學中<b>重力位能轉動能 (Ug = mgh)</b> 的應用。同時，<b>繩索材料</b>的選擇（如黃藤的強韌vs月桃/香蕉的脆斷）也是關鍵變因。學生透過實驗數據，找出了能壓制獵物卻不至於破壞陷阱結構的最佳參數。"
  },
  pharmacy: {
    title: "《布農族石菖蒲運用探討》",
    text: "耆老堅持「用酒」處理石菖蒲，在化學上即是利用<b>「有機溶劑萃取」</b>原理。石菖蒲中的有效成分（如 α-细辛醚）是脂溶性的，難溶於水。<br><br>科展學生透過<b>「抑菌圈實驗」</b>證實：酒精萃取液的抗菌效果遠優於水煮液，科學地驗證了祖先的智慧。"
  },
  granary: {
    title: "《穀倉科學，建築泰雅》",
    text: "防鼠板 (Tku) 的設計是物理學<b>「靜摩擦力與斜面」</b>的經典應用。角度過小，摩擦力大，老鼠易爬；角度過大（陡峭），正向力減小，老鼠會滑落。<br><br>學生製作模型模擬老鼠攀爬，計算出<b>「臨界角度」</b>，證明了傳統建築構件背後精密的力學考量。"
  },
  dye: {
    title: "《祖靈之息：大地色彩鍊金術》",
    text: "本關卡揭示了傳統染色背後的化學與物理機制：<br><br>1. <b>化學反應 (媒染)</b>：排灣族利用「黑泥」中的<b>鐵離子 (Fe)</b> 與薯榔的<b>單寧酸</b>結合，產生黑色錯合物。而草木灰 (鹼性) 則能去除木質素，幫助色素附著。<br>2. <b>物理性質 (強化)</b>：實驗證實，經過「草木灰漂白 + 薯榔染色」的苧麻線，其<b>承重力</b>與<b>耐磨度</b>顯著提升。染色不只是為了美觀，更是為了製作堅固的獵具與工具。"
  },
  river: {
    title: "《walo’科研社》&《Klapay》",
    text: "清潔力不等於泡沫多寡。本關卡展示了科展中最重要的精神：<b>「定義變因」</b>。學生利用影像軟體分析洗滌後的<b>「油漬殘留面積」</b>，或是測量水溶液的<b>「表面張力」</b>。<br><br>這將主觀的「洗得很乾淨」轉化為客觀的<b>「量化數據」</b>，是科學探究的基礎。"
  },
  final: {
    title: "《傳承之火》",
    text: "科學不是用來否定傳統，而是翻譯傳統。當我們能用科學語言解釋祖先的智慧，文化就有了新的生命力。<br><br>恭喜你，引路人。你已經掌握了「變因」，現在去點燃更多孩子心中的火種吧。"
  }
};

export const INITIAL_GAME_STATE: GameState = {
  prologue: false,
  taxonomy: false,
  trap: false,
  pharmacy: false,
  granary: false,
  dye: false,
  river: false,
  final: false,
};