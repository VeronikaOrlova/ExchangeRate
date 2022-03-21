const worker3 = new Worker('/script/worker.js');
const mainCur = document.querySelector('.mainCur');

worker3.addEventListener('message', ({data}) => {
    if (data.msg !== 'course') return
    
       const p = document.createElement('p');
       p.innerText = `${data.payload.Cur_Scale} ${data.payload.Cur_Name} - ${data.payload.Cur_OfficialRate}`;

       mainCur.prepend(p);
           
})

worker3.postMessage({
    msg: 'course',
    id: 456,
})
worker3.postMessage({
    msg: 'course',
    id: 431,
})
worker3.postMessage({
    msg: 'course',
    id: 451,
})
worker3.postMessage({
    msg: 'course',
    id: 462,
})
