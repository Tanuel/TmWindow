document.addEventListener('DOMContentLoaded', function(){
    let rect = document.body.getBoundingClientRect();
    let tmwX = rect.x + rect.width - 400;

    let tmw = new TmWindow({
        title: "Hello World!",
        content: "You should totally try to drag this window around by dragging the top bar!",
        width: 300,
        height:200,
    });

    tmw.setPosition(tmwX,5);
    tmw.open();
    let openBtn = document.getElementById('open-window');
    openBtn.addEventListener('click', tmw.open.bind(tmw));

    document.getElementById('apply-window-title').addEventListener('click', function(){
       tmw.title = document.getElementById('set-window-title').value;
    });

    document.getElementById('set-window-title').addEventListener('keyup', function(){
       tmw.title = document.getElementById('set-window-title').value;
    });

    document.getElementById('apply-window-content').addEventListener('click', function(){
       tmw.content = document.getElementById('set-window-content').value;
    });

    document.getElementById('set-window-content').addEventListener('keyup', function(){
       tmw.content = document.getElementById('set-window-content').value;
    });
    window.tmw = tmw;
});