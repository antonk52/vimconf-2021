## DIY quality of life improvements

### Myself

- Web & developer tooling
- Cannot get into mechanical keyboards
- Write vim plugins when bored

### Why

> A perfect editor has nothing redundant and everything that I need.
> If it doesn't, I install a plugin and it has everything that I need.
> If the plugin does not exist, I write my own plugin
> and the editor has everything that I need.

by Sorax

### Talk

Goal:

- Motivate you to write plugins and share them with the community

Prerequisite:

- You have a broad idea of what a `.vimrc` looks like



### Table of content

- Why people get into vim
- Types of plugins
- What makes a great plugin?
- Which language to use?
- How I started
- Vimscript plugin
- Lua plugin
- Good practices

## Why people get into vim

- Speed
- Ergonomics
- Flexibility
- Geek out*


## Types of plugins

- Theme
- Syntax
- Utility
- Makes friends with external tools
- LSP
- Treesitter

## Plugins

- What makes a great plugin?
- What should a plugin do?
- What language should we use?

### What makes a great plugin?

- Does one thing exceptionally well
- Accessible
    - can be used by both vim and neovim
    - cross platform
- Low entry bar
    - easy install and setup
    - no external dependencies
- Decent documentation
- Error handling
- Lazy loaded

## How I started

- vim-tabber
- vim-browserslist
- gitignore-grabber.nvim
- bad-practices.nvim
- coc-cssmodules -> cssmodules-language-server

### Which language to use?

| name           | vim             | neovim |
| -------------- | --------------- | ------ |
| vimscript      | yes             | yes    |
| vimscript9     | yes(not yet)    | no     |
| remote plugins | yes*            | yes*   |
| lua            | yes(remote)     | YAS    |
| coc.nvim       | yes*            | yes*   |

\* - requires an external dependency
  ie the runtime for the language in which the plugin is written

<!-- 1. We can write native to coc.nvim plugins in javascript/typescript or whatever compiles to javascript -->
<!-- 2. We can fairly easily adapt any vscode plugin to work with my vim setup -->
<!-- 3. We can leverage whole npm ecosystem, there are a ton of packages that can get me faster to where we want to be, the catch is you need to search for them -->

### lua vs vimscript vs vimscript9

Do I really need to learn vimscript?

Specially if we have lua already and vimscript9 around a corner

**Yes, at least briefly**




## Vimscript ✅

