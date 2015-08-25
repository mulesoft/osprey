var compile = require('dot').compile

// Originally based on: https://github.com/geraintluff/tv4/tree/master/lang
module.exports = {
  // INVALID_TYPE
  type: {
    'de': compile('Ungültiger typ, erwartet wurde {{=it.schema}}'),
    'en': compile('Invalid type, expected {{=it.schema}}'),
    'fr': compile('Type invalide, {{=it.schema}} attendu'),
    'nb': compile('Ugyldig type, forventet {{=it.schema}}'),
    'pl-PL': compile('Niepoprawny typ, spodziewany {{=it.schema}}'),
    'pl-PT': compile('Tipo inválido, esperava {{=it.schema}}'),
    'sv-SE': compile('Otillåten typ, skall vara {{=it.schema}}'),
    'zh-CN': compile('当前类型不符合期望的类型 {{=it.schema}}')
  },
  // STRING_PATTERN
  pattern: {
    'de': compile('Zeichenkette entspricht nicht dem Muster: {{=it.schema}}'),
    'en': compile('String does not match pattern: {{=it.schema}}'),
    'fr': compile('Le texte ne correspond pas au motif: {{=it.schema}}'),
    'nb': compile('Strengen samsvarer ikke med regulært uttrykk: {{=it.schema}}'),
    'pl-PL': compile('Napis nie pasuje do wzoru: {{=it.schema}}'),
    'pl-PT': compile('A "string" não corresponde ao modelo: {{=it.schema}}'),
    'sv-SE': compile('Texten har fel format: {{=it.schema}}'),
    'zh-CN': compile('字符串不匹配模式: {{=it.schema}}')
  },
  // ARRAY_LENGTH_SHORT
  minItems: {
    'de': compile('Array zu kurz, minimum {{=it.schema}}'),
    'en': compile('Array is too short, minimum {{=it.schema}}'),
    'fr': compile('Le tableau est trop court, minimum {{=it.schema}}'),
    'nb': compile('Listen er for kort, minst {{=it.schema}}'),
    'pl-PL': compile('Tablica ma za mało elementów, minimum {{=it.schema}}'),
    'pl-PT': compile('A "array" é muito curta, mínimo {{=it.schema}}'),
    'sv-SE': compile('Listan är för kort, ska minst vara {{=it.schema}}'),
    'zh-CN': compile('数组长度太短, 最小长度 {{=it.schema}}')
  },
  // ARRAY_LENGTH_LONG
  maxItems: {
    'de': compile('Array zu lang, maximum {{=it.schema}}'),
    'en': compile('Array is too long, maximum {{=it.schema}}'),
    'fr': compile('Le tableau est trop long, maximum {{=it.schema}}'),
    'nb': compile('Listen er for lang, maksimalt {{=it.schema}}'),
    'pl-PL': compile('Tablica ma za dużo elementów, maximum {{=it.schema}}'),
    'pl-PT': compile('A "array" é muito longa, máximo {{=it.schema}}'),
    'sv-SE': compile('Listan är för lång, ska högst vara {{=it.schema}}'),
    'zh-CN': compile('数组长度太长, 最大长度 {{=it.schema}}')
  },
  // STRING_LENGTH_SHORT
  minLength: {
    'de': compile('Zeichenkette zu kurz, minimum {{=it.schema}}'),
    'en': compile('String is too short, minimum {{=it.schema}}'),
    'fr': compile('Le texte est trop court, minimum {{=it.schema}}'),
    'nb': compile('Strengen er for kort, minst {{=it.schema}}'),
    'pl-PL': compile('Napis jest za krótki, minimum {{=it.schema}}'),
    'pl-PT': compile('A "string" é muito curta, mínimo {{=it.schema}}'),
    'sv-SE': compile('Texten är för kort, ska vara minst {{=it.schema}} tecken'),
    'zh-CN': compile('字符串太短, 最少 {{=it.schema}} 个')
  },
  // STRING_LENGTH_LONG
  maxLength: {
    'de': compile('Zeichenkette zu lang, maximum {{=it.schema}}'),
    'en': compile('String is too long, maximum {{=it.schema}}'),
    'fr': compile('Le texte est trop long, maximum {{=it.schema}}'),
    'nb': compile('Strengen er for lang, maksimalt {{=it.schema}}'),
    'pl-PL': compile('Napis jest za długi, maksimum {{=it.schema}}'),
    'pl-PT': compile('A "string" é muito longa, máximo {{=it.schema}}'),
    'sv-SE': compile('Texten är för lång, ska vara högst {{=it.schema}}'),
    'zh-CN': compile('字符串太长, 最多 {{=it.schema}} 个')
  },
  // OBJECT_PROPERTIES_MINIMUM
  minProperties: {
    'de': compile('Zu wenige Attribute definiert, minimum {{=it.schema}}'),
    'en': compile('Too few properties defined, minimum {{=it.schema}}'),
    'fr': compile('Pas assez de propriétés définies, minimum {{=it.schema}}'),
    'nb': compile('For få variabler definert, minst {{=it.schema}} er forventet'),
    'pl-PL': compile('Za mało zdefiniowanych pól, minimum {{=it.schema}}'),
    'pl-PT': compile('Poucas propriedades definidas, mínimo {{=it.schema}}'),
    'sv-SE': compile('För få parametrar, ska minst vara {{=it.schema}}'),
    'zh-CN': compile('字段数过少, 最少 {{=it.schema}} 个')
  },
  // OBJECT_PROPERTIES_MAXIMUM
  maxProperties: {
    'de': compile('Zu viele Attribute definiert, maximum {{=it.schema}}'),
    'en': compile('Too many properties defined, maximum {{=it.schema}}'),
    'fr': compile('Trop de propriétés définies, maximum {{=it.schema}}'),
    'nb': compile('For mange variabler definert, makismalt {{=it.schema}} er tillatt'),
    'pl-PL': compile('Za dużo zdefiniowanych pól, maksimum {{=it.schema}}'),
    'pl-PT': compile('Muitas propriedades definidas, máximo {{=it.schema}}'),
    'sv-SE': compile('För många parametrar, får högst vara {{=it.schema}}'),
    'zh-CN': compile('字段数过多, 最多 {{=it.schema}} 个')
  },
  // NUMBER_MINIMUM
  minimum: {
    'de': compile('Wert {{=it.data}} ist kleiner als das Minimum {{=it.schema}}'),
    'en': compile('Value {{=it.data}} is less than minimum {{=it.schema}}'),
    'fr': compile('La valeur {{=it.data}} est inférieure au minimum {{=it.schema}}'),
    'nb': compile('Verdien {{=it.data}} er mindre enn minsteverdi {{=it.schema}}'),
    'pl-PL': compile('Wartość {{=it.data}} jest mniejsza niż {{=it.schema}}'),
    'pl-PT': compile('O valor {{=it.data}} é menor que o mínimo {{=it.schema}}'),
    'sv-SE': compile('Värdet {{=it.data}} får inte vara mindre än {{=it.schema}}'),
    'zh-CN': compile('数值 {{=it.data}} 小于最小值 {{=it.schema}}')
  },
  // NUMBER_MAXIMUM
  maximum: {
    'de': compile('Wert {{=it.data}} ist größer als das Maximum {{=it.schema}}'),
    'en': compile('Value {{=it.data}} is greater than maximum {{=it.schema}}'),
    'fr': compile('La valeur {{=it.data}} est supérieure au maximum {{=it.schema}}'),
    'nb': compile('Verdien {{=it.data}} er større enn maksimalverdi {{=it.schema}}'),
    'pl-PL': compile('Wartość {{=it.data}} jest większa niż {{=it.schema}}'),
    'pl-PT': compile('O valor {{=it.data}} é maior que o máximo {{=it.schema}}'),
    'sv-SE': compile('Värdet {{=it.data}} får inte vara större än {{=it.schema}}'),
    'zh-CN': compile('数值 {{=it.data}} 是更大于最大值 {{=it.schema}}')
  },
  // NUMBER_MULTIPLE_OF
  multipleOf: {
    'de': compile('Wert {{=it.data}} ist kein Vielfaches von {{=it.schema}}'),
    'en': compile('Value {{=it.data}} is not a multiple of {{=it.schema}}'),
    'fr': compile('La valeur {{=it.data}} n\'est pas un multiple de {{=it.schema}}'),
    'nb': compile('Verdien {{=it.data}} er ikke et multiplum av {{=it.schema}}'),
    'pl-PL': compile('Wartość {{=it.data}} nie jest wielokrotnością {{=it.schema}}'),
    'pl-PT': compile('O valor {{=it.data}} não é um múltiplo de {{=it.schema}}'),
    'sv-SE': compile('Värdet {{=it.data}} är inte en multipel av {{=it.schema}}'),
    'zh-CN': compile('数值 {{=it.data}} 不是 {{=it.schema}} 的倍数')
  },
  // NOT_PASSED
  not: {
    'de': compile('Daten stimmen mit dem "not" Schema überein'),
    'en': compile('Data matches schema from "not"'),
    'fr': compile('La donnée correspond au schema de "not"'),
    'nb': compile('Data samsvarer med skjema fra "not"'),
    'pl-PL': compile('Dane pasują do wzoru z sekcji "not"'),
    'pl-PT': compile('Os dados correspondem a um esquema de "not"'),
    'sv-SE': compile('Värdet matchar schemat från "not"'),
    'zh-CN': compile('数据不应匹配以下模式 ("not")')
  },
  // OBJECT_REQUIRED
  required: {
    'de': compile('Notwendiges Attribut fehlt: {{=it.dataPath}}'),
    'en': compile('Missing required property: {{=it.dataPath}}'),
    'fr': compile('Propriété requise manquante: {{=it.dataPath}}'),
    'nb': compile('Mangler obligatorisk variabel: {{=it.dataPath}}'),
    'pl-PL': compile('Brakuje wymaganego pola: {{=it.dataPath}}'),
    'pl-PT': compile('Propriedade necessária em falta: {{=it.dataPath}}'),
    'sv-SE': compile('Egenskap saknas: {{=it.dataPath}}'),
    'zh-CN': compile('缺少必要字段: {{=it.dataPath}}')
  },
  // ENUM_MISMATCH
  enum: {
    'de': compile('Notwendiges Attribut fehlt: {{=it.schema.join(", ")}}'),
    'en': compile('No enum match for: {{=it.schema.join(", ")}}'),
    'fr': compile('Aucune valeur correspondante (enum) pour: {{=it.schema.join(", ")}}'),
    'nb': compile('Ingen samsvarende enum verdi for: {{=it.schema.join(", ")}}'),
    'pl-PL': compile('Żadna predefiniowana wartośc nie pasuje do: {{=it.schema.join(", ")}}'),
    'pl-PT': compile('Nenhuma correspondência "enum" para: {{=it.schema.join(", ")}}'),
    'sv-SE': compile('Otillåtet värde: {{=it.schema.join(", ")}}'),
    'zh-CN': compile('{{=it.schema.join(", ")}} 不是有效的枚举类型取值')
  },
  // FORMAT_CUSTOM
  format: {
    'en': compile('Format validation failed ({{=it.message}})'),
    'fr': compile('Échec de validation du format ({{=it.message}})'),
    'nb': compile('Formatteringen stemmer ikke ({{=it.message}})'),
    'pl-PL': compile('Błąd zgodności z formatem ({{=it.message}})'),
    'pl-PT': compile('A validação do formato falhou ({{=it.message}})'),
    'sv-SE': compile('Misslyckad validering ({{=it.message}})'),
    'zh-CN': compile('格式校验失败 ({{=it.message}})')
  },
  // ARRAY_UNIQUE
  uniqueItems: {
    'de': compile('Array Einträge nicht eindeutig'),
    'en': compile('Array items are not unique'),
    'fr': compile('Des éléments du tableau ne sont pas uniques'),
    'nb': compile('Elementene er ikke unike'),
    'pl-PL': compile('Elementy tablicy nie są unikalne'),
    'pl-PT': compile('Os itens da "array" não são únicos'),
    'sv-SE': compile('Listvärden är inte unika'),
    'zh-CN': compile('数组元素不唯一')
  },
  // ARRAY_ADDITIONAL_ITEMS
  additionalItems: {
    'de': compile('Zusätzliche Einträge nicht erlaubt'),
    'en': compile('Additional items not allowed'),
    'fr': compile('Éléments additionnels non autorisés'),
    'nb': compile('Tillegselementer er ikke tillatt'),
    'pl-PL': compile('Dodatkowe elementy są niedozwolone'),
    'pl-PT': compile('Não são permitidos itens adicionais'),
    'sv-SE': compile('Extra värden är inte tillåtna'),
    'zh-CN': compile('不允许多余的元素')
  },
  // OBJECT_ADDITIONAL_PROPERTIES
  additionalProperties: {
    'de': compile('Zusätzliche Attribute nicht erlaubt'),
    'en': compile('Additional properties not allowed'),
    'fr': compile('Propriétés additionnelles non autorisées'),
    'nb': compile('Tilleggsvariabler er ikke tillatt'),
    'pl-PL': compile('Dodatkowe pola są niedozwolone'),
    'pl-PT': compile('Não são permitidas propriedades adicionais'),
    'sv-SE': compile('Extra parametrar är inte tillåtna'),
    'zh-CN': compile('不允许多余的字段')
  },
  // ONE_OF_MISSING
  oneOf: {
    'de': compile('Daten stimmen nicht überein mit einem der Schemas von "oneOf"'),
    'en': compile('Data does not match any schemas from "oneOf"'),
    'fr': compile('La donnée ne correspond à aucun schema de "oneOf"'),
    'nb': compile('Data samsvarer ikke med noe skjema fra "oneOf"'),
    'pl-PL': compile('Dane nie pasują do żadnego wzoru z sekcji "oneOf"'),
    'pl-PT': compile('Os dados não correspondem a nenhum esquema de "oneOf"'),
    'sv-SE': compile('Värdet matchar inget av schemana "oneOf"'),
    'zh-CN': compile('数据不符合以下任何一个模式 ("oneOf")')
  },
  // OBJECT_DEPENDENCY_KEY
  dependencies: {
    'de': compile('bhängigkeit fehlt - Schlüssel nicht vorhanden'),
    'en': compile('Dependency failed - key must exist'),
    'fr': compile('Echec de dépendance - la clé doit exister'),
    'pl-PL': compile('Błąd zależności - klucz musi istnieć'),
    'pl-PT': compile('Uma dependência falhou - tem de existir uma chave'),
    'sv-SE': compile('Saknar beroende - saknad nyckel'),
    'zh-CN': compile('依赖失败 - 缺少键')
  }
}
