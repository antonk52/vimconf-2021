if exists('g:vimconf2021_loaded')
    finish
endif
let g:vimconf2021_loaded = 1

command! PresenterMode lua require('vimconf2021').setup()
