'use strict';

// ==========================================
// 冷蔵庫☆因数分解 — App Logic
// ==========================================

// === CONSTANTS ===
const STORAGE_KEYS = {
  INGREDIENTS: 'fridge_ingredients',
  SHOPPING: 'fridge_shopping',
  CUSTOM_RECIPES: 'fridge_custom_recipes',
};

const INGREDIENT_CATEGORIES = ['野菜', '肉・魚', '卵・乳製品', '調味料', '乾物・缶詰', 'その他'];
const RECIPE_CATEGORIES = ['和食', '洋食', '中華', '丼・麺', '副菜・その他'];
const UNITS = ['個', 'g', 'kg', 'ml', 'L', '本', '枚', '袋', '缶', 'パック', '束', '大さじ', '小さじ', '少々', '適量'];

const CATEGORY_EMOJIS = {
  '野菜': '🥦', '肉・魚': '🥩', '卵・乳製品': '🥚',
  '調味料': '🧂', '乾物・缶詰': '🥫', 'その他': '🍱',
  '和食': '🍱', '洋食': '🍝', '中華': '🥢', '丼・麺': '🍜', '副菜・その他': '🥗',
};

// === BUILT-IN RECIPES ===
const BUILT_IN_RECIPES = [
  // --- 和食 ---
  {
    id: 'r001', name: '肉じゃが', category: '和食', emoji: '🥔',
    description: '甘辛く煮た定番の家庭料理。ほっこり温まります。',
    requiredIngredients: [
      { name: '牛肉', quantity: 200, unit: 'g', optional: false },
      { name: 'じゃがいも', quantity: 3, unit: '個', optional: false },
      { name: '玉ねぎ', quantity: 1, unit: '個', optional: false },
      { name: 'にんじん', quantity: 1, unit: '本', optional: false },
      { name: '醤油', quantity: 3, unit: '大さじ', optional: false },
      { name: 'みりん', quantity: 3, unit: '大さじ', optional: false },
      { name: '砂糖', quantity: 1, unit: '大さじ', optional: false },
    ],
    steps: [
      '牛肉は食べやすい大きさに切る',
      'じゃがいも・玉ねぎ・にんじんを一口大に切る',
      '鍋に油を熱し、牛肉を炒める',
      '野菜を加えて炒め、だし300mlを加える',
      '醤油・みりん・砂糖を加えて中火で15分煮込む',
      '野菜が柔らかくなったら完成！',
    ],
    isCustom: false,
  },
  {
    id: 'r002', name: '味噌汁', category: '和食', emoji: '🍜',
    description: '毎日飲みたい定番のおみそ汁。具はお好みで。',
    requiredIngredients: [
      { name: '豆腐', quantity: 1, unit: '個', optional: false },
      { name: '味噌', quantity: 2, unit: '大さじ', optional: false },
      { name: 'わかめ', quantity: 1, unit: '少々', optional: true },
      { name: 'ネギ', quantity: 1, unit: '本', optional: true },
    ],
    steps: [
      '鍋にだし400mlを沸かす',
      '豆腐をさいの目に切って加える',
      'わかめを加えて一煮立ち',
      '火を止めて味噌を溶き入れる',
      'ネギを散らして完成！',
    ],
    isCustom: false,
  },
  {
    id: 'r003', name: '親子丼', category: '丼・麺', emoji: '🍳',
    description: '鶏肉と卵の黄金コンビ！ご飯が進む一品。',
    requiredIngredients: [
      { name: '鶏肉', quantity: 200, unit: 'g', optional: false },
      { name: '卵', quantity: 2, unit: '個', optional: false },
      { name: '玉ねぎ', quantity: 1, unit: '個', optional: false },
      { name: '醤油', quantity: 2, unit: '大さじ', optional: false },
      { name: 'みりん', quantity: 2, unit: '大さじ', optional: false },
      { name: 'ご飯', quantity: 2, unit: '個', optional: false },
    ],
    steps: [
      '鶏肉は一口大に切り、玉ねぎは薄切りにする',
      'フライパンにだし150ml・醤油・みりんを合わせて煮立てる',
      '玉ねぎを加えて中火で炒め、鶏肉を加えて火を通す',
      '溶き卵を回し入れて半熟になったら火を止める',
      'ご飯の上に盛り付けて完成！',
    ],
    isCustom: false,
  },
  {
    id: 'r004', name: '豚汁', category: '和食', emoji: '🍲',
    description: '根菜たっぷりのボリューム満点な豚汁。',
    requiredIngredients: [
      { name: '豚肉', quantity: 150, unit: 'g', optional: false },
      { name: 'じゃがいも', quantity: 2, unit: '個', optional: false },
      { name: 'にんじん', quantity: 1, unit: '本', optional: false },
      { name: '大根', quantity: 1, unit: '本', optional: true },
      { name: '味噌', quantity: 3, unit: '大さじ', optional: false },
      { name: 'ごま油', quantity: 1, unit: '大さじ', optional: true },
    ],
    steps: [
      '豚肉・野菜を食べやすい大きさに切る',
      '鍋にごま油を熱して豚肉を炒める',
      '野菜を加えて炒め、だし600mlを加える',
      '野菜が柔らかくなったら味噌を溶き入れる',
      '器に盛って完成！',
    ],
    isCustom: false,
  },
  {
    id: 'r005', name: 'だし巻き卵', category: '和食', emoji: '🍳',
    description: 'ふわふわ甘めの定番和風卵料理。',
    requiredIngredients: [
      { name: '卵', quantity: 3, unit: '個', optional: false },
      { name: '醤油', quantity: 1, unit: '小さじ', optional: false },
      { name: 'みりん', quantity: 1, unit: '大さじ', optional: false },
    ],
    steps: [
      '卵を溶きほぐし、だし50ml・醤油・みりんを混ぜる',
      '卵焼き器に油を熱し、卵液を1/3ずつ流し込む',
      '半熟のうちに手前に巻き、奥に押し寄せる',
      '残りの卵液を加えながら3回繰り返す',
      '食べやすく切って完成！',
    ],
    isCustom: false,
  },
  {
    id: 'r006', name: '鮭のムニエル', category: '和食', emoji: '🐟',
    description: 'バターの香りが食欲をそそるシンプルな魚料理。',
    requiredIngredients: [
      { name: '鮭', quantity: 2, unit: '枚', optional: false },
      { name: 'バター', quantity: 20, unit: 'g', optional: false },
      { name: '塩', quantity: 1, unit: '少々', optional: false },
      { name: 'こしょう', quantity: 1, unit: '少々', optional: false },
      { name: '薄力粉', quantity: 2, unit: '大さじ', optional: false },
    ],
    steps: [
      '鮭に塩・こしょうを振り、薄力粉をまぶす',
      'フライパンにバターを溶かし、鮭を中火で3分焼く',
      'ひっくり返してさらに3分焼く',
      'レモンを搾って完成！',
    ],
    isCustom: false,
  },
  {
    id: 'r007', name: '冷奴', category: '副菜・その他', emoji: '🫛',
    description: '5分でできる！夏の定番ヘルシー副菜。',
    requiredIngredients: [
      { name: '豆腐', quantity: 1, unit: '個', optional: false },
      { name: '醤油', quantity: 1, unit: '大さじ', optional: false },
      { name: 'ネギ', quantity: 1, unit: '本', optional: true },
      { name: 'しょうが', quantity: 1, unit: '少々', optional: true },
    ],
    steps: [
      '豆腐をよく冷やす',
      '食べやすい大きさに切って器に盛る',
      'ネギ・しょうがをのせて醤油をかけて完成！',
    ],
    isCustom: false,
  },
  {
    id: 'r008', name: 'ほうれん草のおひたし', category: '副菜・その他', emoji: '🥬',
    description: 'サッと茹でてシンプルに。栄養満点な定番副菜。',
    requiredIngredients: [
      { name: 'ほうれん草', quantity: 1, unit: '束', optional: false },
      { name: '醤油', quantity: 2, unit: '大さじ', optional: false },
    ],
    steps: [
      'ほうれん草を沸騰したお湯で30秒茹でる',
      '冷水に取り水気を絞る',
      '醤油をかけて食べやすく切って完成！',
    ],
    isCustom: false,
  },
  {
    id: 'r009', name: 'きんぴらごぼう', category: '副菜・その他', emoji: '🥕',
    description: '甘辛くてご飯によく合う定番の日本料理。',
    requiredIngredients: [
      { name: 'ごぼう', quantity: 1, unit: '本', optional: false },
      { name: 'にんじん', quantity: 1, unit: '本', optional: false },
      { name: '醤油', quantity: 2, unit: '大さじ', optional: false },
      { name: 'みりん', quantity: 2, unit: '大さじ', optional: false },
      { name: '砂糖', quantity: 1, unit: '大さじ', optional: false },
      { name: 'ごま油', quantity: 1, unit: '大さじ', optional: false },
    ],
    steps: [
      'ごぼうとにんじんを細切りにする',
      '鍋に油を熱してごぼうとにんじんを炒める',
      '醤油・みりん・砂糖を加えて絡める',
      '水分が飛んだらごまを振って完成！',
    ],
    isCustom: false,
  },
  {
    id: 'r010', name: 'ひじき煮', category: '副菜・その他', emoji: '🌿',
    description: '鉄分豊富なひじきの定番煮物。作り置きにも最適。',
    requiredIngredients: [
      { name: 'ひじき', quantity: 20, unit: 'g', optional: false },
      { name: 'にんじん', quantity: 1, unit: '本', optional: false },
      { name: '油揚げ', quantity: 1, unit: '枚', optional: false },
      { name: '醤油', quantity: 2, unit: '大さじ', optional: false },
      { name: 'みりん', quantity: 2, unit: '大さじ', optional: false },
      { name: '砂糖', quantity: 1, unit: '大さじ', optional: false },
    ],
    steps: [
      'ひじきを水で戻す（20分）',
      '油揚げとにんじんを細切りにする',
      '鍋に油を熱してひじきとにんじんを炒める',
      '油揚げ・醤油・みりん・砂糖・だし100mlを加えて煮詰める',
      '水分がなくなったら完成！',
    ],
    isCustom: false,
  },
  // --- 洋食 ---
  {
    id: 'r011', name: 'オムライス', category: '洋食', emoji: '🍳',
    description: 'ふんわり卵をのせたケチャップライス。子どもから大人まで大好き！',
    requiredIngredients: [
      { name: '卵', quantity: 2, unit: '個', optional: false },
      { name: 'ご飯', quantity: 1, unit: '個', optional: false },
      { name: '鶏肉', quantity: 100, unit: 'g', optional: false },
      { name: '玉ねぎ', quantity: 1, unit: '個', optional: false },
      { name: 'バター', quantity: 10, unit: 'g', optional: false },
      { name: 'ケチャップ', quantity: 3, unit: '大さじ', optional: false },
    ],
    steps: [
      '鶏肉と玉ねぎを小さく切る',
      'バターで炒め、ご飯を加えてケチャップで味付け',
      '別のフライパンで溶き卵を薄く焼く',
      'ケチャップライスを包んで完成！',
    ],
    isCustom: false,
  },
  {
    id: 'r012', name: 'カルボナーラ', category: '洋食', emoji: '🍝',
    description: 'クリーミーで濃厚！本格イタリアンパスタ。',
    requiredIngredients: [
      { name: 'パスタ', quantity: 200, unit: 'g', optional: false },
      { name: 'ベーコン', quantity: 100, unit: 'g', optional: false },
      { name: '卵', quantity: 2, unit: '個', optional: false },
      { name: '生クリーム', quantity: 100, unit: 'ml', optional: false },
      { name: '塩', quantity: 1, unit: '少々', optional: false },
      { name: 'こしょう', quantity: 1, unit: '少々', optional: false },
    ],
    steps: [
      'パスタを茹でる（表示時間通り）',
      'ベーコンを炒める',
      '卵・生クリーム・チーズ・こしょうを混ぜる',
      '湯切りしたパスタにベーコンと卵液を絡める',
      '余熱で混ぜながら火を通して完成！',
    ],
    isCustom: false,
  },
  {
    id: 'r013', name: 'トマトスープ', category: '洋食', emoji: '🍅',
    description: 'トマトの旨味たっぷりのシンプルなスープ。',
    requiredIngredients: [
      { name: 'トマト', quantity: 2, unit: '個', optional: false },
      { name: '玉ねぎ', quantity: 1, unit: '個', optional: false },
      { name: 'コンソメ', quantity: 1, unit: '個', optional: false },
      { name: 'オリーブオイル', quantity: 1, unit: '大さじ', optional: false },
      { name: '塩', quantity: 1, unit: '少々', optional: false },
    ],
    steps: [
      '玉ねぎを薄切りにしてオリーブオイルで炒める',
      'トマトを切って加え、水400mlとコンソメを入れる',
      '10分煮込んで塩で味を整えて完成！',
    ],
    isCustom: false,
  },
  {
    id: 'r014', name: 'ポテトサラダ', category: '洋食', emoji: '🥔',
    description: 'みんな大好き！作り置きにも最適な定番サラダ。',
    requiredIngredients: [
      { name: 'じゃがいも', quantity: 3, unit: '個', optional: false },
      { name: 'にんじん', quantity: 1, unit: '本', optional: true },
      { name: '玉ねぎ', quantity: 1, unit: '個', optional: false },
      { name: 'きゅうり', quantity: 1, unit: '本', optional: false },
      { name: 'マヨネーズ', quantity: 3, unit: '大さじ', optional: false },
      { name: '塩', quantity: 1, unit: '少々', optional: false },
    ],
    steps: [
      'じゃがいもを茹でて潰す',
      'にんじんを茹でて薄切りにする',
      '玉ねぎ・きゅうりを薄切りにして塩もみ',
      'マヨネーズ・塩・こしょうで和えて完成！',
    ],
    isCustom: false,
  },
  {
    id: 'r015', name: 'チキンソテー', category: '洋食', emoji: '🍗',
    description: 'カリッとジューシーな鶏肉ソテー！',
    requiredIngredients: [
      { name: '鶏肉', quantity: 2, unit: '枚', optional: false },
      { name: '塩', quantity: 1, unit: '少々', optional: false },
      { name: 'こしょう', quantity: 1, unit: '少々', optional: false },
      { name: 'にんにく', quantity: 2, unit: '個', optional: false },
      { name: 'バター', quantity: 15, unit: 'g', optional: false },
      { name: '醤油', quantity: 1, unit: '大さじ', optional: false },
    ],
    steps: [
      '鶏肉は厚い部分に切れ目を入れ、塩・こしょうで下味をつける',
      'フライパンにバターとにんにくを熱する',
      '皮目から中火で5分、裏返して4分焼く',
      '醤油を加えて絡めて完成！',
    ],
    isCustom: false,
  },
  // --- 中華 ---
  {
    id: 'r016', name: 'チャーハン', category: '中華', emoji: '🍚',
    description: 'パラパラで本格的！シンプルな定番チャーハン。',
    requiredIngredients: [
      { name: 'ご飯', quantity: 2, unit: '個', optional: false },
      { name: '卵', quantity: 2, unit: '個', optional: false },
      { name: 'ネギ', quantity: 1, unit: '本', optional: false },
      { name: '醤油', quantity: 1, unit: '大さじ', optional: false },
      { name: 'ごま油', quantity: 1, unit: '大さじ', optional: false },
      { name: '塩', quantity: 1, unit: '少々', optional: false },
    ],
    steps: [
      'ネギを小口切りにする',
      '強火でフライパンを熱し、油とご飯を炒める',
      '溶き卵を加えてさらに炒める',
      'ネギ・醤油・塩・こしょう・ごま油で味付けして完成！',
    ],
    isCustom: false,
  },
  {
    id: 'r017', name: '麻婆豆腐', category: '中華', emoji: '🌶️',
    description: 'ピリ辛でご飯が止まらない！本格中華。',
    requiredIngredients: [
      { name: '豆腐', quantity: 1, unit: '個', optional: false },
      { name: '豚ひき肉', quantity: 150, unit: 'g', optional: false },
      { name: 'にんにく', quantity: 2, unit: '個', optional: false },
      { name: 'しょうが', quantity: 1, unit: '少々', optional: false },
      { name: '豆板醤', quantity: 1, unit: '大さじ', optional: false },
      { name: '醤油', quantity: 1, unit: '大さじ', optional: false },
      { name: 'ごま油', quantity: 1, unit: '大さじ', optional: false },
    ],
    steps: [
      'にんにく・しょうがをみじん切り、豆腐を1cmの角切りに',
      '油でにんにく・しょうが・豆板醤を炒める',
      'ひき肉を加えて炒め、だし200mlを加える',
      '豆腐を加えて片栗粉でとろみをつけ、ごま油をかけて完成！',
    ],
    isCustom: false,
  },
  {
    id: 'r018', name: '野菜炒め', category: '中華', emoji: '🥬',
    description: '冷蔵庫の残り野菜で作れる万能おかず！',
    requiredIngredients: [
      { name: 'キャベツ', quantity: 1, unit: '個', optional: false },
      { name: 'にんじん', quantity: 1, unit: '本', optional: false },
      { name: 'もやし', quantity: 1, unit: '袋', optional: false },
      { name: '醤油', quantity: 2, unit: '大さじ', optional: false },
      { name: 'ごま油', quantity: 1, unit: '大さじ', optional: false },
    ],
    steps: [
      '野菜を食べやすい大きさに切る',
      '強火で油を熱して野菜を炒める',
      '醤油・塩・こしょうで味付け',
      'ごま油を回しかけて完成！',
    ],
    isCustom: false,
  },
  {
    id: 'r019', name: '春雨スープ', category: '中華', emoji: '🍜',
    description: 'ヘルシーで優しい味わいの春雨スープ。',
    requiredIngredients: [
      { name: '春雨', quantity: 50, unit: 'g', optional: false },
      { name: 'ネギ', quantity: 1, unit: '本', optional: false },
      { name: '醤油', quantity: 2, unit: '大さじ', optional: false },
      { name: 'ごま油', quantity: 1, unit: '大さじ', optional: false },
      { name: '塩', quantity: 1, unit: '少々', optional: false },
    ],
    steps: [
      '春雨を水で戻す',
      '鍋にお湯500mlを沸かしてコンソメを溶かす',
      '春雨とネギを加えて3分煮る',
      '醤油・塩・ごま油で味を整えて完成！',
    ],
    isCustom: false,
  },
  {
    id: 'r020', name: '餃子', category: '中華', emoji: '🥟',
    description: 'パリッと香ばしい手作り餃子！',
    requiredIngredients: [
      { name: '豚ひき肉', quantity: 200, unit: 'g', optional: false },
      { name: 'キャベツ', quantity: 1, unit: '個', optional: false },
      { name: 'にんにく', quantity: 2, unit: '個', optional: false },
      { name: 'しょうが', quantity: 1, unit: '少々', optional: false },
      { name: '醤油', quantity: 1, unit: '大さじ', optional: false },
      { name: 'ごま油', quantity: 1, unit: '大さじ', optional: false },
      { name: '餃子の皮', quantity: 30, unit: '枚', optional: false },
    ],
    steps: [
      'キャベツをみじん切りにして塩もみ・水気を切る',
      'ひき肉・キャベツ・にんにく・しょうが・調味料を混ぜる',
      '皮で包む',
      'フライパンで焼き、お湯を加えて蒸し焼きにして完成！',
    ],
    isCustom: false,
  },
  // --- 丼・麺 ---
  {
    id: 'r021', name: '牛丼', category: '丼・麺', emoji: '🍚',
    description: '甘辛タレの牛肉がご飯に最高！',
    requiredIngredients: [
      { name: '牛肉', quantity: 200, unit: 'g', optional: false },
      { name: '玉ねぎ', quantity: 1, unit: '個', optional: false },
      { name: '醤油', quantity: 3, unit: '大さじ', optional: false },
      { name: 'みりん', quantity: 3, unit: '大さじ', optional: false },
      { name: '砂糖', quantity: 1, unit: '大さじ', optional: false },
      { name: 'ご飯', quantity: 2, unit: '個', optional: false },
    ],
    steps: [
      '玉ねぎを薄切りに、牛肉を食べやすい大きさに切る',
      '鍋にだし200ml・醤油・みりん・砂糖を煮立てる',
      '玉ねぎを加えて5分、牛肉を加えて3分煮る',
      'ご飯の上に盛り付けて完成！',
    ],
    isCustom: false,
  },
  {
    id: 'r022', name: 'そぼろ丼', category: '丼・麺', emoji: '🍚',
    description: '三色で見た目も可愛いそぼろ丼。',
    requiredIngredients: [
      { name: '鶏ひき肉', quantity: 200, unit: 'g', optional: false },
      { name: '卵', quantity: 2, unit: '個', optional: false },
      { name: '醤油', quantity: 2, unit: '大さじ', optional: false },
      { name: 'みりん', quantity: 2, unit: '大さじ', optional: false },
      { name: '砂糖', quantity: 1, unit: '大さじ', optional: false },
      { name: 'ご飯', quantity: 2, unit: '個', optional: false },
    ],
    steps: [
      'ひき肉を醤油・みりん・砂糖で炒り煮する',
      '卵を溶いて砂糖・醤油少々で炒り卵を作る',
      'ご飯の上にそぼろ・炒り卵・グリーンピースを彩り良く盛り付けて完成！',
    ],
    isCustom: false,
  },
  {
    id: 'r023', name: 'ツナパスタ', category: '丼・麺', emoji: '🍝',
    description: 'ツナ缶で簡単！10分でできる時短パスタ。',
    requiredIngredients: [
      { name: 'パスタ', quantity: 200, unit: 'g', optional: false },
      { name: 'ツナ缶', quantity: 1, unit: '缶', optional: false },
      { name: 'にんにく', quantity: 2, unit: '個', optional: false },
      { name: 'オリーブオイル', quantity: 2, unit: '大さじ', optional: false },
      { name: '塩', quantity: 1, unit: '少々', optional: false },
    ],
    steps: [
      'パスタを茹でる',
      'オリーブオイルとにんにくを熱する',
      'ツナ缶を油ごと加えて炒める',
      '茹で上がったパスタを加えて塩・こしょうで味を整えて完成！',
    ],
    isCustom: false,
  },
  {
    id: 'r024', name: '和風パスタ', category: '丼・麺', emoji: '🍝',
    description: 'バターと醤油の和風ソースがたまらない！',
    requiredIngredients: [
      { name: 'パスタ', quantity: 200, unit: 'g', optional: false },
      { name: 'ベーコン', quantity: 80, unit: 'g', optional: false },
      { name: 'しいたけ', quantity: 3, unit: '個', optional: false },
      { name: '醤油', quantity: 2, unit: '大さじ', optional: false },
      { name: 'バター', quantity: 15, unit: 'g', optional: false },
    ],
    steps: [
      'パスタを茹でる',
      'バターでベーコン・しいたけを炒める',
      'パスタと醤油を加えて絡める',
      '刻み海苔をのせて完成！',
    ],
    isCustom: false,
  },
  {
    id: 'r025', name: 'ざるそば', category: '丼・麺', emoji: '🍜',
    description: 'シンプルで美味しい夏の定番麺料理。',
    requiredIngredients: [
      { name: 'そば', quantity: 200, unit: 'g', optional: false },
      { name: 'めんつゆ', quantity: 4, unit: '大さじ', optional: false },
      { name: 'ネギ', quantity: 1, unit: '本', optional: true },
      { name: 'わさび', quantity: 1, unit: '少々', optional: true },
    ],
    steps: [
      'そばを茹でて冷水で締める',
      'めんつゆを水で薄めてつゆを作る',
      'そばをザルに盛り、ネギ・わさびを添えて完成！',
    ],
    isCustom: false,
  },
  // --- 副菜・その他 ---
  {
    id: 'r026', name: '卵焼き', category: '副菜・その他', emoji: '🍳',
    description: 'お弁当にも最適！甘い卵焼き。',
    requiredIngredients: [
      { name: '卵', quantity: 3, unit: '個', optional: false },
      { name: '醤油', quantity: 1, unit: '小さじ', optional: false },
      { name: '砂糖', quantity: 2, unit: '小さじ', optional: false },
      { name: 'みりん', quantity: 1, unit: '大さじ', optional: true },
    ],
    steps: [
      '卵に砂糖・醤油・みりんを加えて溶く',
      '卵焼き器に油を熱して卵液を3回に分けて巻く',
      '形を整えて切り分けて完成！',
    ],
    isCustom: false,
  },
  {
    id: 'r027', name: 'ゆで卵', category: '副菜・その他', emoji: '🥚',
    description: '基本のゆで卵。半熟も固茹でもお好みで！',
    requiredIngredients: [
      { name: '卵', quantity: 2, unit: '個', optional: false },
    ],
    steps: [
      '卵を常温に戻す',
      '沸騰したお湯に卵を入れる',
      '半熟は6分、固茹では10〜12分茹でる',
      '冷水で冷まして殻をむいて完成！',
    ],
    isCustom: false,
  },
  {
    id: 'r028', name: 'キャベツの塩昆布和え', category: '副菜・その他', emoji: '🥬',
    description: '3分でできる！旨味たっぷりの絶品副菜。',
    requiredIngredients: [
      { name: 'キャベツ', quantity: 1, unit: '個', optional: false },
      { name: '塩昆布', quantity: 10, unit: 'g', optional: false },
      { name: 'ごま油', quantity: 1, unit: '大さじ', optional: false },
    ],
    steps: [
      'キャベツを一口大にちぎる',
      '塩昆布・ごま油と和える',
      '5分ほど置いて味をなじませて完成！',
    ],
    isCustom: false,
  },
  {
    id: 'r029', name: 'もやし炒め', category: '副菜・その他', emoji: '🌱',
    description: '安くてヘルシー！シャキシャキもやし炒め。',
    requiredIngredients: [
      { name: 'もやし', quantity: 1, unit: '袋', optional: false },
      { name: 'にんにく', quantity: 1, unit: '個', optional: false },
      { name: 'ごま油', quantity: 1, unit: '大さじ', optional: false },
      { name: '塩', quantity: 1, unit: '少々', optional: false },
    ],
    steps: [
      'フライパンにごま油とにんにくを熱する',
      'もやしを強火で30秒炒める',
      '塩・こしょうで味付けして完成！',
    ],
    isCustom: false,
  },
  {
    id: 'r030', name: 'トマトと卵炒め', category: '中華', emoji: '🍅',
    description: '中華の定番！トマトの酸味と卵の甘みが絶妙。',
    requiredIngredients: [
      { name: 'トマト', quantity: 2, unit: '個', optional: false },
      { name: '卵', quantity: 2, unit: '個', optional: false },
      { name: '塩', quantity: 1, unit: '少々', optional: false },
      { name: 'ごま油', quantity: 1, unit: '大さじ', optional: false },
    ],
    steps: [
      'トマトをくし切りにする',
      '卵を溶いて炒めて取り出す',
      'トマトを炒め、卵を戻して塩・ごま油で味付けして完成！',
    ],
    isCustom: false,
  },
];

