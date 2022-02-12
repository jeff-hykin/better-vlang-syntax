# frozen_string_literal: true
require 'ruby_grammar_builder'
require 'walk_up'
require_relative walk_up_until("paths.rb")
require_relative './tokens.rb'

# 
# 
# create grammar!
# 
# 
grammar = Grammar.new(
    name: "V",
    scope_name: "source.v",
    fileTypes: [
        "",
		".vh",
		".vsh",
		".vv",
		"v.mod",
    ],
    version: "",
)

# 
#
# Setup Grammar
#
# 
    grammar[:$initial_context] = [
        :comments,
        :as_is,
        :attributes,
        :assignment,
        :module_decl,
        :import_decl,
        :hash_decl,
        :brackets,
        :builtin_fix,
        :escaped_fix,
        :operators,
        :function_limited_overload_decl,
        :function_extend_decl,
        :function_decl,
        :function_exist,
        :generic,
        :constants,
        :type,
        :enum,
        :interface,
        :struct,
        :keywords,
        :storage,
        :numbers,
        :strings,
        :types,
        :punctuations,
    ]

# 
# Helpers
# 
    # @space
    # @spaces
    # @digit
    # @digits
    # @standard_character
    # @word
    # @word_boundary
    # @white_space_start_boundary
    # @white_space_end_boundary
    # @start_of_document
    # @end_of_document
    # @start_of_line
    # @end_of_line
    part_of_a_variable = /[a-zA-Z_][a-zA-Z_0-9]*/
    # this is really useful for keywords. eg: variableBounds[/new/] wont match "newThing" or "thingnew"
    variableBounds = ->(regex_pattern) do
        lookBehindToAvoid(@standard_character).then(regex_pattern).lookAheadToAvoid(@standard_character)
    end
    variable = variableBounds[part_of_a_variable]

# 
# imports
# 
    grammar.import(PathFor[:pattern]["operators"])
    # grammar.import(PathFor[:pattern]["string"])
    # grammar.import(PathFor[:pattern]["numeric_literal"])

# 
# lists
# 
    special_keywords          = [ "fn", "type", "typeof", "enum", "struct", "interface", "map", "assert", "sizeof", "__offsetof", ]
    normal_control_words      = [ "as", "it", "is", "in", "or", "break", "continue", "default", "unsafe", "match", "if", "else", "for", "go", "goto", "defer", "return", "shared", "select", "rlock", "lock", "atomic", "asm", ]
    special_control_words     = [ "$if", "$else" ]
    storage_attributes        = [ "deprecated", "unsafe_fn", "console", "heap", "debug", "manualfree", "typedef", "live", "inline", "flag", "ref_only", "windows_stdcall", "direct_array_access", ]
    storage_modifiers         = [ "const", "mut", "pub" ]
    non_numeric_storage_types = [ "bool", "byte", "byteptr", "charptr", "voidptr", "string", "ustring", "rune" ]
    numeric_storage_types     = [ "int", "i8", "i16", "i64", "i128", "u8", "u16", "u32", "u64", "u128", "f32", "f64", ]
    constants                 = ["true", "false", "none"]
    
