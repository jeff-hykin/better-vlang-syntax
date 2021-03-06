grammar[:strings] = [
    PatternRange.new(
        start_pattern: Pattern.new(
            /`/
        ),
        end_pattern: Pattern.new(
            match: /`/
        ),
        tag_as: "string.quoted.rune",
        includes: [
            "#string-escape:char,
            {
                "include": "#string-interpolation"
            },
            {
                "include": "#string-placeholder"
            }
        ]
    ),
    PatternRange.new(
        start_pattern: Pattern.new(
            /(r)'/
        ),
        "beginCaptures": {
            "1": {
                tag_as: "storage.type.string",
            }
        },
        end_pattern: Pattern.new(
            match: /'/
        ),
        tag_as: "string.quoted.raw",
        includes: [
            "#strin:interpolation,
            {
                "include": "#string-placeholder"
            }
        ]
    ),
    PatternRange.new(
        start_pattern: Pattern.new(
            /(r)\"/
        ),
        "beginCaptures": {
            "1": {
                tag_as: "storage.type.string",
            }
        },
        end_pattern: Pattern.new(
            match: /\"/
        ),
        tag_as: "string.quoted.raw",
        includes: [
            "#strin:interpolation,
            {
                "include": "#string-placeholder"
            }
        ]
    ),
    PatternRange.new(
        start_pattern: Pattern.new(
            /(c?)'/
        ),
        "beginCaptures": {
            "1": {
                tag_as: "storage.type.string",
            }
        },
        end_pattern: Pattern.new(
            match: /'/
        ),
        tag_as: "string.quoted",
        includes: [
            "#string-escape:char,
            {
                "include": "#string-interpolation"
            },
            {
                "include": "#string-placeholder"
            }
        ]
    ),
    PatternRange.new(
        start_pattern: Pattern.new(
            /(c?)\"/
        ),
        "beginCaptures": {
            "1": {
                tag_as: "storage.type.string",
            }
        },
        end_pattern: Pattern.new(
            match: /\"/
        ),
        tag_as: "string.quoted",
        includes: [
            "#string-escape:char,
            {
                "include": "#string-interpolation"
            },
            {
                "include": "#string-placeholder"
            }
        ]
    )
]
grammar[:string_escaped_char] = [
    Pattern.new(
        tag_as: "constant.character.escape",
        match: /\\\([0-7]{3}|[\$abfnrtv\\\\'\"]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|U[0-9a-fA-F]{8})/,
    ),
    Pattern.new(
        tag_as: "invalid.illegal.unknown-escape",
        match: /\\\[^0-7\$xuUabfnrtv\\'\"]/,
    )
]
grammar[:string_interpolation] = Pattern.new(
    tag_as: "meta.string.interpolation",
    match: /(\$([\w.]+|\\{.*?\\}))/,
    "captures": {
        "1": {
            includes: [
                {
                    tag_as: "invalid.illegal",
                    match: /\$\d[\.\w]+/,
                },
                {
                    tag_as: "variable.other.interpolated",
                    match: /\$([\.\w]+|\\{.*?\\})/,
                }
            ]
        }
    }
)
grammar[:string_placeholder] = Pattern.new(
    match: /%(\[\d+\])?([\+#\-0\\x20]{,2}((\d+|\*)?(\.?(\d+|\*|(\[\d+\])\*?)?(\[\d+\])?)?))?[vT%tbcdoqxXUbeEfFgGsp]/,
    tag_as: "constant.other.placeholder",
)
grammar[:illegal_name] = Pattern.new(
    match: /\d\w+/,
    tag_as: "invalid.illegal",
)


grammar[:generic] = [
    Pattern.new(
        tag_as: "meta.definition.generic",
        match: /(?<=[\w\s+])(\<)(\w+)(\>)/,
        "captures": {
            "1": {
                tag_as: "punctuation.definition.bracket.angle.begin",
            },
            "2": {
                includes: [
                    {
                        "include": "#illegal-name"
                    },
                    {
                        match: /\w+/,
                        tag_as: "entity.name.generic",
                    }
                ]
            },
            "3": {
                tag_as: "punctuation.definition.bracket.angle.end",
            }
        }
    )
]
grammar[:function_decl] = Pattern.newRange(
    tag_as: "meta.definition.function",
    start_pattern: Pattern.new(
        /^\s*(pub)?\s*(fn)\s+/
    ),
    "beginCaptures": {
        "1": {
            tag_as: "storage.modifier",
        },
        "2": {
            tag_as: "keyword.function",
        }
    },
    end_pattern: Pattern.new(
        match: /(?:(?:C\.)?)(\w+)\s*((?<=[\w\s+])(\<)(\w+)(\>))?/
    ),
    "endCaptures": {
        "1": {
            includes: [
                "#illega:name,
                {
                    match: /\w+/,
                    tag_as: "entity.name.function",
                }
            ]
        },
        "2": {
            includes: [
                :generic,
            ]
        }
    }
)
grammar[:function_extend_decl] = Pattern.new(
    tag_as: "meta.definition.function",
    match: /^\s*(pub)?\s*(fn)\s*(\()([^\)]*)(\))\s*(?:(?:C\.)?)(\w+)\s*((?<=[\w\s+])(\<)(\w+)(\>))?/,
    "captures": {
        "1": {
            tag_as: "storage.modifier",
        },
        "2": {
            tag_as: "keyword.function",
        },
        "3": {
            tag_as: "punctuation.definition.bracket.round.begin",
        },
        "4": {
            includes: [
                :brackets,
                {
                    "include": "#storage"
                },
                {
                    "include": "#generic"
                },
                {
                    "include": "#types"
                },
                {
                    "include": "#punctuation"
                }
            ]
        },
        "5": {
            tag_as: "punctuation.definition.bracket.round.end",
        },
        "6": {
            includes: [
                "#illega:name,
                {
                    match: /\w+/,
                    tag_as: "entity.name.function",
                }
            ]
        },
        "7": {
            includes: [
                :generic,
            ]
        }
    }
)
grammar[:function_limited_overload_decl] = Pattern.new(
    tag_as: "meta.definition.function",
    match: /^\s*(pub)?\s*(fn)\s*(\()([^\)]*)(\))\s*([\+\-\*\/])?\s*(\()([^\)]*)(\))\s*(?:(?:C\.)?)(\w+)/,
    "captures": {
        "1": {
            tag_as: "storage.modifier",
        },
        "2": {
            tag_as: "keyword.function",
        },
        "3": {
            tag_as: "punctuation.definition.bracket.round.begin",
        },
        "4": {
            includes: [
                :brackets,
                {
                    "include": "#storage"
                },
                {
                    "include": "#generic"
                },
                {
                    "include": "#types"
                },
                {
                    "include": "#punctuation"
                }
            ]
        },
        "5": {
            tag_as: "punctuation.definition.bracket.round.end",
        },
        "6": {
            includes: [
                :operators,
            ]
        },
        "7": {
            tag_as: "punctuation.definition.bracket.round.begin",
        },
        "8": {
            includes: [
                :brackets,
                {
                    "include": "#storage"
                },
                {
                    "include": "#generic"
                },
                {
                    "include": "#types"
                },
                {
                    "include": "#punctuation"
                }
            ]
        },
        "9": {
            tag_as: "punctuation.definition.bracket.round.end",
        },
        "10": {
            includes: [
                "#illega:name,
                {
                    match: /\w+/,
                    tag_as: "entity.name.function",
                }
            ]
        }
    }
)
grammar[:function_exist] = Pattern.new(
    tag_as: "meta.support.function",
    match: /(\w+)((?<=[\w\s+])(\<)(\w+)(\>))?(?=\s*\()/,
    "captures": {
        "0": {
            tag_as: "meta.function.call",
        },
        "1": {
            includes: [
                "#illega:name,
                {
                    match: /\w+/,
                    tag_as: "entity.name.function",
                }
            ]
        },
        "2": {
            includes: [
                :generic,
            ]
        }
    }
)
grammar[:type] = Pattern.new(
    tag_as: "meta.definition.type",
    match: /^\s*(?:(pub)?\s+)?(type)\s+(\w*)\s+(?:\w+\.+)?(\w*)/,
    "captures": {
        "1": {
            tag_as: "storage.modifier.$match",
        },
        "2": {
            tag_as: "storage.type.type",
        },
        "3": {
            includes: [
                "#illega:name,
                {
                    "include": "#types"
                },
                {
                    tag_as: "entity.name.type",
                    match: /\w+/,
                }
            ]
        },
        "4": {
            includes: [
                "#illega:name,
                {
                    "include": "#types"
                },
                {
                    tag_as: "entity.name.type",
                    match: /\w+/,
                }
            ]
        }
    }
)
grammar[:enum] = Pattern.new(
    tag_as: "meta.definition.enum",
    match: /^\s*(?:(pub)?\s+)?(enum)\s+(?:\w+\.)?(\w*)/,
    "captures": {
        "1": {
            tag_as: "storage.modifier.$match",
        },
        "2": {
            tag_as: "storage.type.enum",
        },
        "3": {
            tag_as: "entity.name.enum",
        }
    }
)
grammar[:interface] = Pattern.new(
    tag_as: "meta.definition.interface",
    match: /^\s*(?:(pub)?\s+)?(interface)\s+(\w*)/,
    "captures": {
        "1": {
            tag_as: "storage.modifier.$match",
        },
        "2": {
            tag_as: "keyword.interface",
        },
        "3": {
            includes: [
                "#illega:name,
                {
                    tag_as: "entity.name.interface",
                    match: /\w+/,
                }
            ]
        }
    }
)
grammar[:struct] = [
        Pattern.new({
            tag_as: "meta.definition.struct",
            start_pattern: Pattern.new(
                /^\s*(?:(mut|pub(?:\s+mut)?|__global)\s+)?(struct|union)\s+([\w.]+)\s*|({)/
            ),
            "beginCaptures": {
                "1": {
                    tag_as: "storage.modifier.$match",
                },
                "2": {
                    tag_as: "storage.type.struct",
                },
                "3": {
                    tag_as: "entity.name.struct",
                },
                "4": {
                    tag_as: "punctuation.definition.bracket.curly.begin",
                }
            },
            end_pattern: Pattern.new(
                match: /\s*|(})/
            ),
            "endCaptures": {
                "1": {
                    tag_as: "punctuation.definition.bracket.curly.end",
                }
            },
            includes: [
                "#struct-acces:modifier,
            {
                match: /\b(\w+)\s+([\w\[\]\*&.]+)(?:\s*(=)\s*((?:.(?=$|//|/\*))*+))?/
                "captures": {
                    "1": {
                        tag_as: "variable.other.property",
                    },
                    "2": {
                        includes: [
                            {
                                "include": "#numbers"
                            },
                            {
                                "include": "#brackets"
                            },
                            {
                                "include": "#types"
                            },
                            {
                                match: /\w+/,
                                tag_as: "storage.type.other",
                            }
                        ]
                    },
                    "3": {
                        tag_as: "keyword.operator.assignment",
                    },
                    "4": {
                        includes: [
                            :$inital_context,
                        ]
                    }
                }
            },
                {
                    "include": "#types"
                },
                :$inital_context,
            ]
        ),
    Pattern.new(
        tag_as: "meta.definition.struct",
        match: /^\s*(?:(mut|pub(?:\s+mut)?|__global))\s+?(struct)\s+(?:\s+([\w.]+))?/,
        "captures": {
            "1": {
                tag_as: "storage.modifier.$match",
            },
            "2": {
                tag_as: "storage.type.struct",
            },
            "3": {
                tag_as: "entity.name.struct",
            }
        }
    )
]
grammar[:struct_access_modifier] = Pattern.new(
    match: /(?<=\s|^)(mut|pub(?:\s+mut)?|__global)(:|\b)/,
    "captures": {
        "1": {
            tag_as: "storage.modifier.$match",
        },
        "2": {
            tag_as: "punctuation.separator.struct.key-value",
        }
    }
)