// === QUICK INGREDIENT PRESETS ===
const QUICK_INGREDIENTS = [
  // 野菜
  { name: '玉ねぎ',       category: '野菜',      quantity: 3,   unit: '個' },
  { name: 'にんじん',     category: '野菜',      quantity: 2,   unit: '本' },
  { name: 'じゃがいも',   category: '野菜',      quantity: 4,   unit: '個' },
  { name: 'キャベツ',     category: '野菜',      quantity: 1,   unit: '個' },
  { name: 'トマト',       category: '野菜',      quantity: 3,   unit: '個' },
  { name: 'きゅうり',     category: '野菜',      quantity: 2,   unit: '本' },
  { name: 'もやし',       category: '野菜',      quantity: 1,   unit: '袋' },
  { name: 'ほうれん草',   category: '野菜',      quantity: 1,   unit: '束' },
  { name: 'ネギ',         category: '野菜',      quantity: 2,   unit: '本' },
  { name: 'にんにく',     category: '野菜',      quantity: 1,   unit: '個' },
  { name: 'しょうが',     category: '野菜',      quantity: 1,   unit: '個' },
  { name: 'ごぼう',       category: '野菜',      quantity: 1,   unit: '本' },
  { name: '大根',         category: '野菜',      quantity: 1,   unit: '本' },
  { name: 'ピーマン',     category: '野菜',      quantity: 3,   unit: '個' },
  { name: 'しいたけ',     category: '野菜',      quantity: 4,   unit: '個' },
  // 肉・魚
  { name: '豚肉',         category: '肉・魚',    quantity: 200, unit: 'g' },
  { name: '鶏肉',         category: '肉・魚',    quantity: 300, unit: 'g' },
  { name: '牛肉',         category: '肉・魚',    quantity: 200, unit: 'g' },
  { name: '豚ひき肉',     category: '肉・魚',    quantity: 200, unit: 'g' },
  { name: '鶏ひき肉',     category: '肉・魚',    quantity: 200, unit: 'g' },
  { name: 'ベーコン',     category: '肉・魚',    quantity: 100, unit: 'g' },
  { name: '鮭',           category: '肉・魚',    quantity: 2,   unit: '枚' },
  // 卵・乳製品
  { name: '卵',           category: '卵・乳製品', quantity: 6,   unit: '個' },
  { name: '牛乳',         category: '卵・乳製品', quantity: 1,   unit: 'L' },
  { name: 'バター',       category: '卵・乳製品', quantity: 200, unit: 'g' },
  { name: '生クリーム',   category: '卵・乳製品', quantity: 200, unit: 'ml' },
  { name: '豆腐',         category: '卵・乳製品', quantity: 1,   unit: '個' },
  // 調味料
  { name: '醤油',         category: '調味料',    quantity: 300, unit: 'ml' },
  { name: 'みりん',       category: '調味料',    quantity: 200, unit: 'ml' },
  { name: '料理酒',       category: '調味料',    quantity: 200, unit: 'ml' },
  { name: '砂糖',         category: '調味料',    quantity: 200, unit: 'g' },
  { name: '塩',           category: '調味料',    quantity: 100, unit: 'g' },
  { name: 'こしょう',     category: '調味料',    quantity: 1,   unit: '個' },
  { name: 'ごま油',       category: '調味料',    quantity: 100, unit: 'ml' },
  { name: 'オリーブオイル', category: '調味料',  quantity: 200, unit: 'ml' },
  { name: '味噌',         category: '調味料',    quantity: 200, unit: 'g' },
  { name: 'ケチャップ',   category: '調味料',    quantity: 1,   unit: '個' },
  { name: 'マヨネーズ',   category: '調味料',    quantity: 1,   unit: '個' },
  { name: '豆板醤',       category: '調味料',    quantity: 1,   unit: '個' },
  { name: 'めんつゆ',     category: '調味料',    quantity: 200, unit: 'ml' },
  { name: 'コンソメ',     category: '調味料',    quantity: 1,   unit: '個' },
  // 乾物・缶詰
  { name: 'パスタ',       category: '乾物・缶詰', quantity: 200, unit: 'g' },
  { name: 'そば',         category: '乾物・缶詰', quantity: 200, unit: 'g' },
  { name: '春雨',         category: '乾物・缶詰', quantity: 50,  unit: 'g' },
  { name: 'ツナ缶',       category: '乾物・缶詰', quantity: 1,   unit: '缶' },
  { name: 'ひじき',       category: '乾物・缶詰', quantity: 20,  unit: 'g' },
  { name: '薄力粉',       category: '乾物・缶詰', quantity: 200, unit: 'g' },
  // その他
  { name: 'ご飯',         category: 'その他',    quantity: 2,   unit: '個' },
  { name: '油揚げ',       category: 'その他',    quantity: 2,   unit: '枚' },
  { name: '餃子の皮',     category: 'その他',    quantity: 30,  unit: '枚' },
  { name: '塩昆布',       category: 'その他',    quantity: 20,  unit: 'g' },
];

