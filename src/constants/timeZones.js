// 有効期限を「どの国の時刻で判定するか」の選択肢
// value はバックエンドに送るIANAタイムゾーンID（Javaの ZoneId.of でそのまま使える名前）
export const DEFAULT_TIME_ZONE = 'Asia/Tokyo';

export const TIME_ZONES = [
  { value: 'Asia/Tokyo', label: '日本（東京）' },
  { value: 'Asia/Seoul', label: '韓国（ソウル）' },
  { value: 'Asia/Shanghai', label: '中国（上海）' },
  { value: 'Asia/Singapore', label: 'シンガポール' },
  { value: 'Australia/Sydney', label: 'オーストラリア（シドニー）' },
  { value: 'Europe/London', label: 'イギリス（ロンドン）' },
  { value: 'Europe/Paris', label: 'フランス（パリ）' },
  { value: 'America/New_York', label: 'アメリカ東部（ニューヨーク）' },
  { value: 'America/Los_Angeles', label: 'アメリカ西部（ロサンゼルス）' },
  { value: 'UTC', label: '協定世界時（UTC）' },
];

// 'Asia/Tokyo' → '日本（東京）'。一覧にない名前はそのまま返す
export const timeZoneLabel = (value) =>
  TIME_ZONES.find((zone) => zone.value === value)?.label ?? value;
