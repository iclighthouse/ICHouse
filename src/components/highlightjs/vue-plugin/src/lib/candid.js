function candid(hljs) {
  const BUILT_INS = [
    'text',
    'blob',
    'nat',
    'nat8',
    'nat16',
    'nat32',
    'nat64',
    'int',
    'int8',
    'int16',
    'int32',
    'int64',
    'float',
    'float32',
    'float64',
    'bool',
    'null',
    'vec',
    'opt',
    'record',
    'variant',
    'func',
    'principal',
    'reserved',
    'empty',
    'query',
    'call',
    'oneway'
  ];
  const KWS = ['import', 'type', 'service'];
  const KEYWORDS = {
    keyword: KWS,
    built_in: BUILT_INS
  };
  return {
    name: 'candid',
    aliases: ['candid'],
    keywords: KEYWORDS,
    illegal: '</',
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      {
        className: 'string',
        variants: [
          hljs.QUOTE_STRING_MODE,
          hljs.APOS_STRING_MODE,
          {
            begin: '`',
            end: '`'
          }
        ]
      }
    ]
  };
}

module.exports = candid;