// === STATE ===
let state = {
  ingredients: [],
  shoppingList: [],
  customRecipes: [],
  activeTab: 'fridge',
  fridgeSearch: '',
  fridgeCategoryFilter: 'all',
  suggestFilter: 'all',
  libraryFilter: 'all',
  librarySearch: '',
};

// === STORAGE ===
function saveState() {
  localStorage.setItem(STORAGE_KEYS.INGREDIENTS, JSON.stringify(state.ingredients));
  localStorage.setItem(STORAGE_KEYS.SHOPPING, JSON.stringify(state.shoppingList));
  localStorage.setItem(STORAGE_KEYS.CUSTOM_RECIPES, JSON.stringify(state.customRecipes));
  // Update shopping badge whenever state is saved
  const badge = document.getElementById('shopping-badge');
  if (badge) {
    const count = state.shoppingList.filter(i => !i.checked).length;
    badge.textContent = count > 0 ? count : '';
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

function loadState() {
  try {
    state.ingredients = JSON.parse(localStorage.getItem(STORAGE_KEYS.INGREDIENTS) || '[]');
    state.shoppingList = JSON.parse(localStorage.getItem(STORAGE_KEYS.SHOPPING) || '[]');
    state.customRecipes = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_RECIPES) || '[]');
  } catch {
    state.ingredients = [];
    state.shoppingList = [];
    state.customRecipes = [];
  }
}

