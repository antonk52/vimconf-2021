# vimconf2021

Slides can be viewed in [`slides.md`](./slides.md)

A few people asked what I used for the slides, you can install this repository as a vim plugin and run `require'vimconf2021'.setup()` to start presenting. Buffers are used for slides, to prepopulate buffers in the right order this repository also contains a nodejs script to split a markdown file into multiple files, that can be opened at once as `nvim ./slides/*`, now the plugin function can be called and you can start switching between buffers/slides.

See [lua file](./lua/vimconf2021.lua) for specifics

To generate slides from the main slides.md file
- `npm run titles ./path/to/file.md` - shows list of slide titles
- `npm run dev ./path/to/file.md` - split file by slides and create markdown file for each slide
