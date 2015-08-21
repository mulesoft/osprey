// Originally based on: https://github.com/geraintluff/tv4/tree/master/lang
module.exports = {
  // INVALID_TYPE
  type: {
    'de': 'Ungültiger typ, erwartet wurde {schema}',
    'en': 'Invalid type, expected {schema}',
    'fr': 'Type invalide, {schema} attendu',
    'nb': 'Ugyldig type, forventet {schema}',
    'pl-PL': 'Niepoprawny typ, spodziewany {schema}',
    'pl-PT': 'Tipo inválido, esperava {schema}',
    'sv-SE': 'Otillåten typ, skall vara {schema}',
    'zh-CN': '当前类型不符合期望的类型 {schema}'
  },
  // STRING_PATTERN
  pattern: {
    'de': 'Zeichenkette entspricht nicht dem Muster: {schema}',
    'en': 'String does not match pattern: {schema}',
    'fr': 'Le texte ne correspond pas au motif: {schema}',
    'nb': 'Strengen samsvarer ikke med regulært uttrykk: {schema}',
    'pl-PL': 'Napis nie pasuje do wzoru: {schema}',
    'pl-PT': 'A "string" não corresponde ao modelo: {schema}',
    'sv-SE': 'Texten har fel format: {schema}',
    'zh-CN': '字符串不匹配模式: {schema}'
  },
  // ARRAY_LENGTH_SHORT
  minItems: {
    'de': 'Array zu kurz, minimum {schema}',
    'en': 'Array is too short, minimum {schema}',
    'fr': 'Le tableau est trop court, minimum {schema}',
    'nb': 'Listen er for kort, minst {schema}',
    'pl-PL': 'Tablica ma za mało elementów, minimum {schema}',
    'pl-PT': 'A "array" é muito curta, mínimo {schema}',
    'sv-SE': 'Listan är för kort, ska minst vara {schema}',
    'zh-CN': '数组长度太短, 最小长度 {schema}'
  },
  // ARRAY_LENGTH_LONG
  maxItems: {
    'de': 'Array zu lang, maximum {schema}',
    'en': 'Array is too long, maximum {schema}',
    'fr': 'Le tableau est trop long, maximum {schema}',
    'nb': 'Listen er for lang, maksimalt {schema}',
    'pl-PL': 'Tablica ma za dużo elementów, maximum {schema}',
    'pl-PT': 'A "array" é muito longa, máximo {schema}',
    'sv-SE': 'Listan är för lång, ska högst vara {schema}',
    'zh-CN': '数组长度太长, 最大长度 {schema}'
  },
  // STRING_LENGTH_SHORT
  minLength: {
    'de': 'Zeichenkette zu kurz, minimum {schema}',
    'en': 'String is too short, minimum {schema}',
    'fr': 'Le texte est trop court, minimum {schema}',
    'nb': 'Strengen er for kort, minst {schema}',
    'pl-PL': 'Napis jest za krótki, minimum {schema}',
    'pl-PT': 'A "string" é muito curta, mínimo {schema}',
    'sv-SE': 'Texten är för kort, ska vara minst {schema} tecken',
    'zh-CN': '字符串太短, 最少 {schema} 个'
  },
  // STRING_LENGTH_LONG
  maxLength: {
    'de': 'Zeichenkette zu lang, maximum {schema}',
    'en': 'String is too long, maximum {schema}',
    'fr': 'Le texte est trop long, maximum {schema}',
    'nb': 'Strengen er for lang, maksimalt {schema}',
    'pl-PL': 'Napis jest za długi, maksimum {schema}',
    'pl-PT': 'A "string" é muito longa, máximo {schema}',
    'sv-SE': 'Texten är för lång, ska vara högst {schema}',
    'zh-CN': '字符串太长, 最多 {schema} 个'
  },
  // OBJECT_PROPERTIES_MINIMUM
  minProperties: {
    'de': 'Zu wenige Attribute definiert, minimum {schema}',
    'en': 'Too few properties defined, minimum {schema}',
    'fr': 'Pas assez de propriétés définies, minimum {schema}',
    'nb': 'For få variabler definert, minst {schema} er forventet',
    'pl-PL': 'Za mało zdefiniowanych pól, minimum {schema}',
    'pl-PT': 'Poucas propriedades definidas, mínimo {schema}',
    'sv-SE': 'För få parametrar, ska minst vara {schema}',
    'zh-CN': '字段数过少, 最少 {schema} 个'
  },
  // OBJECT_PROPERTIES_MAXIMUM
  maxProperties: {
    'de': 'Zu viele Attribute definiert, maximum {schema}',
    'en': 'Too many properties defined, maximum {schema}',
    'fr': 'Trop de propriétés définies, maximum {schema}',
    'nb': 'For mange variabler definert, makismalt {schema} er tillatt',
    'pl-PL': 'Za dużo zdefiniowanych pól, maksimum {schema}',
    'pl-PT': 'Muitas propriedades definidas, máximo {schema}',
    'sv-SE': 'För många parametrar, får högst vara {schema}',
    'zh-CN': '字段数过多, 最多 {schema} 个'
  },
  // NUMBER_MINIMUM
  minimum: {
    'de': 'Wert {data} ist kleiner als das Minimum {schema}',
    'en': 'Value {data} is less than minimum {schema}',
    'fr': 'La valeur {data} est inférieure au minimum {schema}',
    'nb': 'Verdien {data} er mindre enn minsteverdi {schema}',
    'pl-PL': 'Wartość {data} jest mniejsza niż {schema}',
    'pl-PT': 'O valor {data} é menor que o mínimo {schema}',
    'sv-SE': 'Värdet {data} får inte vara mindre än {schema}',
    'zh-CN': '数值 {data} 小于最小值 {schema}'
  },
  // NUMBER_MAXIMUM
  maximum: {
    'de': 'Wert {data} ist größer als das Maximum {schema}',
    'en': 'Value {data} is greater than maximum {schema}',
    'fr': 'La valeur {data} est supérieure au maximum {schema}',
    'nb': 'Verdien {data} er større enn maksimalverdi {schema}',
    'pl-PL': 'Wartość {data} jest większa niż {schema}',
    'pl-PT': 'O valor {data} é maior que o máximo {schema}',
    'sv-SE': 'Värdet {data} får inte vara större än {schema}',
    'zh-CN': '数值 {data} 是更大于最大值 {schema}'
  },
  // NUMBER_MULTIPLE_OF
  multipleOf: {
    'de': 'Wert {data} ist kein Vielfaches von {schema}',
    'en': 'Value {data} is not a multiple of {schema}',
    'fr': 'La valeur {data} n\'est pas un multiple de {schema}',
    'nb': 'Verdien {data} er ikke et multiplum av {schema}',
    'pl-PL': 'Wartość {data} nie jest wielokrotnością {schema}',
    'pl-PT': 'O valor {data} não é um múltiplo de {schema}',
    'sv-SE': 'Värdet {data} är inte en multipel av {schema}',
    'zh-CN': '数值 {data} 不是 {schema} 的倍数'
  },
  // NOT_PASSED
  not: {
    'de': 'Daten stimmen mit dem "not" Schema überein',
    'en': 'Data matches schema from "not"',
    'fr': 'La donnée correspond au schema de "not"',
    'nb': 'Data samsvarer med skjema fra "not"',
    'pl-PL': 'Dane pasują do wzoru z sekcji "not"',
    'pl-PT': 'Os dados correspondem a um esquema de "not"',
    'sv-SE': 'Värdet matchar schemat från "not"',
    'zh-CN': '数据不应匹配以下模式 ("not")'
  },
  // OBJECT_REQUIRED
  required: {
    'de': 'Notwendiges Attribut fehlt: {dataPath}',
    'en': 'Missing required property: {dataPath}',
    'fr': 'Propriété requise manquante: {dataPath}',
    'nb': 'Mangler obligatorisk variabel: {dataPath}',
    'pl-PL': 'Brakuje wymaganego pola: {dataPath}',
    'pl-PT': 'Propriedade necessária em falta: {dataPath}',
    'sv-SE': 'Egenskap saknas: {dataPath}',
    'zh-CN': '缺少必要字段: {dataPath}'
  },
  // ENUM_MISMATCH
  enum: {
    'de': 'Notwendiges Attribut fehlt: {dataPath}',
    'en': 'No enum match for: {dataPath}',
    'fr': 'Aucune valeur correspondante (enum) pour: {dataPath}',
    'nb': 'Ingen samsvarende enum verdi for: {dataPath}',
    'pl-PL': 'Żadna predefiniowana wartośc nie pasuje do: {dataPath}',
    'pl-PT': 'Nenhuma correspondência "enum" para: {dataPath}',
    'sv-SE': 'Otillåtet värde: {dataPath}',
    'zh-CN': '{dataPath} 不是有效的枚举类型取值'
  },
  // FORMAT_CUSTOM
  format: {
    'en': 'Format validation failed ({message})',
    'fr': 'Échec de validation du format ({message})',
    'nb': 'Formatteringen stemmer ikke ({message})',
    'pl-PL': 'Błąd zgodności z formatem ({message})',
    'pl-PT': 'A validação do formato falhou ({message})',
    'sv-SE': 'Misslyckad validering ({message})',
    'zh-CN': '格式校验失败 ({message})'
  },
  // ARRAY_UNIQUE
  uniqueItems: {
    'de': 'Array Einträge nicht eindeutig',
    'en': 'Array items are not unique',
    'fr': 'Des éléments du tableau ne sont pas uniques',
    'nb': 'Elementene er ikke unike',
    'pl-PL': 'Elementy tablicy nie są unikalne',
    'pl-PT': 'Os itens da "array" não são únicos',
    'sv-SE': 'Listvärden är inte unika',
    'zh-CN': '数组元素不唯一'
  },
  // ARRAY_ADDITIONAL_ITEMS
  additionalItems: {
    'de': 'Zusätzliche Einträge nicht erlaubt',
    'en': 'Additional items not allowed',
    'fr': 'Éléments additionnels non autorisés',
    'nb': 'Tillegselementer er ikke tillatt',
    'pl-PL': 'Dodatkowe elementy są niedozwolone',
    'pl-PT': 'Não são permitidos itens adicionais',
    'sv-SE': 'Extra värden är inte tillåtna',
    'zh-CN': '不允许多余的元素'
  },
  // OBJECT_ADDITIONAL_PROPERTIES
  additionalProperties: {
    'de': 'Zusätzliche Attribute nicht erlaubt',
    'en': 'Additional properties not allowed',
    'fr': 'Propriétés additionnelles non autorisées',
    'nb': 'Tilleggsvariabler er ikke tillatt',
    'pl-PL': 'Dodatkowe pola są niedozwolone',
    'pl-PT': 'Não são permitidas propriedades adicionais',
    'sv-SE': 'Extra parametrar är inte tillåtna',
    'zh-CN': '不允许多余的字段'
  },
  // ONE_OF_MISSING
  oneOf: {
    'de': 'Daten stimmen nicht überein mit einem der Schemas von "oneOf"',
    'en': 'Data does not match any schemas from "oneOf"',
    'fr': 'La donnée ne correspond à aucun schema de "oneOf"',
    'nb': 'Data samsvarer ikke med noe skjema fra "oneOf"',
    'pl-PL': 'Dane nie pasują do żadnego wzoru z sekcji "oneOf"',
    'pl-PT': 'Os dados não correspondem a nenhum esquema de "oneOf"',
    'sv-SE': 'Värdet matchar inget av schemana "oneOf"',
    'zh-CN': '数据不符合以下任何一个模式 ("oneOf")'
  },
  // OBJECT_DEPENDENCY_KEY
  dependencies: {
    'de': 'bhängigkeit fehlt - Schlüssel nicht vorhanden',
    'en': 'Dependency failed - key must exist',
    'fr': 'Echec de dépendance - la clé doit exister',
    'pl-PL': 'Błąd zależności - klucz musi istnieć',
    'pl-PT': 'Uma dependência falhou - tem de existir uma chave',
    'sv-SE': 'Saknar beroende - saknad nyckel',
    'zh-CN': '依赖失败 - 缺少键'
  }
}
