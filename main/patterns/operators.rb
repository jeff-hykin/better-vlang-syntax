# frozen_string_literal: true
require 'ruby_grammar_builder'
require 'walk_up'
require_relative walk_up_until("paths.rb")

# 
# import/export
# 

grammar = Grammar.new_exportable_grammar
grammar.external_repos = [ # patterns that are imported
]
grammar.exports = [ # patterns that are exported
    :operators,
    :assignment_operator,
]


# 
# actual patterns
# 
grammar[:assignment_operator] = Pattern.new(
    tag_as: "keyword.operator.assignment",
    match: oneOf([
        ":=",
        "=",
        "+=",
        "-=",
        "*=",
        "/=",
        "%=",
        "&=",
        "|=",
        "^=",
        "~=",
        "&&=",
        "||=",
        ">>=",
        "<<=",
    ]),
)

grammar[:operators] = [
    Pattern.new(
        tag_as: "keyword.operator.arithmetic",
        match: oneOf([
            "++",
            "--",
            # ">>", in the original these are not commented out (but I think the original is wrong)
            # "<<", in the original these are not commented out (but I think the original is wrong)
            "+",
            "-",
            "*",
            "/",
            "%",
        ]),
    ),
    Pattern.new(
        tag_as: "keyword.operator.relation",
        match: oneOf([
            "==",
            "!=",
            ">=",
            "<=",
            lookBehindToAvoid(/>/).then(/>/).lookAheadToAvoid(/>/),
            lookBehindToAvoid(/</).then(/</).lookAheadToAvoid(/</),
        ]),
    ),
    Pattern.new(
        tag_as: "keyword.operator.assignment",
        match: oneOf([
            ":=",
            "=",
            "+=",
            "-=",
            "*=",
            "/=",
            "%=",
            "&=",
            "|=",
            "^=",
            "~=",
            "&&=",
            "||=",
            ">>=",
            "<<=",
        ]),
    ),
    Pattern.new(
        tag_as: "keyword.operator.bitwise",
        match: oneOf([
            "&",
            "|",
            "^",
            "~",
            # "&&", in the original these are not commented out (but I think the original is wrong)
            # "||", in the original these are not commented out (but I think the original is wrong)
            ">>", # the original has these as /<(?!<)/ for some reason
            "<<", # the original has these as />(?!>)/ for some reason
        ]),
    ),
    Pattern.new(
        tag_as: "keyword.operator.logical",
        match: oneOf([
            "&&",
            "||",
            "!",
        ]),
    ),
    Pattern.new(
        tag_as: "keyword.operator.optional",
        match: /\?/,
    ),
]