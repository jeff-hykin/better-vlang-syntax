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
    name: "YOUR_LANGUAGE",
    scope_name: "source.YOUR_LANG_EXTENSION_HERE",
    fileTypes: [
        "YOUR_LANG_EXTENSION_HERE",
        # for example here are come C++ file extensions:
		#     "cpp",
		#     "cxx",
		#     "c++",
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
        :string,
        :variable,
        # (add more stuff here) (variables, strings, numbers)
    ]

# 
# Helpers
# 
    part_of_a_variable = /[a-zA-Z_][a-zA-Z_0-9]*/
    # this is really useful for keywords. eg: variableBounds[/new/] wont match "newThing" or "thingnew"
    variableBounds = ->(regex_pattern) do
        lookBehindToAvoid(@standard_character).then(regex_pattern).lookAheadToAvoid(@standard_character)
    end
    variable = variableBounds[part_of_a_variable]
    
# 
# basic patterns
# 
    grammar[:variable] = Pattern.new(
        match: variable,
        tag_as: "variable.other",
    )
    
    # basic pattern example
    grammar[:line_continuation_character] = Pattern.new(
        match: /\\\n/,
        tag_as: "constant.character.escape.line-continuation",
    )

# 
# imports
# 
    grammar.import(PathFor[:pattern]["comments"])
    grammar.import(PathFor[:pattern]["string"])
    grammar.import(PathFor[:pattern]["numeric_literal"])

#
# Save
#
name = "YOUR_LANG_EXTENSION_HERE"
grammar.save_to(
    syntax_name: name,
    syntax_dir: "./autogenerated",
    tag_dir: "./autogenerated",
)