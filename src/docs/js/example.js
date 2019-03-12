document.addEventListener('DOMContentLoaded', function(){
    let tmw = new TmWindow("My Window Title");

    tmw.setPosition(window.innerWidth - 800,200);
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