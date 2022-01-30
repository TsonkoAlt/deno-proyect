const eventSource = new EventSource('/reload');

eventSource.addEventListener('refresh', evt => {
    console.log(evt.data);
    if (evt.data === 'reload') {
        location.reload()
    }
});

eventSource.addEventListener('close', evt => {
    console.log(evt)
});

eventSource.addEventListener('open', () => {
    console.log('conectado');
});