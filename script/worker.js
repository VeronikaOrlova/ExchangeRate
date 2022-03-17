fetch('https://www.nbrb.by/api/exrates/currencies')
    .then(response => response.json())
    .then (payload => payload.filter((el) => Number(el.Cur_DateEnd.slice(0,4)) >= 2022))
    .then(payload => ({
        msg: 'cur',
        payload,
       })
    )
    .then(postMessage)
   
    addEventListener('message', ({data}) => {
        mapp[data.msg](data)
    })
    
    const mapp = {
        course: (data) => {
            getCourse(data)
        },
    }
    
    function getCourse(data){
        fetch(`https://www.nbrb.by/api/exrates/rates/${data.id}`)
        .then(response => response.json())
        .then(payload => ({
            msg: 'course',
            payload
        }))
        .then(postMessage)
    }



    





















/*

    function funcDynamics(data){
    
        const arr = data.chooseCur;
            
        let allRateTime = []
        let i = 0
        
        arr.forEach(el => {
            let request = el.Cur_DateStart.map((date) => fetch(`https://www.nbrb.by/api/exrates/rates/dynamics/${el.Cur_ID}?startdate=${date}&enddate=${el.Cur_DateEnd}`))
    
            Promise.all(request)
            .then(responses => Promise.all(responses.map(data => data.json())))
            .then(data => {
                data.forEach((el,id,arr) => {
    
                    if(el.length == 0) arr.splice(id)
                })
                
                i++
    
                data.forEach(ell => {
                    ell.forEach(elll => {
                        allRateTime.push(elll);
                    })  
                })
                    
                return allRateTime
            })
            .then(payload => {
                if(i === arr.length){
                    postMessage({
                        msg: 'graph',
                        payload
                    })
                }
            })
        })
    }*/