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
    scope_name: "source",
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
        # :comments,
        :as_is,
        # :attributes,
        # :assignment,
        # :module_decl,
        # :import_decl,
        # :hash_decl,
        # :brackets,
        # :builtin_fix,
        # :escaped_fix,
        # :operators,
        # :function_limited_overload_decl,
        # :function_extend_decl,
        # :function_decl,
        # :function_exist,
        # :generic,
        # :constants,
        # :type,
        # :enum,
        # :interface,
        # :struct,
        # :keywords,
        # :storage,
        # :numbers,
        # :strings,
        # :types,
        # :punctuations,
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
# basic patterns
# 
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
                        match: oneOf([
                            "deprecated"
                            "unsafe_fn",
                            "console",
                            "heap",
                            "debug",
                            "manualfree",
                            "typedef",
                            "live",
                            "inline",
                            "flag",
                            "ref_only",
                            "windows_stdcall",
                            "direct_array_access",
                        ]),
                    ).then(
                        tag_as: "punctuation.definition.end.bracket.square",
                        match: "]",
                    )
                ),
            )
        )
    )



#
# Save
#
grammar.save_to(
    syntax_name: "vlang",
    syntax_dir: "./autogenerated",
    tag_dir: "./autogenerated",
)