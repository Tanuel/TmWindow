document.addEventListener('DOMContentLoaded', function(){
    let tmw = new TmWindow();
    tmw.open();
    let openBtn = document.getElementById('open-window');
    openBtn.addEventListener('click', tmw.open.bind(tmw));

    document.getElementById('apply-window-title').addEventListener('click', function(){
       tmw.title = document.getElementById('set-window-title').value;
    });
    document.getElementById('apply-window-content').addEventListener('click', function(){
       tmw.content = document.getElementById('set-window-content').value;
    });

    window.tmw = tmw;
});