# 
# basic patterns
# 
    grammar[:comments] = [
        PatternRange.new(
            tag_as: "comment.block.documentation",
            start_pattern: Pattern.new(
                match: "/*",
                tag_as: "punctuation.definition.comment.begin",
            ),
            end_pattern: Pattern.new(
                match: "*/",
                tag_as: "punctuation.definition.comment.end",
            ),
            includes: [
                :comments,
            ]
        ),
        PatternRange.new(
            tag_as: "comment.line.double-slash",
            start_pattern: Pattern.new(
                match: "//",
                tag_as: "punctuation.definition.comment.begin",
            ),
            end_pattern: @end_of_line,
        )
    ]
    
    grammar[:as_is] = PatternRange.new(
        start_pattern: Pattern.new(
            @spaces.then(
                tag_as: "keyword.$match",
                match:  /as|is/,
            ).then(@spaces)
        ),
        end_pattern: Pattern.new(
            tag_as: "entity.name.alias",
            match: zeroOrMoreOf(/[\w.]/),
        ),
    )
    
    grammar[:assignment] = Pattern.new(
        tag_as: "meta.definition.variable",
        match: Pattern.new(
            @spaces.then(grammar[:assignment_operator]).then(@spaces)
        ),
    )
    
    grammar[:attributes] = Pattern.new(
        tag_as: "meta.definition.attribute",
        match: Pattern.new(
            @start_of_line.maybe(@spaces).then(
                tag_as: "meta.function.attribute",
                match: Pattern.new(
                    Pattern.new(
                        tag_as: "punctuation.definition.begin.bracket.square",
                        match: "["
                    ).then(
                        tag_as: "storage.modifier.attribute",
                        match: oneOf(storage_attributes),
                    ).then(
                        tag_as: "punctuation.definition.end.bracket.square",
                        match: "]",
                    )
                ),
            )
        )
    )

    grammar[:module_decl] = PatternRange.new(
        tag_as: "meta.module",
        start_pattern: Pattern.new(
            @start_of_line.maybe(@spaces).then(
                tag_as: "keyword.module",
                match: /module/,
            ).then(@spaces)
        ),
        end_pattern: Pattern.new(
            tag_as: "entity.name.module",
            match: /[\w.]+/,
        ),
    )

    grammar[:import_decl] = PatternRange.new(
        tag_as: "meta.import",
        start_pattern: Pattern.new(
            @start_of_line.maybe(@spaces).then(
                tag_as: "keyword.import",
                match: /import/,
            ).then(@spaces)
        ),
        end_pattern: Pattern.new(
            tag_as: "entity.name.import",
            match: /[\w.]+/,
        ),
    )

    grammar[:hash_decl] = PatternRange.new(
        tag_as: "markup.bold",
        start_pattern: Pattern.new(
            @start_of_line.maybe(@spaces).then(
                match: "#",
            )
        ),
        end_pattern: @end_of_line,
    )

    grammar[:brackets] = [
        PatternRange.new(
            start_pattern: Pattern.new(
                tag_as: "punctuation.definition.bracket.curly.begin",
                match: "{",
            ),
            end_pattern: Pattern.new(
                tag_as: "punctuation.definition.bracket.curly.end",
                match: "}",
            ),
            includes: [
                :$initial_context,
            ]
        ),
        PatternRange.new(
            start_pattern: Pattern.new(
                tag_as: "punctuation.definition.bracket.round.begin",
                match: /\(/,
            ),
            end_pattern: Pattern.new(
                tag_as: "punctuation.definition.bracket.round.end",
                match: /\)/,
            ),
            includes: [
                :$initial_context,
            ]
        ),
        PatternRange.new(
            start_pattern: Pattern.new(
                tag_as: "punctuation.definition.bracket.square.begin",
                match: /\[/,
            ),
            end_pattern: Pattern.new(
                tag_as: "punctuation.definition.bracket.square.end",
                match: /\]/,
            ),
            includes: [
                :$initial_context,
            ]
        ),
    ]
    
    grammar[:builtin_fix] = [
        Pattern.new(
            tag_as: "storage.modifier",
            match: Pattern.new(/const/).lookAheadFor(/\s*\(/),
        ),
        Pattern.new(
            tag_as: "keyword.$match",
            match: variableBounds[oneOf(special_keywords)].lookAheadFor(/\s*\(/),
        ),
        Pattern.new(
            tag_as: "keyword.control",
            match: oneOf(special_control_words).lookAheadFor(/\s*\(/),
        ),
        Pattern.new(
            tag_as: "keyword.control",
            match: variableBounds[oneOf(normal_control_words)].lookAheadFor(/\s*\(/),
        ),
        Pattern.new(
            tag_as: "meta.expr.numeric.cast storage.type.numeric",
            match: variableBounds[oneOf(numeric_storage_types)].lookAheadFor(/\s*\(/),
        ),
        Pattern.new(
            tag_as: "meta.expr.bool.cast storage.type.$match",
            # NOTE: not sure if this should get variableBounds[] or maybe \b
            match: Pattern.new(/bool|byte|byteptr|charptr|voidptr|string|rune|size_t/).lookAheadFor(/\s*\(/),
        ),
    ]
    
    grammar[:escaped_fix] = Pattern.new(
        tag_as: "meta.escaped.keyword keyword.other.escaped",
        # TODO: this needs to be cleaned up using variables and a oneOf([]) call
        match: /(?:@)(?:mut|pub|fn|unsafe|module|import|as|const|map|assert|sizeof|__offsetof|typeof|type|struct|interface|enum|in|is|or|match|if|else|for|go|goto|defer|return|shared|select|rlock|lock|atomic|asm|i?(?:8|16|nt|64|128)|u?(?:16|32|64|128)|f?(?:32|64)|bool|byte|byteptr|charptr|voidptr|string|ustring|rune)/,
    )
    
    grammar[:constants] = Pattern.new(
        tag_as: "constant.language",
        match: variableBounds[oneOf(constants)],
    )
    
    grammar[:punctuation] = [
        Pattern.new(
            tag_as: "punctuation.delimiter.period.dot",
            match: /\./,
        ),
        Pattern.new(
            tag_as: "punctuation.delimiter.comma",
            match: /,/,
        ),
        Pattern.new(
            tag_as: "punctuation.separator.key-value.colon",
            match: /:/,
        ),
        Pattern.new(
            tag_as: "punctuation.definition.other.semicolon",
            match: /;/,
        ),
        Pattern.new(
            tag_as: "punctuation.definition.other.questionmark",
            match: /\?/,
        ),
        Pattern.new(
            tag_as: "punctuation.hash",
            match: /#/,
        )
    ]

    grammar[:keywords] = [
        Pattern.new(
            tag_as: "keyword.control",
            match: oneOf(special_control_words),
        ),
        Pattern.new(
            tag_as: "keyword.control",
            match: variableBounds[
                oneOf(normal_control_words)
            ],
        ),
        Pattern.new(
            tag_as: "keyword.$match",
            match: variableBounds[
                oneOf(special_keywords)
            ],
        ),
    ]
    
    grammar[:storage] = Pattern.new(
        tag_as: "storage.modifier",
        match: variableBounds[oneOf(storage_modifiers)],
    )

    grammar[:types] = [
        Pattern.new(
            tag_as: "storage.type.numeric",
            match: lookBehindToAvoid(/\./).then(variableBounds[oneOf(numeric_storage_types)]),
        ),
        Pattern.new(
            tag_as: "storage.type.$match",
            match: lookBehindToAvoid(/\./).then(variableBounds[oneOf(non_numeric_storage_types)]),
        )
    ]

    grammar[:numbers] = [
        Pattern.new(
            tag_as: "constant.numeric.exponential",
            match: /(?:[0-9]+(?:_?))+(?:\.)(?:[0-9]+[eE][-+]?[0-9]+)/,
        ),
        Pattern.new(
            tag_as: "constant.numeric.float",
            match: /(?:[0-9]+(?:_?))+(?:\.)(?:[0-9]+)/,
        ),
        Pattern.new(
            tag_as: "constant.numeric.binary",
            match: /(?:0b)(?:(?:[0-1]+)(?:_?))+/,
        ),
        Pattern.new(
            tag_as: "constant.numeric.octal",
            match: /(?:0o)(?:(?:[0-7]+)(?:_?))+/,
        ),
        Pattern.new(
            tag_as: "constant.numeric.hex",
            match: /(?:0x)(?:(?:[0-9a-fA-F]+)(?:_?))+/,
        ),
        Pattern.new(
            tag_as: "constant.numeric.integer",
            match: /(?:(?:[0-9]+)(?:[_]?))+/,
        )
    ]
    
    grammar[:punctuations] = [
        Pattern.new(
            tag_as: "punctuation.accessor",
            match: /\./,
        ),
        Pattern.new(
            tag_as: "punctuation.separator.comma",
            match: /,/,
        )
    ]
#
# Save
#
grammar.save_to(
    syntax_name: "v",
    syntax_dir: "./autogenerated",
    tag_dir: "./autogenerated",
)