// === UTILS ===
function generateId() {
  return 'u' + Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function getAllRecipes() {
  return [...BUILT_IN_RECIPES, ...state.customRecipes];
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// === RECIPE MATCHING LOGIC ===
function matchIngredientName(recipeName, fridgeIngredients) {
  const lower = recipeName.toLowerCase();
  return fridgeIngredients.find(fi => {
    const fiLower = fi.name.toLowerCase();
    return fiLower === lower || fiLower.includes(lower) || lower.includes(fiLower);
  });
}

function getRecipeMatchInfo(recipe) {
  const required = recipe.requiredIngredients.filter(ri => !ri.optional);
  const matched = [];
  const missing = [];

  for (const ri of required) {
    const found = matchIngredientName(ri.name, state.ingredients);
    if (found) {
      matched.push({ recipeIng: ri, fridgeIng: found });
    } else {
      missing.push(ri);
    }
  }

  const pct = required.length > 0 ? Math.round((matched.length / required.length) * 100) : 100;
  return {
    total: required.length,
    matchedCount: matched.length,
    matched,
    missing,
    percentage: pct,
    canMake: missing.length === 0,
  };
}

function getSortedSuggestedRecipes() {
  return getAllRecipes()
    .map(r => ({ recipe: r, info: getRecipeMatchInfo(r) }))
    .filter(({ info }) => info.percentage > 0)
    .sort((a, b) => b.info.percentage - a.info.percentage);
}

// === CONSUME RECIPE ===
function consumeRecipe(recipeId) {
  const recipe = getAllRecipes().find(r => r.id === recipeId);
  if (!recipe) return;

  const required = recipe.requiredIngredients.filter(ri => !ri.optional);
  for (const ri of required) {
    const fridgeIdx = state.ingredients.findIndex(fi => matchIngredientName(ri.name, [fi]));
    if (fridgeIdx === -1) continue;

    const fi = state.ingredients[fridgeIdx];
    // Skip quantity tracking for special units
    if (['少々', '適量'].includes(ri.unit) || ['少々', '適量'].includes(fi.unit)) continue;

    if (fi.unit === ri.unit) {
      fi.quantity -= ri.quantity;
    } else {
      // Units don't match — subtract 1 from fridge quantity as approximation
      fi.quantity -= 1;
    }

    if (fi.quantity <= 0) {
      state.ingredients.splice(fridgeIdx, 1);
    }
  }
  saveState();
}

// === SHOPPING LIST ===
function addToShoppingList(item) {
  state.shoppingList.push({
    id: generateId(),
    name: item.name,
    category: item.category || 'その他',
    quantity: item.quantity || 1,
    unit: item.unit || '個',
    checked: false,
    fromRecipe: item.fromRecipe || null,
  });
  saveState();
}

function movePurchasedToFridge() {
  const bought = state.shoppingList.filter(i => i.checked);
  for (const item of bought) {
    const exists = state.ingredients.find(fi =>
      fi.name.toLowerCase() === item.name.toLowerCase()
    );
    if (exists) {
      if (exists.unit === item.unit) exists.quantity += item.quantity;
      else exists.quantity += item.quantity; // rough merge
    } else {
      state.ingredients.push({
        id: generateId(),
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
        addedAt: Date.now(),
      });
    }
  }
  state.shoppingList = state.shoppingList.filter(i => !i.checked);
  saveState();
}

// ==================== MODALS ====================
let currentModal = null;

function openModal(html) {
  const overlay = document.getElementById('modal-overlay');
  const box = document.getElementById('modal-box');
  box.innerHTML = html;
  overlay.classList.add('active');
  currentModal = box;
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('active');
  currentModal = null;
}

// ==================== MODAL: BULK ADD ====================
let bulkRowCounter = 0;

const QUICK_CHIP_CATEGORIES = [
  { label: '🥦 野菜', key: '野菜' },
  { label: '🥩 肉・魚', key: '肉・魚' },
  { label: '🥚 卵・乳製品', key: '卵・乳製品' },
  { label: '🧂 調味料', key: '調味料' },
  { label: '🥫 乾物・缶詰', key: '乾物・缶詰' },
  { label: '🍱 その他', key: 'その他' },
];

function showBulkAddModal() {
  bulkRowCounter = 0;

  const chipsByCategory = QUICK_CHIP_CATEGORIES.map(({ label, key }) => {
    const chips = QUICK_INGREDIENTS.filter(qi => qi.category === key);
    if (chips.length === 0) return '';
    return `
      <div class="quick-chip-group">
        <div class="quick-chip-group-label">${label}</div>
        <div class="quick-chip-row">
          ${chips.map((qi, _) => {
            const globalIdx = QUICK_INGREDIENTS.indexOf(qi);
            const inFridge = state.ingredients.some(fi =>
              fi.name.toLowerCase() === qi.name.toLowerCase()
            );
            return `<button class="quick-chip ${inFridge ? 'quick-chip-have' : ''}"
              onclick="quickAddBulkRow(${globalIdx})" title="${qi.quantity}${qi.unit}">
              ${escapeHtml(qi.name)}${inFridge ? ' ✓' : ''}
            </button>`;
          }).join('')}
        </div>
      </div>`;
  }).join('');

  openModal(`
    <div class="modal-header">
      <h2>📦 食材を一括追加</h2>
      <button class="modal-close-btn" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body bulk-modal-body">
      <div class="quick-chips-section">
        <div class="form-section-title" style="margin:0 0 8px;">🌟 よく使う食材をタップ</div>
        <div class="quick-chips-scroll">
          ${chipsByCategory}
        </div>
      </div>
      <div class="bulk-list-header">
        <span class="form-section-title" style="margin:0;">📝 入力リスト</span>
        <span id="bulk-count-badge" class="stat-chip">0品</span>
      </div>
      <div id="bulk-rows-container"></div>
      <button class="btn btn-ghost btn-block bulk-add-row-btn" onclick="addBulkRowEmpty()">
        ＋ 行を追加
      </button>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">キャンセル</button>
      <button class="btn btn-primary" onclick="submitBulkAdd()">一括登録 🌟</button>
    </div>
  `);

  // Start with 3 empty rows
  addBulkRowEmpty();
  addBulkRowEmpty();
  addBulkRowEmpty();
}

function addBulkRowEmpty() {
  addBulkRow(null);
}

function quickAddBulkRow(globalIdx) {
  const qi = QUICK_INGREDIENTS[globalIdx];

  // Find an empty row to fill in
  const rows = document.querySelectorAll('#bulk-rows-container .bulk-row');
  for (const row of rows) {
    const nameInput = row.querySelector('.bulk-name');
    if (!nameInput.value.trim()) {
      nameInput.value = qi.name;
      row.querySelector('.bulk-cat').value = qi.category;
      row.querySelector('.bulk-qty').value = qi.quantity;
      row.querySelector('.bulk-unit').value = qi.unit;
      nameInput.focus();
      updateBulkCount();
      // Highlight the filled row briefly
      row.classList.add('bulk-row-flash');
      setTimeout(() => row.classList.remove('bulk-row-flash'), 600);
      return;
    }
  }
  // No empty row — create one with this ingredient pre-filled
  addBulkRow(qi);
}

function addBulkRow(prefill) {
  const id = bulkRowCounter++;
  const container = document.getElementById('bulk-rows-container');
  if (!container) return;

  const unitOptions = UNITS.map(u =>
    `<option value="${u}" ${prefill && u === prefill.unit ? 'selected' : ''}>${u}</option>`
  ).join('');
  const catOptions = INGREDIENT_CATEGORIES.map(c =>
    `<option value="${c}" ${prefill && c === prefill.category ? 'selected' : ''}>${CATEGORY_EMOJIS[c]} ${c}</option>`
  ).join('');

  const row = document.createElement('div');
  row.className = 'bulk-row';
  row.dataset.rowId = id;
  row.innerHTML = `
    <div class="bulk-row-top">
      <input
        type="text"
        class="form-input bulk-name"
        placeholder="食材名"
        value="${prefill ? escapeHtml(prefill.name) : ''}"
        oninput="updateBulkCount()"
      />
      <button class="btn-icon danger bulk-remove-btn" onclick="removeBulkRow(this)" title="削除">✕</button>
    </div>
    <div class="bulk-row-bottom">
      <select class="form-select bulk-cat">${catOptions}</select>
      <input type="number" class="form-input bulk-qty" value="${prefill ? prefill.quantity : 1}" min="0" step="0.1" />
      <select class="form-select bulk-unit">${unitOptions}</select>
    </div>
  `;
  container.appendChild(row);
  if (prefill) {
    row.classList.add('bulk-row-flash');
    setTimeout(() => row.classList.remove('bulk-row-flash'), 600);
  }
  updateBulkCount();
  // Scroll to bottom
  container.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

function removeBulkRow(btn) {
  const row = btn.closest('.bulk-row');
  if (row) { row.remove(); updateBulkCount(); }
}

function updateBulkCount() {
  const badge = document.getElementById('bulk-count-badge');
  if (!badge) return;
  const inputs = document.querySelectorAll('#bulk-rows-container .bulk-name');
  const count = Array.from(inputs).filter(i => i.value.trim()).length;
  badge.textContent = `${count}品`;
  badge.style.background = count > 0 ? 'var(--color-success-light)' : '';
  badge.style.color = count > 0 ? 'var(--color-success)' : '';
}

function submitBulkAdd() {
  const rows = document.querySelectorAll('#bulk-rows-container .bulk-row');
  const newItems = [];
  const skipped = [];

  for (const row of rows) {
    const name = row.querySelector('.bulk-name').value.trim();
    if (!name) continue;
    const category = row.querySelector('.bulk-cat').value;
    const quantity = parseFloat(row.querySelector('.bulk-qty').value) || 1;
    const unit = row.querySelector('.bulk-unit').value;

    // If same name + same unit already exists → merge quantity
    const existing = state.ingredients.find(fi =>
      fi.name.toLowerCase() === name.toLowerCase() && fi.unit === unit
    );
    if (existing) {
      existing.quantity += quantity;
      skipped.push(name);
    } else {
      newItems.push({ id: generateId(), name, category, quantity, unit, addedAt: Date.now() });
    }
  }

  if (newItems.length === 0 && skipped.length === 0) {
    showToast('食材名を入力してください', 'error');
    return;
  }

  state.ingredients.push(...newItems);
  saveState();
  closeModal();
  renderFridgeTab();
  renderSuggestTab();

  if (skipped.length > 0 && newItems.length > 0) {
    showToast(`${newItems.length}品を追加・${skipped.length}品を数量更新しました！`, 'success');
  } else if (skipped.length > 0) {
    showToast(`${skipped.length}品の数量を更新しました！`, 'success');
  } else {
    showToast(`${newItems.length}品を追加しました！🎉`, 'success');
  }
}

// ==================== MODAL: ADD INGREDIENT ====================

function showAddIngredientModal(prefillName = '', prefillCategory = 'その他') {
  const unitOptions = UNITS.map(u => `<option value="${u}">${u}</option>`).join('');
  const catOptions = INGREDIENT_CATEGORIES.map(c =>
    `<option value="${c}" ${c === prefillCategory ? 'selected' : ''}>${CATEGORY_EMOJIS[c]} ${c}</option>`
  ).join('');

  openModal(`
    <div class="modal-header">
      <h2>🥕 食材を追加</h2>
      <button class="modal-close-btn" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label>食材名 <span class="required">*</span></label>
        <input type="text" id="ing-name" class="form-input" placeholder="例: 卵" value="${escapeHtml(prefillName)}" />
      </div>
      <div class="form-group">
        <label>カテゴリ <span class="required">*</span></label>
        <select id="ing-category" class="form-select">${catOptions}</select>
      </div>
      <div class="form-row">
        <div class="form-group flex-1">
          <label>数量 <span class="required">*</span></label>
          <input type="number" id="ing-qty" class="form-input" value="1" min="0" step="0.1" />
        </div>
        <div class="form-group flex-1">
          <label>単位 <span class="required">*</span></label>
          <select id="ing-unit" class="form-select">${unitOptions}</select>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">キャンセル</button>
      <button class="btn btn-primary" onclick="submitAddIngredient()">追加する 🌟</button>
    </div>
  `);
  document.getElementById('ing-name').focus();
}

function submitAddIngredient() {
  const name = document.getElementById('ing-name').value.trim();
  const category = document.getElementById('ing-category').value;
  const quantity = parseFloat(document.getElementById('ing-qty').value);
  const unit = document.getElementById('ing-unit').value;

  if (!name) { showToast('食材名を入力してください', 'error'); return; }
  if (isNaN(quantity) || quantity < 0) { showToast('数量を正しく入力してください', 'error'); return; }

  state.ingredients.push({ id: generateId(), name, category, quantity, unit, addedAt: Date.now() });
  saveState();
  closeModal();
  renderFridgeTab();
  showToast(`${name} を追加しました！`, 'success');
}

// ==================== MODAL: EDIT INGREDIENT ====================
function showEditIngredientModal(id) {
  const ing = state.ingredients.find(i => i.id === id);
  if (!ing) return;

  const unitOptions = UNITS.map(u => `<option value="${u}" ${u === ing.unit ? 'selected' : ''}>${u}</option>`).join('');
  const catOptions = INGREDIENT_CATEGORIES.map(c =>
    `<option value="${c}" ${c === ing.category ? 'selected' : ''}>${CATEGORY_EMOJIS[c]} ${c}</option>`
  ).join('');

  openModal(`
    <div class="modal-header">
      <h2>✏️ 食材を編集</h2>
      <button class="modal-close-btn" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label>食材名</label>
        <input type="text" id="edit-ing-name" class="form-input" value="${escapeHtml(ing.name)}" />
      </div>
      <div class="form-group">
        <label>カテゴリ</label>
        <select id="edit-ing-category" class="form-select">${catOptions}</select>
      </div>
      <div class="form-row">
        <div class="form-group flex-1">
          <label>数量</label>
          <input type="number" id="edit-ing-qty" class="form-input" value="${ing.quantity}" min="0" step="0.1" />
        </div>
        <div class="form-group flex-1">
          <label>単位</label>
          <select id="edit-ing-unit" class="form-select">${unitOptions}</select>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">キャンセル</button>
      <button class="btn btn-primary" onclick="submitEditIngredient('${id}')">保存する 💾</button>
    </div>
  `);
}

function submitEditIngredient(id) {
  const ing = state.ingredients.find(i => i.id === id);
  if (!ing) return;

  ing.name = document.getElementById('edit-ing-name').value.trim();
  ing.category = document.getElementById('edit-ing-category').value;
  ing.quantity = parseFloat(document.getElementById('edit-ing-qty').value);
  ing.unit = document.getElementById('edit-ing-unit').value;

  if (!ing.name) { showToast('食材名を入力してください', 'error'); return; }
  saveState();
  closeModal();
  renderFridgeTab();
  showToast('更新しました！', 'success');
}

function deleteIngredient(id) {
  const ing = state.ingredients.find(i => i.id === id);
  if (!ing) return;
  if (!confirm(`「${ing.name}」を削除しますか？`)) return;
  state.ingredients = state.ingredients.filter(i => i.id !== id);
  saveState();
  renderFridgeTab();
  showToast(`${ing.name} を削除しました`, 'info');
}

// ==================== MODAL: RECIPE DETAIL ====================
function showRecipeDetailModal(recipeId) {
  const recipe = getAllRecipes().find(r => r.id === recipeId);
  if (!recipe) return;

  const info = getRecipeMatchInfo(recipe);
  const matchBadge = info.canMake
    ? '<span class="badge badge-success">✨ 今すぐ作れる！</span>'
    : `<span class="badge badge-warn">🛒 あと ${info.missing.length} 品不足</span>`;

  const ingList = recipe.requiredIngredients.map(ri => {
    const found = matchIngredientName(ri.name, state.ingredients);
    const cls = found ? 'ing-have' : (ri.optional ? 'ing-optional' : 'ing-missing');
    const icon = found ? '✅' : (ri.optional ? '⭕' : '❌');
    return `<li class="${cls}">${icon} ${escapeHtml(ri.name)} <span class="ing-amount">${ri.quantity}${ri.unit}</span>${ri.optional ? ' <span class="optional-tag">任意</span>' : ''}</li>`;
  }).join('');

  const stepsList = recipe.steps.map((s, i) =>
    `<li><span class="step-num">${i + 1}</span> ${escapeHtml(s)}</li>`
  ).join('');

  const missingShoppingBtns = info.missing.length > 0
    ? `<button class="btn btn-accent" onclick="addMissingToShopping('${recipeId}')">🛒 不足食材を買い物リストへ</button>`
    : '';

  const cookBtn = info.canMake
    ? `<button class="btn btn-success" onclick="cookRecipe('${recipeId}')">🍳 この料理を作る！</button>`
    : '';

  openModal(`
    <div class="modal-header">
      <h2>${recipe.emoji} ${escapeHtml(recipe.name)}</h2>
      <button class="modal-close-btn" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="recipe-meta">
        <span class="recipe-category-tag">${CATEGORY_EMOJIS[recipe.category]} ${recipe.category}</span>
        ${matchBadge}
        <div class="match-bar-wrap">
          <div class="match-bar-fill" style="width:${info.percentage}%"></div>
        </div>
        <span class="match-pct">${info.percentage}% 揃っています</span>
      </div>
      <p class="recipe-desc">${escapeHtml(recipe.description)}</p>
      <h3>🥗 必要な食材</h3>
      <ul class="ing-list">${ingList}</ul>
      <h3>👩‍🍳 作り方</h3>
      <ol class="steps-list">${stepsList}</ol>
    </div>
    <div class="modal-footer">
      ${missingShoppingBtns}
      ${cookBtn}
      <button class="btn btn-ghost" onclick="closeModal()">閉じる</button>
    </div>
  `);
}

function cookRecipe(recipeId) {
  const recipe = getAllRecipes().find(r => r.id === recipeId);
  if (!recipe) return;
  if (!confirm(`「${recipe.name}」を作りますか？\n使用した食材を冷蔵庫から消費します。`)) return;
  consumeRecipe(recipeId);
  closeModal();
  renderFridgeTab();
  renderSuggestTab();
  showToast(`${recipe.name} を作りました！🍽️`, 'success');
}

function addMissingToShopping(recipeId) {
  const recipe = getAllRecipes().find(r => r.id === recipeId);
  if (!recipe) return;
  const info = getRecipeMatchInfo(recipe);

  let added = 0;
  for (const ri of info.missing) {
    const alreadyIn = state.shoppingList.find(s =>
      s.name.toLowerCase() === ri.name.toLowerCase()
    );
    if (!alreadyIn) {
      addToShoppingList({
        name: ri.name,
        category: 'その他',
        quantity: ri.quantity,
        unit: ri.unit,
        fromRecipe: recipe.name,
      });
      added++;
    }
  }

  closeModal();
  renderShoppingTab();
  if (added > 0) {
    showToast(`${added} 品を買い物リストに追加しました 🛒`, 'success');
    switchTab('shopping');
  } else {
    showToast('すでに買い物リストに入っています', 'info');
  }
}

// ==================== MODAL: ADD CUSTOM RECIPE ====================
let tmpRecipeIngs = [];
let tmpRecipeSteps = [];

function showAddRecipeModal() {
  tmpRecipeIngs = [];
  tmpRecipeSteps = [];

  const catOptions = RECIPE_CATEGORIES.map(c =>
    `<option value="${c}">${CATEGORY_EMOJIS[c]} ${c}</option>`
  ).join('');

  openModal(`
    <div class="modal-header">
      <h2>📝 カスタムレシピを追加</h2>
      <button class="modal-close-btn" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body" style="max-height:65vh;overflow-y:auto;">
      <div class="form-group">
        <label>レシピ名 <span class="required">*</span></label>
        <input type="text" id="cr-name" class="form-input" placeholder="例: 特製カレー" />
      </div>
      <div class="form-row">
        <div class="form-group flex-1">
          <label>カテゴリ <span class="required">*</span></label>
          <select id="cr-category" class="form-select">${catOptions}</select>
        </div>
        <div class="form-group flex-1">
          <label>絵文字</label>
          <input type="text" id="cr-emoji" class="form-input" value="🍴" maxlength="2" style="font-size:1.5rem;text-align:center;" />
        </div>
      </div>
      <div class="form-group">
        <label>説明</label>
        <textarea id="cr-desc" class="form-textarea" placeholder="料理の説明を入力"></textarea>
      </div>

      <div class="form-section-title">🥗 必要な食材</div>
      <div id="cr-ings-list" class="cr-dynamic-list"></div>
      <div class="form-row form-row-sm">
        <input type="text" id="cr-ing-name" class="form-input" placeholder="食材名" />
        <input type="number" id="cr-ing-qty" class="form-input" value="1" min="0" step="0.1" style="width:70px" />
        <select id="cr-ing-unit" class="form-select" style="width:80px">
          ${UNITS.map(u => `<option>${u}</option>`).join('')}
        </select>
        <label class="form-checkbox"><input type="checkbox" id="cr-ing-opt" /> 任意</label>
        <button class="btn btn-sm btn-secondary" onclick="addCRIng()">追加</button>
      </div>

      <div class="form-section-title">👩‍🍳 作り方</div>
      <div id="cr-steps-list" class="cr-dynamic-list"></div>
      <div class="form-row form-row-sm">
        <input type="text" id="cr-step-text" class="form-input" placeholder="手順を入力..." />
        <button class="btn btn-sm btn-secondary" onclick="addCRStep()">追加</button>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">キャンセル</button>
      <button class="btn btn-primary" onclick="submitAddRecipe()">保存する ✨</button>
    </div>
  `);
  renderCRIngsList();
  renderCRStepsList();
}

function addCRIng() {
  const name = document.getElementById('cr-ing-name').value.trim();
  const qty = parseFloat(document.getElementById('cr-ing-qty').value);
  const unit = document.getElementById('cr-ing-unit').value;
  const opt = document.getElementById('cr-ing-opt').checked;
  if (!name) { showToast('食材名を入力してください', 'error'); return; }
  tmpRecipeIngs.push({ name, quantity: qty, unit, optional: opt });
  document.getElementById('cr-ing-name').value = '';
  renderCRIngsList();
}

function removeCRIng(idx) {
  tmpRecipeIngs.splice(idx, 1);
  renderCRIngsList();
}

function renderCRIngsList() {
  const el = document.getElementById('cr-ings-list');
  if (!el) return;
  if (tmpRecipeIngs.length === 0) {
    el.innerHTML = '<p class="empty-hint">食材を追加してください</p>';
    return;
  }
  el.innerHTML = tmpRecipeIngs.map((ri, i) => `
    <div class="cr-list-item">
      <span>${ri.optional ? '⭕ 任意' : '❗ 必須'} ${escapeHtml(ri.name)} ${ri.quantity}${ri.unit}</span>
      <button class="btn-icon-sm" onclick="removeCRIng(${i})">🗑️</button>
    </div>
  `).join('');
}

function addCRStep() {
  const text = document.getElementById('cr-step-text').value.trim();
  if (!text) { showToast('手順を入力してください', 'error'); return; }
  tmpRecipeSteps.push(text);
  document.getElementById('cr-step-text').value = '';
  renderCRStepsList();
}

function removeCRStep(idx) {
  tmpRecipeSteps.splice(idx, 1);
  renderCRStepsList();
}

function renderCRStepsList() {
  const el = document.getElementById('cr-steps-list');
  if (!el) return;
  if (tmpRecipeSteps.length === 0) {
    el.innerHTML = '<p class="empty-hint">手順を追加してください</p>';
    return;
  }
  el.innerHTML = tmpRecipeSteps.map((s, i) => `
    <div class="cr-list-item">
      <span class="step-num">${i + 1}</span>
      <span>${escapeHtml(s)}</span>
      <button class="btn-icon-sm" onclick="removeCRStep(${i})">🗑️</button>
    </div>
  `).join('');
}

function submitAddRecipe() {
  const name = document.getElementById('cr-name').value.trim();
  const category = document.getElementById('cr-category').value;
  const emoji = document.getElementById('cr-emoji').value.trim() || '🍴';
  const description = document.getElementById('cr-desc').value.trim();

  if (!name) { showToast('レシピ名を入力してください', 'error'); return; }
  if (tmpRecipeIngs.length === 0) { showToast('食材を追加してください', 'error'); return; }

  const newRecipe = {
    id: generateId(),
    name, category, emoji, description,
    requiredIngredients: [...tmpRecipeIngs],
    steps: [...tmpRecipeSteps],
    isCustom: true,
  };
  state.customRecipes.push(newRecipe);
  saveState();
  closeModal();
  renderLibraryTab();
  renderSuggestTab();
  showToast(`「${name}」を追加しました！🎉`, 'success');
}

function deleteCustomRecipe(id) {
  const r = state.customRecipes.find(r => r.id === id);
  if (!r) return;
  if (!confirm(`「${r.name}」を削除しますか？`)) return;
  state.customRecipes = state.customRecipes.filter(r => r.id !== id);
  saveState();
  renderLibraryTab();
  renderSuggestTab();
  showToast(`${r.name} を削除しました`, 'info');
}

// ==================== RENDER: FRIDGE TAB ====================
function renderFridgeTab() {
  const container = document.getElementById('fridge-content');
  if (!container) return;

  const search = state.fridgeSearch.toLowerCase();
  const filter = state.fridgeCategoryFilter;

  let ings = state.ingredients;
  if (search) ings = ings.filter(i => i.name.toLowerCase().includes(search));
  if (filter !== 'all') ings = ings.filter(i => i.category === filter);

  // Group by category
  const groups = {};
  for (const cat of INGREDIENT_CATEGORIES) {
    const items = ings.filter(i => i.category === cat);
    if (items.length > 0) groups[cat] = items;
  }

  if (ings.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🧊</div>
        <p>まだ食材が登録されていません</p>
        <p class="empty-hint">「食材を追加」ボタンで登録しましょう！</p>
      </div>`;
    return;
  }

  container.innerHTML = Object.entries(groups).map(([cat, items]) => `
    <div class="ingredient-group">
      <h3 class="group-title">${CATEGORY_EMOJIS[cat]} ${cat}</h3>
      <div class="ingredient-grid">
        ${items.map(ing => `
          <div class="ingredient-card" data-id="${ing.id}">
            <div class="ingredient-card-body">
              <span class="ingredient-name">${escapeHtml(ing.name)}</span>
              <span class="ingredient-qty">${ing.quantity}${ing.unit}</span>
            </div>
            <div class="ingredient-card-actions">
              <button class="btn-icon" title="編集" onclick="showEditIngredientModal('${ing.id}')">✏️</button>
              <button class="btn-icon danger" title="削除" onclick="deleteIngredient('${ing.id}')">🗑️</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

// ==================== RENDER: SUGGEST TAB ====================
function renderSuggestTab() {
  const container = document.getElementById('suggest-content');
  if (!container) return;

  const filter = state.suggestFilter;
  let items = getSortedSuggestedRecipes();
  if (filter === 'can') items = items.filter(({ info }) => info.canMake);
  else if (filter === 'almost') items = items.filter(({ info }) => !info.canMake && info.missing.length <= 3);

  if (state.ingredients.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🍽️</div>
        <p>冷蔵庫に食材を登録してください</p>
        <button class="btn btn-primary" onclick="switchTab('fridge')">🧊 冷蔵庫へ</button>
      </div>`;
    return;
  }

  if (items.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🤔</div>
        <p>該当するメニューがありません</p>
      </div>`;
    return;
  }

  const canMakeItems = items.filter(({ info }) => info.canMake);
  const almostItems = items.filter(({ info }) => !info.canMake && info.missing.length <= 3);
  const otherItems = items.filter(({ info }) => !info.canMake && info.missing.length > 3);

  function renderCard({ recipe, info }) {
    const pctColor = info.canMake ? 'var(--color-success)' : (info.percentage >= 60 ? 'var(--color-accent)' : 'var(--color-primary)');
    const missingText = info.missing.length > 0
      ? `<p class="missing-hint">不足: ${info.missing.map(m => m.name).join('・')}</p>`
      : '<p class="can-make-hint">✨ 今すぐ作れます！</p>';

    return `
      <div class="recipe-card" onclick="showRecipeDetailModal('${recipe.id}')">
        <div class="recipe-card-emoji">${recipe.emoji}</div>
        <div class="recipe-card-body">
          <div class="recipe-card-name">${escapeHtml(recipe.name)}</div>
          <div class="recipe-card-meta">
            <span class="category-tag">${recipe.category}</span>
            ${recipe.isCustom ? '<span class="custom-tag">カスタム</span>' : ''}
          </div>
          ${missingText}
          <div class="match-bar-mini">
            <div class="match-bar-mini-fill" style="width:${info.percentage}%;background:${pctColor}"></div>
          </div>
          <span class="match-pct-mini">${info.percentage}%</span>
        </div>
      </div>`;
  }

  let html = '';

  if (filter === 'all' || filter === 'can') {
    if (canMakeItems.length > 0) {
      html += `<div class="section-title can-make-title">✨ 今すぐ作れるメニュー (${canMakeItems.length}品)</div>`;
      html += `<div class="recipe-grid">${canMakeItems.map(renderCard).join('')}</div>`;
    }
  }

  if (filter === 'all' || filter === 'almost') {
    if (almostItems.length > 0) {
      html += `<div class="section-title almost-title">🛒 あと少しで作れるメニュー (${almostItems.length}品)</div>`;
      html += `<div class="recipe-grid">${almostItems.map(renderCard).join('')}</div>`;
    }
  }

  if (filter === 'all') {
    if (otherItems.length > 0) {
      html += `<div class="section-title other-title">📚 その他のメニュー (${otherItems.length}品)</div>`;
      html += `<div class="recipe-grid">${otherItems.map(renderCard).join('')}</div>`;
    }
  }

  container.innerHTML = html || `<div class="empty-state"><div class="empty-icon">🔍</div><p>該当なし</p></div>`;
}

// ==================== RENDER: SHOPPING TAB ====================
function renderShoppingTab() {
  const container = document.getElementById('shopping-content');
  if (!container) return;

  const unchecked = state.shoppingList.filter(i => !i.checked);
  const checked = state.shoppingList.filter(i => i.checked);

  if (state.shoppingList.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🛒</div>
        <p>買い物リストは空です</p>
        <p class="empty-hint">メニュー提案から不足食材を追加できます</p>
      </div>`;
    return;
  }

  function renderItem(item) {
    return `
      <div class="shopping-item ${item.checked ? 'checked' : ''}">
        <label class="shopping-check-label">
          <input type="checkbox" ${item.checked ? 'checked' : ''} onchange="toggleShoppingItem('${item.id}', this.checked)" />
          <span class="shopping-item-name">${escapeHtml(item.name)}</span>
        </label>
        <span class="shopping-item-qty">${item.quantity}${item.unit}</span>
        ${item.fromRecipe ? `<span class="shopping-from-recipe">📍 ${escapeHtml(item.fromRecipe)}</span>` : ''}
        <button class="btn-icon danger" onclick="deleteShoppingItem('${item.id}')">🗑️</button>
      </div>`;
  }

  let html = '';
  if (unchecked.length > 0) {
    html += `<div class="section-title">🛒 購入予定 (${unchecked.length}品)</div>`;
    html += `<div class="shopping-list">${unchecked.map(renderItem).join('')}</div>`;
  }
  if (checked.length > 0) {
    html += `
      <div class="section-title purchased-title">✅ 購入済み (${checked.length}品)</div>
      <div class="shopping-list">${checked.map(renderItem).join('')}</div>
      <div class="add-to-fridge-wrap">
        <button class="btn btn-success btn-block" onclick="movePurchasedToFridgeUI()">
          🧊 購入済みをまとめて冷蔵庫に追加
        </button>
      </div>`;
  }

  container.innerHTML = html;
}

function toggleShoppingItem(id, checked) {
  const item = state.shoppingList.find(i => i.id === id);
  if (item) { item.checked = checked; saveState(); renderShoppingTab(); }
}

function deleteShoppingItem(id) {
  state.shoppingList = state.shoppingList.filter(i => i.id !== id);
  saveState();
  renderShoppingTab();
}

function movePurchasedToFridgeUI() {
  const count = state.shoppingList.filter(i => i.checked).length;
  movePurchasedToFridge();
  renderFridgeTab();
  renderShoppingTab();
  renderSuggestTab();
  showToast(`${count} 品を冷蔵庫に追加しました！🧊`, 'success');
  switchTab('fridge');
}

function showAddShoppingModal() {
  const unitOptions = UNITS.map(u => `<option value="${u}">${u}</option>`).join('');
  const catOptions = INGREDIENT_CATEGORIES.map(c =>
    `<option value="${c}">${CATEGORY_EMOJIS[c]} ${c}</option>`
  ).join('');

  openModal(`
    <div class="modal-header">
      <h2>🛒 買い物アイテムを追加</h2>
      <button class="modal-close-btn" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label>食材名 <span class="required">*</span></label>
        <input type="text" id="sh-name" class="form-input" placeholder="例: 牛肉" />
      </div>
      <div class="form-group">
        <label>カテゴリ</label>
        <select id="sh-category" class="form-select">${catOptions}</select>
      </div>
      <div class="form-row">
        <div class="form-group flex-1">
          <label>数量</label>
          <input type="number" id="sh-qty" class="form-input" value="1" min="0" step="0.1" />
        </div>
        <div class="form-group flex-1">
          <label>単位</label>
          <select id="sh-unit" class="form-select">${unitOptions}</select>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" onclick="closeModal()">キャンセル</button>
      <button class="btn btn-primary" onclick="submitAddShopping()">追加する 🛒</button>
    </div>
  `);
  document.getElementById('sh-name').focus();
}

function submitAddShopping() {
  const name = document.getElementById('sh-name').value.trim();
  const category = document.getElementById('sh-category').value;
  const quantity = parseFloat(document.getElementById('sh-qty').value);
  const unit = document.getElementById('sh-unit').value;
  if (!name) { showToast('食材名を入力してください', 'error'); return; }
  addToShoppingList({ name, category, quantity, unit });
  closeModal();
  renderShoppingTab();
  showToast(`${name} を買い物リストに追加しました 🛒`, 'success');
}

// ==================== RENDER: LIBRARY TAB ====================
function renderLibraryTab() {
  const container = document.getElementById('library-content');
  if (!container) return;

  const filter = state.libraryFilter;
  const search = state.librarySearch.toLowerCase();

  let recipes = getAllRecipes();
  if (filter !== 'all') recipes = recipes.filter(r => r.category === filter);
  if (search) recipes = recipes.filter(r =>
    r.name.toLowerCase().includes(search) ||
    r.requiredIngredients.some(i => i.name.toLowerCase().includes(search))
  );

  if (recipes.length === 0) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">📚</div><p>レシピが見つかりません</p></div>`;
    return;
  }

  container.innerHTML = `<div class="recipe-grid">${recipes.map(recipe => {
    const info = getRecipeMatchInfo(recipe);
    return `
      <div class="recipe-card" onclick="showRecipeDetailModal('${recipe.id}')">
        <div class="recipe-card-emoji">${recipe.emoji}</div>
        <div class="recipe-card-body">
          <div class="recipe-card-name">${escapeHtml(recipe.name)}</div>
          <div class="recipe-card-meta">
            <span class="category-tag">${recipe.category}</span>
            ${recipe.isCustom ? '<span class="custom-tag">カスタム</span>' : ''}
          </div>
          <p class="recipe-desc-sm">${escapeHtml(recipe.description)}</p>
          <div class="match-bar-mini">
            <div class="match-bar-mini-fill" style="width:${info.percentage}%"></div>
          </div>
          <span class="match-pct-mini">${info.percentage}%</span>
        </div>
        ${recipe.isCustom ? `<button class="delete-recipe-btn" onclick="event.stopPropagation();deleteCustomRecipe('${recipe.id}')">🗑️</button>` : ''}
      </div>`;
  }).join('')}</div>`;
}

// ==================== TAB SWITCHING ====================
function switchTab(tab) {
  state.activeTab = tab;
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  const panel = document.getElementById(`panel-${tab}`);
  const btn = document.querySelector(`[data-tab="${tab}"]`);
  if (panel) panel.classList.add('active');
  if (btn) btn.classList.add('active');

  // Re-render the active tab
  if (tab === 'fridge') renderFridgeTab();
  else if (tab === 'suggest') renderSuggestTab();
  else if (tab === 'shopping') renderShoppingTab();
  else if (tab === 'library') renderLibraryTab();
}

// ==================== TOAST ====================
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('toast-show');
    setTimeout(() => {
      toast.classList.remove('toast-show');
      setTimeout(() => toast.remove(), 400);
    }, 2800);
  });
}

// ==================== INITIALIZATION ====================
function init() {
  loadState();

  // Nav clicks
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Modal overlay click to close
  document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
  });

  // Fridge search
  document.getElementById('fridge-search').addEventListener('input', (e) => {
    state.fridgeSearch = e.target.value;
    renderFridgeTab();
  });

  // Fridge category filter
  document.getElementById('fridge-cat-filter').addEventListener('change', (e) => {
    state.fridgeCategoryFilter = e.target.value;
    renderFridgeTab();
  });

  // Suggest filter
  document.getElementById('suggest-filter').addEventListener('change', (e) => {
    state.suggestFilter = e.target.value;
    renderSuggestTab();
  });

  // Library filter
  document.getElementById('library-filter').addEventListener('change', (e) => {
    state.libraryFilter = e.target.value;
    renderLibraryTab();
  });

  // Library search
  document.getElementById('library-search').addEventListener('input', (e) => {
    state.librarySearch = e.target.value;
    renderLibraryTab();
  });

  // Add ingredient button
  document.getElementById('btn-add-ingredient').addEventListener('click', () => showAddIngredientModal());

  // Bulk add button
  document.getElementById('btn-bulk-add').addEventListener('click', () => showBulkAddModal());

  // Add shopping item button
  document.getElementById('btn-add-shopping').addEventListener('click', () => showAddShoppingModal());

  // Add recipe button
  document.getElementById('btn-add-recipe').addEventListener('click', () => showAddRecipeModal());

  // Initial render
  switchTab('fridge');

  // Update badge on shopping tab nav
  updateShoppingBadge();
}

function updateShoppingBadge() {
  const badge = document.getElementById('shopping-badge');
  if (!badge) return;
  const count = state.shoppingList.filter(i => !i.checked).length;
  badge.textContent = count > 0 ? count : '';
  badge.style.display = count > 0 ? 'flex' : 'none';
}

document.addEventListener('DOMContentLoaded', init);
