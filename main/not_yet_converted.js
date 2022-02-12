grammar[:attributes] = Pattern.new(
    tag_as: "meta.definition.attribute.v",
    match: /^\s*((\[)(deprecated|unsafe_fn|console|heap|debug|manualfree|typedef|live|inline|flag|ref_only|windows_stdcall|direct_array_access)(\]))/,
    "captures": {
        "1": {
            tag_as: "meta.function.attribute.v",
        },
        "2": {
            tag_as: "punctuation.definition.begin.bracket.square.v",
        },
        "3": {
            tag_as: "storage.modifier.attribute.v",
        },
        "4": {
            tag_as: "punctuation.definition.end.bracket.square.v",
        }
    }
)
grammar[:module_decl] = Pattern.new(
    tag_as: "meta.module.v",
    start_pattern: /^\s*(module)\s+/,
    "beginCaptures": {
        "1": {
            tag_as: "keyword.module.v",
        }
    },
    end_pattern: /([\w.]+)/,
    "endCaptures": {
        "1": {
            tag_as: "entity.name.module.v",
        }
    }
)
grammar[:import_decl] = Pattern.new(
    tag_as: "meta.import.v",
    start_pattern: /^\s*(import)\s+/,
    "beginCaptures": {
        "1": {
            tag_as: "keyword.import.v",
        }
    },
    end_pattern: /([\w.]+)/,
    "endCaptures": {
        "1": {
            tag_as: "entity.name.import.v",
        }
    }
)
grammar[:hash_decl] = Pattern.new(
    tag_as: "markup.bold.v",
    start_pattern: /^\s*(#)/,
    end_pattern: "$"
)
grammar[:brackets] = Pattern.new(
    includes: [
        {
            start_pattern: /{/,
            "beginCaptures": {
                "0": {
                    tag_as: "punctuation.definition.bracket.curly.begin.v",
                }
            },
            end_pattern: /}/,
            "endCaptures": {
                "0": {
                    tag_as: "punctuation.definition.bracket.curly.end.v",
                }
            },
            includes: [
                :$inital_context,
            ]
        },
        {
            start_pattern: /\\(/,
            "beginCaptures": {
                "0": {
                    tag_as: "punctuation.definition.bracket.round.begin.v",
                }
            },
            end_pattern: /\\)/,
            "endCaptures": {
                "0": {
                    tag_as: "punctuation.definition.bracket.round.end.v",
                }
            },
            includes: [
                :$inital_context,
            ]
        },
        {
            start_pattern: /\[/,
            "beginCaptures": {
                "0": {
                    tag_as: "punctuation.definition.bracket.square.begin.v",
                }
            },
            end_pattern: /\]/,
            "endCaptures": {
                "0": {
                    tag_as: "punctuation.definition.bracket.square.end.v",
                }
            },
            includes: [
                :$inital_context,
            ]
        }
    ]
)
grammar[:builtin_fix] = Pattern.new(
    includes: [
        {
            includes: [
                {
                    tag_as: "storage.modifier.v",
                    match: /(const)(?=\s*\\()/,
                },
                {
                    tag_as: "keyword.$1.v",
                    match: /\\b(fn|type|enum|struct|union|interface|map|assert|sizeof|typeof|__offsetof)\\b(?=\s*\\()/,
                }
            ]
        },
        {
            includes: [
                {
                    tag_as: "keyword.control.v",
                    match: /(\\$if|\\$else)(?=\s*\\()/,
                },
                {
                    tag_as: "keyword.control.v",
                    match: /\\b(as|in|is|or|break|continue|default|unsafe|match|if|else|for|go|goto|defer|return|shared|select|rlock|lock|atomic|asm)\\b(?=\s*\\()/,
                }
            ]
        },
        {
            includes: [
                {
                    match: /(i?(?:8|16|nt|64|128)|u?(?:16|32|64|128)|f?(?:32|64))(?=\s*\\()/,
                    "captures": {
                        "1": {
                            tag_as: "storage.type.numeric.v",
                        }
                    },
                    tag_as: "meta.expr.numeric.cast.v",
                },
                {
                    match: /(bool|byte|byteptr|charptr|voidptr|string|rune|size_t)(?=\s*\\()/,
                    "captures": {
                        "1": {
                            tag_as: "storage.type.$1.v",
                        }
                    },
                    tag_as: "meta.expr.bool.cast.v",
                }
            ]
        }
    ]
)
grammar[:escaped_fix] = Pattern.new(
    tag_as: "meta.escaped.keyword.v",
    match: /((?:@)(?:mut|pub|fn|unsafe|module|import|as|const|map|assert|sizeof|__offsetof|typeof|type|struct|interface|enum|in|is|or|match|if|else|for|go|goto|defer|return|shared|select|rlock|lock|atomic|asm|i?(?:8|16|nt|64|128)|u?(?:16|32|64|128)|f?(?:32|64)|bool|byte|byteptr|charptr|voidptr|string|ustring|rune))/,
    "captures": {
        "0": {
            tag_as: "keyword.other.escaped.v",
        }
    }
)
grammar[:comments] = Pattern.new(
    includes: [
        {
            tag_as: "comment.block.documentation.v",
            start_pattern: //\*/,
            "beginCaptures": {
                "0": {
                    tag_as: "punctuation.definition.comment.begin.v",
                }
            },
            end_pattern: /\*//,
            "endCaptures": {
                "0": {
                    tag_as: "punctuation.definition.comment.end.v",
                }
            },
            includes: [
                :comments,
            ]
        },
        {
            tag_as: "comment.line.double-slash.v",
            start_pattern: ////,
            "beginCaptures": {
                "0": {
                    tag_as: "punctuation.definition.comment.begin.v",
                }
            },
            end_pattern: "$"
        }
    ]
)
grammar[:constants] = Pattern.new(
    tag_as: "constant.language.v",
    match: /\\b(true|false|none)\\b/,
)
grammar[:generic] = Pattern.new(
    includes: [
        {
            tag_as: "meta.definition.generic.v",
            match: /(?<=[\w\s+])(\\<)(\w+)(\\>)/,
            "captures": {
                "1": {
                    tag_as: "punctuation.definition.bracket.angle.begin.v",
                },
                "2": {
                    includes: [
                        {
                            "include": "#illegal-name"
                        },
                        {
                            match: /\w+/,
                            tag_as: "entity.name.generic.v",
                        }
                    ]
                },
                "3": {
                    tag_as: "punctuation.definition.bracket.angle.end.v",
                }
            }
        }
    ]
)
grammar[:function_decl] = Pattern.new(
    tag_as: "meta.definition.function.v",
    start_pattern: /^\s*(pub)?\s*(fn)\s+/,
    "beginCaptures": {
        "1": {
            tag_as: "storage.modifier.v",
        },
        "2": {
            tag_as: "keyword.function.v",
        }
    },
    end_pattern: /(?:(?:C\.)?)(\w+)\s*((?<=[\w\s+])(\\<)(\w+)(\\>))?/,
    "endCaptures": {
        "1": {
            includes: [
                "#illega:name,
                {
                    match: /\w+/,
                    tag_as: "entity.name.function.v",
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
    tag_as: "meta.definition.function.v",
    match: /^\s*(pub)?\s*(fn)\s*(\\()([^\\)]*)(\\))\s*(?:(?:C\.)?)(\w+)\s*((?<=[\w\s+])(\\<)(\w+)(\\>))?/,
    "captures": {
        "1": {
            tag_as: "storage.modifier.v",
        },
        "2": {
            tag_as: "keyword.function.v",
        },
        "3": {
            tag_as: "punctuation.definition.bracket.round.begin.v",
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
            tag_as: "punctuation.definition.bracket.round.end.v",
        },
        "6": {
            includes: [
                "#illega:name,
                {
                    match: /\w+/,
                    tag_as: "entity.name.function.v",
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
    tag_as: "meta.definition.function.v",
    match: /^\s*(pub)?\s*(fn)\s*(\\()([^\\)]*)(\\))\s*([\+\-\*\/])?\s*(\\()([^\\)]*)(\\))\s*(?:(?:C\.)?)(\w+)/,
    "captures": {
        "1": {
            tag_as: "storage.modifier.v",
        },
        "2": {
            tag_as: "keyword.function.v",
        },
        "3": {
            tag_as: "punctuation.definition.bracket.round.begin.v",
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
            tag_as: "punctuation.definition.bracket.round.end.v",
        },
        "6": {
            includes: [
                :operators,
            ]
        },
        "7": {
            tag_as: "punctuation.definition.bracket.round.begin.v",
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
            tag_as: "punctuation.definition.bracket.round.end.v",
        },
        "10": {
            includes: [
                "#illega:name,
                {
                    match: /\w+/,
                    tag_as: "entity.name.function.v",
                }
            ]
        }
    }
)
grammar[:function_exist] = Pattern.new(
    tag_as: "meta.support.function.v",
    match: /(\w+)((?<=[\w\s+])(\\<)(\w+)(\\>))?(?=\s*\\()/,
    "captures": {
        "0": {
            tag_as: "meta.function.call.v",
        },
        "1": {
            includes: [
                "#illega:name,
                {
                    match: /\w+/,
                    tag_as: "entity.name.function.v",
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
    tag_as: "meta.definition.type.v",
    match: /^\s*(?:(pub)?\s+)?(type)\s+(\w*)\s+(?:\w+\.+)?(\w*)/,
    "captures": {
        "1": {
            tag_as: "storage.modifier.$1.v",
        },
        "2": {
            tag_as: "storage.type.type.v",
        },
        "3": {
            includes: [
                "#illega:name,
                {
                    "include": "#types"
                },
                {
                    tag_as: "entity.name.type.v",
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
                    tag_as: "entity.name.type.v",
                    match: /\w+/,
                }
            ]
        }
    }
)
grammar[:enum] = Pattern.new(
    tag_as: "meta.definition.enum.v",
    match: /^\s*(?:(pub)?\s+)?(enum)\s+(?:\w+\.)?(\w*)/,
    "captures": {
        "1": {
            tag_as: "storage.modifier.$1.v",
        },
        "2": {
            tag_as: "storage.type.enum.v",
        },
        "3": {
            tag_as: "entity.name.enum.v",
        }
    }
)
grammar[:interface] = Pattern.new(
    tag_as: "meta.definition.interface.v",
    match: /^\s*(?:(pub)?\s+)?(interface)\s+(\w*)/,
    "captures": {
        "1": {
            tag_as: "storage.modifier.$1.v",
        },
        "2": {
            tag_as: "keyword.interface.v",
        },
        "3": {
            includes: [
                "#illega:name,
                {
                    tag_as: "entity.name.interface.v",
                    match: /\w+/,
                }
            ]
        }
    }
)
grammar[:struct] = Pattern.new(
    includes: [
        {
            tag_as: "meta.definition.struct.v",
            start_pattern: /^\s*(?:(mut|pub(?:\s+mut)?|__global)\s+)?(struct|union)\s+([\w.]+)\s*|({)/,
            "beginCaptures": {
                "1": {
                    tag_as: "storage.modifier.$1.v",
                },
                "2": {
                    tag_as: "storage.type.struct.v",
                },
                "3": {
                    tag_as: "entity.name.struct.v",
                },
                "4": {
                    tag_as: "punctuation.definition.bracket.curly.begin.v",
                }
            },
            end_pattern: /\s*|(})/,
            "endCaptures": {
                "1": {
                    tag_as: "punctuation.definition.bracket.curly.end.v",
                }
            },
            includes: [
                "#struct-acces:modifier,
                {
                    match: /\\b(\w+)\s+([\w\[\]\*&.]+)(?:\s*(=)\s*((?:.(?=$|//|/\*))*+))?/,
                    "captures": {
                        "1": {
                            tag_as: "variable.other.property.v",
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
                                    tag_as: "storage.type.other.v",
                                }
                            ]
                        },
                        "3": {
                            tag_as: "keyword.operator.assignment.v",
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
        },
        {
            tag_as: "meta.definition.struct.v",
            match: /^\s*(?:(mut|pub(?:\s+mut)?|__global))\s+?(struct)\s+(?:\s+([\w.]+))?/,
            "captures": {
                "1": {
                    tag_as: "storage.modifier.$1.v",
                },
                "2": {
                    tag_as: "storage.type.struct.v",
                },
                "3": {
                    tag_as: "entity.name.struct.v",
                }
            }
        }
    ]
)
grammar[:struct_access_modifier] = Pattern.new(
    match: /(?<=\s|^)(mut|pub(?:\s+mut)?|__global)(:|\\b)/,
    "captures": {
        "1": {
            tag_as: "storage.modifier.$1.v",
        },
        "2": {
            tag_as: "punctuation.separator.struct.key-value.v",
        }
    }
)
grammar[:punctuation] = Pattern.new(
    includes: [
        {
            tag_as: "punctuation.delimiter.period.dot.v",
            match: /\./,
        },
        {
            tag_as: "punctuation.delimiter.comma.v",
            match: /,/,
        },
        {
            tag_as: "punctuation.separator.key-value.colon.v",
            match: /:/,
        },
        {
            tag_as: "punctuation.definition.other.semicolon.v",
            match: /;/,
        },
        {
            tag_as: "punctuation.definition.other.questionmark.v",
            match: /\?/,
        },
        {
            tag_as: "punctuation.hash.v",
            match: /#/,
        }
    ]
)
grammar[:keywords] = Pattern.new(
    includes: [
        {
            tag_as: "keyword.control.v",
            match: /(\\$if|\\$else)/,
        },
        {
            tag_as: "keyword.control.v",
            match: /\\b(as|it|is|in|or|break|continue|default|unsafe|match|if|else|for|go|goto|defer|return|shared|select|rlock|lock|atomic|asm)\\b/,
        },
        {
            tag_as: "keyword.$1.v",
            match: /\\b(fn|type|typeof|enum|struct|interface|map|assert|sizeof|__offsetof)\\b/,
        }
    ]
)
grammar[:storage] = Pattern.new(
    tag_as: "storage.modifier.v",
    match: /\\b(const|mut|pub)\\b/,
)
grammar[:types] = Pattern.new(
    includes: [
        {
            tag_as: "storage.type.numeric.v",
            match: /(?<!\.)\\b(i(8|16|nt|64|128)|u(8|16|32|64|128)|f(32|64))\\b/,
        },
        {
            tag_as: "storage.type.$1.v",
            match: /(?<!\.)\\b(bool|byte|byteptr|charptr|voidptr|string|ustring|rune)\\b/,
        }
    ]
)
grammar[:numbers] = Pattern.new(
    includes: [
        {
            tag_as: "constant.numeric.exponential.v",
            match: /([0-9]+(_?))+(\.)([0-9]+[eE][-+]?[0-9]+)/,
        },
        {
            tag_as: "constant.numeric.float.v",
            match: /([0-9]+(_?))+(\.)([0-9]+)/,
        },
        {
            tag_as: "constant.numeric.binary.v",
            match: /(?:0b)(?:(?:[0-1]+)(?:_?))+/,
        },
        {
            tag_as: "constant.numeric.octal.v",
            match: /(?:0o)(?:(?:[0-7]+)(?:_?))+/,
        },
        {
            tag_as: "constant.numeric.hex.v",
            match: /(?:0x)(?:(?:[0-9a-fA-F]+)(?:_?))+/,
        },
        {
            tag_as: "constant.numeric.integer.v",
            match: /(?:(?:[0-9]+)(?:[_]?))+/,
        }
    ]
)
grammar[:punctuations] = Pattern.new(
    includes: [
        {
            tag_as: "punctuation.accessor.v",
            match: /(?:\.)/,
        },
        {
            tag_as: "punctuation.separator.comma.v",
            match: /(?:,)/,
        }
    ]
)
grammar[:strings] = Pattern.new(
    includes: [
        {
            start_pattern: /`/,
            end_pattern: /`/,
            tag_as: "string.quoted.rune.v",
            includes: [
                "#string-escape:char,
                {
                    "include": "#string-interpolation"
                },
                {
                    "include": "#string-placeholder"
                }
            ]
        },
        {
            start_pattern: /(r)'/,
            "beginCaptures": {
                "1": {
                    tag_as: "storage.type.string.v",
                }
            },
            end_pattern: /'/,
            tag_as: "string.quoted.raw.v",
            includes: [
                "#strin:interpolation,
                {
                    "include": "#string-placeholder"
                }
            ]
        },
        {
            start_pattern: /(r)\"/,
            "beginCaptures": {
                "1": {
                    tag_as: "storage.type.string.v",
                }
            },
            end_pattern: /\"/,
            tag_as: "string.quoted.raw.v",
            includes: [
                "#strin:interpolation,
                {
                    "include": "#string-placeholder"
                }
            ]
        },
        {
            start_pattern: /(c?)'/,
            "beginCaptures": {
                "1": {
                    tag_as: "storage.type.string.v",
                }
            },
            end_pattern: /'/,
            tag_as: "string.quoted.v",
            includes: [
                "#string-escape:char,
                {
                    "include": "#string-interpolation"
                },
                {
                    "include": "#string-placeholder"
                }
            ]
        },
        {
            start_pattern: /(c?)\"/,
            "beginCaptures": {
                "1": {
                    tag_as: "storage.type.string.v",
                }
            },
            end_pattern: /\"/,
            tag_as: "string.quoted.v",
            includes: [
                "#string-escape:char,
                {
                    "include": "#string-interpolation"
                },
                {
                    "include": "#string-placeholder"
                }
            ]
        }
    ]
)
grammar[:string_escaped_char] = Pattern.new(
    includes: [
        {
            tag_as: "constant.character.escape.v",
            match: /\\\\([0-7]{3}|[\\$abfnrtv\\\\'\"]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|U[0-9a-fA-F]{8})/,
        },
        {
            tag_as: "invalid.illegal.unknown-escape.v",
            match: /\\\[^0-7\\$xuUabfnrtv\\'\"]/,
        }
    ]
)
grammar[:string_interpolation] = Pattern.new(
    tag_as: "meta.string.interpolation.v",
    match: /(\\$([\w.]+|\\{.*?\\}))/,
    "captures": {
        "1": {
            includes: [
                {
                    tag_as: "invalid.illegal.v",
                    match: /\\$\\d[\.\w]+/,
                },
                {
                    tag_as: "variable.other.interpolated.v",
                    match: /\\$([\.\w]+|\\{.*?\\})/,
                }
            ]
        }
    }
)
grammar[:string_placeholder] = Pattern.new(
    match: /%(\[\\d+\])?([\+#\-0\\x20]{,2}((\\d+|\*)?(\.?(\\d+|\*|(\[\\d+\])\*?)?(\[\\d+\])?)?))?[vT%tbcdoqxXUbeEfFgGsp]/,
    tag_as: "constant.other.placeholder.v",
)
grammar[:illegal_name] = Pattern.new(
    match: /\\d\w+/,
    tag_as: "invalid.illegal.v",
)