- [learn vimscript the hard way](https://learnvimscriptthehardway.stevelosh.com/)
- `:help write-plugin`


### Directory structure

- colors
- ftdetect
- ftplugin
- plugin
- autoload
- doc
- lua

- ~~after~~
- ~~compiler~~
- ~~indent~~
- ~~syntax~~


#### colors

A directory to store themes.

```
$ tree
.
├── colors
│   ├── theme-one.vim
│   └── theme-two.vim
└── readme.md
```

#### colors - example

```vim
" colors/foo.vim
highlight clear
syntax reset

let g:colors_name = "foo"

highlight Normal guifg=#c0c5ce guibg=#2b303b ctermfg=05 ctermbg=00
highlight Bold gui=bold cterm=bold
highlight Debug guifg=#bf616a ctermfg=08
highlight Directory guifg=#8fa1b3 ctermfg=0D
highlight Error guifg=#2b303b guibg=#bf616a ctermfg=00 ctermbg=08
" more highlight groups
```

To learn more `:help highlight`

#### colors - pro tip

If you have `nvim-treesitter` & `treesitter-playground`

Use `:TSHighlightCapturesUnderCursor` to lookup highlight group under a cursor

#### ftdetect

```vim
" ftdetect/foo.vim
autocmd BufRead,BufNewFile *.foo set filetype=foo
```


#### ftplugin

```vim
" ftplugin/foo.vim
if exists("b:did_ftplugin_foo")
  finish
endif
let b:did_ftplugin_foo = 1

nnoremap <buffer><leader>o echo "I only work in this buffer"
```


#### plugin

```vim
" plugin/foo.vim
if exists("g:loaded_foo")
  finish
endif
let g:loaded_foo = 1

nnoremap <leader>a echo "I work in all buffers"

function ReallyLargeFunction() abort
    " ...
    " long function body
    " ...
endfunction

command! DoStuff call ReallyLargeFunction()
```


#### autoload - native lazy loading

```diff
" plugin/foo.vim
-function ReallyLargeFunction() abort
-    " ...
-    " long function body
-    " ...
-endfunction
-
-command! DoStuff call ReallyLargeFunction()
+command! DoStuff call foo#bar#baz()
```


```vim
" autoload/foo/bar.vim
function! foo#bar#baz()
    " ...
    " long function body
    " ...
endfunction
```

#### autoload - good practices

```vim
" plugin/foo.vim

" don't do this ❌
let foo = call foo#bar#baz()

" this is ok ✅
function! DoStuff() abort
    let foo = call foo#bar#baz()
endfunction

nnoremap <leader>f <cmd>call DoStuff()<cr>
```


#### doc

```
$ tree
doc
├── plugin-name.txt
└── tags
```

##### doc - content

```txt
*plugin-name.txt*  Does one thing really well

Author:  your-name
License: LICENSE
URL: https://github.com/your-name/plugin-name

FEATURES                                            *feature-one*
Does this thing pretty well.
                                                    *feature-two*
Does that thing kinda good
                                                    *CommandFoo*
Performs a foo action
```

##### doc - content

```help
*plugin-name.txt*  Does this one thing really well

Author:  your-name
License: LICENSE
URL: https://github.com/your-name/plugin-name

FEATURES                                            *feature-one*
Does this thing pretty well.
                                                    *feature-two*
Does that thing kinda good
                                                    *CommandFoo*
Performs a foo action
```

##### doc - tags

Tab separated
- Tag name
- File name
- Tag address

`:help tags-file-format`

---

```
plugin-name	plugin-name.txt	*plugin-name*
feature-one	plugin-name.txt	*feature-one*
feature-two	plugin-name.txt	*feature-two*
CommandFoo	plugin-name.txt	*CommandFoo*
```

## Lua 🌝

**Neovim only**

- Respect lua-land rules
- Get a linter
- Don't be scared to tap into vim land when necessary


### Lua - `vim.api.*` vs `vim.fn.*`

- `vim.api.*` native neovim api `:help vim.api`
- `vim.fn.*` interop with vim land `:help lua-vimscript`

### Lua starter pack

Meet your new friends

- `:help`
- [lua-language-server](https://github.com/sumneko/lua-language-server)
- `vim.inspect()`
- [nvim-lua-guide](https://github.com/nanotee/nvim-lua-guide)

### Minimal lua plugin layout

```
$ tree
.
├── lua
│   └── myplugin.lua
├── plugin
│   └── myplugin.vim
├── doc
│   └── myplugin.txt
└── readme.md
```

### Lets standardize plugins' APIs

- Always export `setup` function
    - Group plugin related settings
    - Easy to load plugin on demand

## Good practices 📝

- Functionality
- How to share


### Plugin functionality good practices

- Does one thing exceptionally well
- Works out of the box (Sensible defaults)
- Include vim `docs`
- Integration with popular plugins
- Smooth feature deprecation

### Achilles heel of vim plugins

- Backward compatibility / versioning

### Github good practices

- `README.md`
    - Functionality gist + a demo if applicable
    - How to install
    - Setup
    - Examples / usage
    - How to contribute
    - Clearly defined public API
- Discoverable
    - Put your plugin on github
    - Add repository tags `vim-plugin` / `neovim-plugin`
- Leverage github templates for issues and pull requests [docs](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository)
- Github actions for linting, tests & conventions checks

## Outro

Go make 🔥🔥🔥 plugins & share them with me

twitter.com/antonk52

or

github.com/antonk52





## Not just yet

```txt
░█████╗░███╗░░██╗███████╗  ███╗░░░███╗░█████╗░██████╗░███████╗
██╔══██╗████╗░██║██╔════╝  ████╗░████║██╔══██╗██╔══██╗██╔════╝
██║░░██║██╔██╗██║█████╗░░  ██╔████╔██║██║░░██║██████╔╝█████╗░░
██║░░██║██║╚████║██╔══╝░░  ██║╚██╔╝██║██║░░██║██╔══██╗██╔══╝░░
╚█████╔╝██║░╚███║███████╗  ██║░╚═╝░██║╚█████╔╝██║░░██║███████╗
░╚════╝░╚═╝░░╚══╝╚══════╝  ╚═╝░░░░░╚═╝░╚════╝░╚═╝░░╚═╝╚══════╝

          ████████╗██╗░░██╗██╗███╗░░██╗░██████╗░
          ╚══██╔══╝██║░░██║██║████╗░██║██╔════╝░
          ░░░██║░░░███████║██║██╔██╗██║██║░░██╗░
          ░░░██║░░░██╔══██║██║██║╚████║██║░░╚██╗
          ░░░██║░░░██║░░██║██║██║░╚███║╚██████╔╝
          ░░░╚═╝░░░╚═╝░░╚═╝╚═╝╚═╝░░╚══╝░╚═════╝░
```

## References

- [learn vim script the hard way](https://learnvimscriptthehardway.stevelosh.com)
- [vim-tabber](https://github.com/antonk52/vim-tabber)
- [vim-browserslist](https://github.com/browserslist/vim-browserslist)
- [bad-practices.nvim](https://github.com/antonk52/bad-practices.nvim)
- [coc-cssmodules](https://github.com/antonk52/coc-cssmodules)
- [cssmodules-language-server](https://github.com/antonk52/cssmodules-language-server)
- [configuring issue templates for your repository](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository)
