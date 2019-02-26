document.addEventListener('DOMContentLoaded', function(){
    let window = new TmWindow();
    let openBtn = document.getElementById('open-window');
    openBtn.addEventListener('click', window.open.bind(window));

    document.getElementById('apply-window-title').addEventListener('click', function(){
       window.title = document.getElementById('set-window-title').value;
    });
    document.getElementById('apply-window-content').addEventListener('click', function(){
       window.content = document.getElementById('set-window-content').value;
    });
});